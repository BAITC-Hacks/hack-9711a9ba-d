<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['GET', 'POST', 'PATCH'], function (PDO $db, string $method): void {
    if ($method === 'GET') {
        onlyKeys($_GET, ['id']);
        if (array_key_exists('id', $_GET)) {
            respond(findRow($db, 'teams', positiveId($_GET['id'])));
            return;
        }
        respond($db->query('SELECT * FROM teams ORDER BY id')->fetchAll());
        return;
    }
    $data = body();
    $fields = ['name', 'interests', 'skills', 'technologies'];
    onlyKeys($data, $method === 'PATCH' ? array_merge(['id'], $fields) : $fields);
    if ($method === 'PATCH') {
        $id = positiveId($data['id'] ?? $_GET['id'] ?? null);
        $updates = array_intersect_key($data, array_flip($fields));
        if (!$updates) {
            fail('Передайте хотя бы одно поле профиля команды');
        }
        foreach ($updates as $field => $value) {
            $updates[$field] = textField($updates, $field, $field === 'name');
        }
        $team = transaction($db, function () use ($db, $id, $updates): array {
            findRow($db, 'teams', $id);
            $sets = array_map(static function (string $field): string {
                return "$field = ?";
            }, array_keys($updates));
            $db->prepare('UPDATE teams SET ' . implode(', ', $sets) . ' WHERE id = ?')
                ->execute(array_merge(array_values($updates), [$id]));
            return findRow($db, 'teams', $id);
        });
        respond($team);
        return;
    }
    $db->prepare('INSERT INTO teams (name, interests, skills, technologies) VALUES (?, ?, ?, ?)')
        ->execute([textField($data, 'name', true), textField($data, 'interests'),
            textField($data, 'skills'), textField($data, 'technologies')]);
    respond(['team_id' => (int) $db->lastInsertId()], 201);
});
