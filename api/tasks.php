<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['GET', 'POST'], function (PDO $db, string $method): void {
    if ($method === 'GET') {
        if (!array_key_exists('id', $_GET)) {
            respond($db->query('SELECT * FROM tasks ORDER BY id DESC')->fetchAll());
            return;
        }
        respond(findRow($db, 'tasks', positiveId($_GET['id'] ?? null)));
        return;
    }
    $data = body();
    onlyKeys($data, ['raw_description']);
    $description = textField($data, 'raw_description', true);
    $stmt = $db->prepare("INSERT INTO tasks (raw_description, status) VALUES (?, 'draft')");
    $stmt->execute([$description]);
    respond(['task_id' => (int) $db->lastInsertId()], 201);
});
