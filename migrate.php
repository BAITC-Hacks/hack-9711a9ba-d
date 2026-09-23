<?php
declare(strict_types=1);
ini_set('display_errors', '0');
if (PHP_SAPI !== 'cli') {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(405);
    echo json_encode(['error' => 'Запустите migrate.php из командной строки'], JSON_UNESCAPED_UNICODE);
    exit;
}
try {
    $db = require __DIR__ . '/db.php';
    require_once __DIR__ . '/lib/migrations.php';
    migrateDatabase($db);
    echo json_encode(['status' => 'ok', 'schema_version' => 1], JSON_UNESCAPED_UNICODE) . PHP_EOL;
} catch (Throwable $e) {
    error_log((string) $e);
    echo json_encode(['error' => 'Не удалось обновить схему. Проверьте журнал PHP.'], JSON_UNESCAPED_UNICODE) . PHP_EOL;
    exit(1);
}
