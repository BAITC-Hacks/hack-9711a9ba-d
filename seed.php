<?php
declare(strict_types=1);

ini_set('display_errors', '0');
if (PHP_SAPI !== 'cli') {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(405);
    echo json_encode(['error' => 'Запустите seed.php из командной строки'], JSON_UNESCAPED_UNICODE);
    exit;
}

$locked = false;
try {
    $db = require __DIR__ . '/db.php';
    require_once __DIR__ . '/rating.php';
    $db->exec('PRAGMA busy_timeout = 5000');
    require_once __DIR__ . '/lib/migrations.php';
    migrateDatabase($db);
    $db->exec('BEGIN IMMEDIATE');
    $locked = true;
    foreach (['tasks', 'cards', 'teams', 'proposals'] as $table) {
        if ((int) $db->query("SELECT COUNT(*) FROM $table")->fetchColumn() > 0) {
            $db->exec('ROLLBACK');
            $locked = false;
            echo json_encode(['status' => 'skipped', 'message' => 'База уже содержит данные; seed не добавлен.'], JSON_UNESCAPED_UNICODE) . PHP_EOL;
            exit;
        }
    }
    $fields = ['context', 'data_materials', 'expected_result', 'success_criteria', 'constraints', 'users', 'business_contact'];
    $columns = [
        'tasks' => ['id', 'raw_description', 'status'],
        'cards' => array_merge(['id', 'task_id', 'title', 'topic', 'need', 'interaction_format'], $fields, array_map(function ($f) { return $f . '_confirmed'; }, $fields), ['rating', 'readiness_level', 'published']),
        'teams' => ['id', 'name', 'interests', 'skills', 'technologies'],
        'proposals' => ['id', 'card_id', 'team_id', 'solution_idea', 'plan', 'prototype_link', 'deadline', 'chosen'],
    ];
    foreach ($columns as $table => $names) {
        $json = file_get_contents(__DIR__ . '/data/' . $table . '_seed.json');
        if ($json === false) {
            throw new RuntimeException('Не удалось прочитать seed: ' . $table);
        }
        $rows = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($rows) || count($rows) !== 5) {
            throw new RuntimeException('Ожидалось 5 записей: ' . $table);
        }
        $sql = 'INSERT INTO ' . $table . ' (' . implode(', ', $names) . ') VALUES (' . implode(', ', array_fill(0, count($names), '?')) . ')';
        $stmt = $db->prepare($sql);
        foreach ($rows as $row) {
            if (!is_array($row)) {
                throw new RuntimeException('Некорректная запись: ' . $table);
            }
            if ($table === 'cards') {
                foreach (['title', 'topic', 'need', 'interaction_format'] as $extra) {
                    $row[$extra] = $row[$extra] ?? '';
                }
                $rating = calculateRating($row);
                $row['rating'] = $rating['rating'];
                $row['readiness_level'] = $rating['level'];
            }
            if ($table === 'proposals') {
                $row['chosen'] = 0;
            }
            $values = [];
            foreach ($names as $name) {
                if (!array_key_exists($name, $row)) {
                    throw new RuntimeException('Отсутствует поле ' . $table . '.' . $name);
                }
                $values[] = $row[$name];
            }
            $stmt->execute($values);
        }
    }
    $db->exec("UPDATE tasks SET status = CASE WHEN EXISTS
        (SELECT 1 FROM cards WHERE task_id = tasks.id AND published = 1)
        THEN 'published' ELSE 'draft' END");
    $db->exec('COMMIT');
    $locked = false;
    echo json_encode(['status' => 'created', 'tasks' => 5, 'cards' => 5, 'teams' => 5, 'proposals' => 5], JSON_UNESCAPED_UNICODE) . PHP_EOL;
} catch (Throwable $e) {
    if ($locked) {
        $db->exec('ROLLBACK');
    }
    error_log((string) $e);
    echo json_encode(['error' => 'Не удалось загрузить seed-данные. Проверьте файлы и журнал PHP.'], JSON_UNESCAPED_UNICODE) . PHP_EOL;
    exit(1);
}
