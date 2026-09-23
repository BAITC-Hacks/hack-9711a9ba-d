<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../rating.php';

function respond($data, int $status = 200): void
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    http_response_code($status);
    echo $json;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    respond(['ok' => true]);
    exit;
}

class ApiError extends RuntimeException {}

const CARD_FIELDS = ['context', 'data_materials', 'expected_result',
    'success_criteria', 'constraints', 'users', 'business_contact'];
const CARD_METADATA = ['title', 'topic', 'need', 'interaction_format'];
const API_TEXT_LIMIT = 12000;

function fail(string $message, int $status = 400): void
{
    throw new ApiError($message, $status);
}

function body(): array
{
    $contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '', 2)[0]));
    if ($contentType !== 'application/json') {
        fail('Требуется Content-Type: application/json', 415);
    }
    try {
        $value = json_decode(file_get_contents('php://input'), false, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        fail('Некорректный JSON');
    }
    if (!$value instanceof stdClass) {
        fail('Тело запроса должно быть JSON-объектом');
    }
    return (array) $value;
}

function onlyKeys(array $data, array $allowed): void
{
    if (array_diff(array_keys($data), $allowed)) {
        fail('Переданы неподдерживаемые поля');
    }
}

function positiveId($value, string $name = 'id'): int
{
    if ((!is_int($value) && !is_string($value)) ||
        !preg_match('/^[1-9][0-9]*$/D', (string) $value) ||
        filter_var($value, FILTER_VALIDATE_INT) === false) {
        fail('Поле ' . $name . ' должно быть положительным целым числом');
    }
    return (int) $value;
}

function textField(array $data, string $name, bool $required = false): string
{
    $value = array_key_exists($name, $data) ? $data[$name] : '';
    if (!is_string($value) || ($required && preg_match('/\S/u', $value) !== 1)) {
        fail('Поле ' . $name . ' должно содержать ' . ($required ? 'непустую строку' : 'строку'));
    }
    if (strlen($value) > API_TEXT_LIMIT || preg_match('//u', $value) !== 1
        || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', $value)) {
        fail('Поле ' . $name . ' должно содержать текст UTF-8 до 12000 байт без управляющих символов');
    }
    return trim($value);
}

function flag($value, string $name): int
{
    if (!in_array($value, [0, 1, false, true], true)) {
        fail('Поле ' . $name . ' должно быть 0, 1, false или true');
    }
    return (int) $value;
}

function cardResponse(array $card): array
{
    $card['rating_details'] = ratingDetails($card);
    return $card;
}

function syncTaskStatus(PDO $db, int $taskId): void
{
    $db->prepare("UPDATE tasks SET status = CASE WHEN EXISTS
        (SELECT 1 FROM cards WHERE task_id = ? AND published = 1)
        THEN 'published' ELSE 'draft' END WHERE id = ?")->execute([$taskId, $taskId]);
}

function findRow(PDO $db, string $table, int $id): array
{
    // Table names come only from endpoint code, never from user input.
    $stmt = $db->prepare("SELECT * FROM $table WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        fail('Запись не найдена: ' . $table, 404);
    }
    return $row;
}

function transaction(PDO $db, callable $action)
{
    $db->exec('BEGIN IMMEDIATE');
    try {
        $result = $action();
        $db->exec('COMMIT');
        return $result;
    } catch (Throwable $e) {
        $db->exec('ROLLBACK');
        throw $e;
    }
}

function api(array $methods, callable $action): void
{
    try {
        $method = $_SERVER['REQUEST_METHOD'] ?? '';
        if (!in_array($method, $methods, true)) {
            header('Allow: ' . implode(', ', array_merge($methods, ['OPTIONS'])));
            fail('Метод не поддерживается', 405);
        }
        $db = require __DIR__ . '/../db.php';
        $db->exec('PRAGMA busy_timeout = 5000');
        $action($db, $method);
    } catch (ApiError $e) {
        respond(['error' => $e->getMessage()], $e->getCode());
    } catch (Throwable $e) {
        error_log((string) $e);
        respond(['error' => 'Внутренняя ошибка сервера. Проверьте инициализацию БД и журнал PHP.'], 500);
    }
}
