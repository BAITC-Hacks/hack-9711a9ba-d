<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_once __DIR__ . '/../rating.php';
require_once __DIR__ . '/../ai_helper.php';

api(['GET', 'POST', 'PATCH'], function (PDO $db, string $method): void {
    if ($method === 'GET') {
        respond(findRow($db, 'cards', positiveId($_GET['id'] ?? null)));
        return;
    }
    $data = body();
    if ($method === 'POST') {
        // AI preparation happens before the short SQLite write transaction.
        // The source description always comes from the saved task.
        if (array_key_exists('action', $data)) {
            $action = $data['action'];
            if (!in_array($action, ['questions', 'build'], true)) {
                fail('action должен быть questions или build');
            }
            onlyKeys($data, $action === 'questions'
                ? ['action', 'task_id'] : ['action', 'task_id', 'answers']);
            $taskId = positiveId($data['task_id'] ?? null, 'task_id');
            $task = findRow($db, 'tasks', $taskId);
            try {
                if ($action === 'questions') {
                    respond(['task_id' => $taskId,
                        'questions' => generateQuestions($task['raw_description'])]);
                    return;
                }
                if (!isset($data['answers']) || !$data['answers'] instanceof stdClass) {
                    fail('answers должен быть JSON-объектом с ответами по полям');
                }
                $cardJson = buildCardFromAnswers($task['raw_description'], (array) $data['answers']);
                // buildCardFromAnswers validates both AI and fallback before returning.
                $data = ['task_id' => $taskId] + json_decode($cardJson, true, 32, JSON_THROW_ON_ERROR);
            } catch (InvalidArgumentException $e) {
                fail($e->getMessage(), 422);
            }
        }
        onlyKeys($data, array_merge(['task_id'], CARD_FIELDS));
        $taskId = positiveId($data['task_id'] ?? null, 'task_id');
        $values = [$taskId];
        foreach (CARD_FIELDS as $field) {
            $values[] = textField($data, $field);
        }
        $id = transaction($db, function () use ($db, $taskId, $values): int {
            findRow($db, 'tasks', $taskId);
            $columns = implode(', ', CARD_FIELDS);
            $db->prepare("INSERT INTO cards (task_id, $columns) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
                ->execute($values);
            return (int) $db->lastInsertId();
        });
        respond(['card_id' => $id], 201);
        return;
    }
    onlyKeys($data, ['id', 'field', 'value']);
    $id = positiveId($data['id'] ?? $_GET['id'] ?? null);
    $field = $data['field'] ?? null;
    if (!in_array($field, CARD_FIELDS, true)) {
        fail('field должен быть одним из семи текстовых полей карточки');
    }
    $value = textField($data, 'value', true);
    $card = transaction($db, function () use ($db, $id, $field, $value): array {
        $card = findRow($db, 'cards', $id);
        $card[$field] = $value;
        $card[$field . '_confirmed'] = 1;
        $rating = calculateRating($card);
        $db->prepare("UPDATE cards SET $field = ?, {$field}_confirmed = 1,
            rating = ?, readiness_level = ? WHERE id = ?")
            ->execute([$value, $rating['rating'], $rating['level'], $id]);
        return findRow($db, 'cards', $id);
    });
    respond($card);
});
