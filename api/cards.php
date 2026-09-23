<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_once __DIR__ . '/../rating.php';

api(['GET', 'POST', 'PATCH'], function (PDO $db, string $method): void {
    if ($method === 'GET') {
        respond(findRow($db, 'cards', positiveId($_GET['id'] ?? null)));
        return;
    }
    $data = body();
    if ($method === 'POST') {
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
