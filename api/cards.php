<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_once __DIR__ . '/../rating.php';
require_once __DIR__ . '/../ai_helper.php';

api(['GET', 'POST', 'PATCH'], function (PDO $db, string $method): void {
    if ($method === 'GET') {
        respond(cardResponse(findRow($db, 'cards', positiveId($_GET['id'] ?? null))));
        return;
    }
    $data = body();
    $editable = array_merge(CARD_FIELDS, CARD_METADATA);
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
        onlyKeys($data, array_merge(['task_id'], $editable));
        $taskId = positiveId($data['task_id'] ?? null, 'task_id');
        $values = [$taskId];
        foreach ($editable as $field) {
            $values[] = textField($data, $field);
        }
        $id = transaction($db, function () use ($db, $taskId, $values, $editable): int {
            findRow($db, 'tasks', $taskId);
            $columns = implode(', ', $editable);
            $marks = implode(', ', array_fill(0, count($values), '?'));
            $db->prepare("INSERT INTO cards (task_id, $columns) VALUES ($marks)")->execute($values);
            return (int) $db->lastInsertId();
        });
        respond(['card_id' => $id], 201);
        return;
    }
    onlyKeys($data, ['id', 'field', 'value', 'confirmed']);
    $id = positiveId($data['id'] ?? $_GET['id'] ?? null);
    $field = $data['field'] ?? null;
    if (!in_array($field, $editable, true)) {
        fail('Недопустимое поле карточки');
    }
    $scored = in_array($field, CARD_FIELDS, true);
    if (!$scored && array_key_exists('confirmed', $data)) {
        fail('У этого поля нет отдельного флага подтверждения');
    }
    $confirmed = $scored ? flag(array_key_exists('confirmed', $data) ? $data['confirmed'] : 1, 'confirmed') : 0;
    if (!array_key_exists('value', $data)) {
        fail('Необходимо передать value');
    }
    $value = textField($data, 'value', $scored && $confirmed === 1);
    $card = transaction($db, function () use ($db, $id, $field, $value, $scored, $confirmed): array {
        $card = findRow($db, 'cards', $id);
        $changed = $card[$field] !== $value || ($scored && (int) $card[$field . '_confirmed'] !== $confirmed);
        $card[$field] = $value;
        if ($scored) {
            $card[$field . '_confirmed'] = $confirmed;
        }
        $rating = calculateRating($card);
        $set = "$field = ?, rating = ?, readiness_level = ?, published = ?";
        $params = [$value, $rating['rating'], $rating['level'], $changed ? 0 : $card['published']];
        if ($scored) {
            $set .= ", {$field}_confirmed = ?";
            $params[] = $confirmed;
        }
        $params[] = $id;
        $db->prepare("UPDATE cards SET $set WHERE id = ?")->execute($params);
        syncTaskStatus($db, (int) $card['task_id']);
        return findRow($db, 'cards', $id);
    });
    respond(cardResponse($card));
});
