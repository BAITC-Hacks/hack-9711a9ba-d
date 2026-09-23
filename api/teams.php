<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['GET', 'POST'], function (PDO $db, string $method): void {
    if ($method === 'GET') {
        respond($db->query('SELECT * FROM teams ORDER BY id')->fetchAll());
        return;
    }
    $data = body();
    onlyKeys($data, ['name', 'interests', 'skills', 'technologies']);
    $db->prepare('INSERT INTO teams (name, interests, skills, technologies) VALUES (?, ?, ?, ?)')
        ->execute([textField($data, 'name', true), textField($data, 'interests'),
            textField($data, 'skills'), textField($data, 'technologies')]);
    respond(['team_id' => (int) $db->lastInsertId()], 201);
});
