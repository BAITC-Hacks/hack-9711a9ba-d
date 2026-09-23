<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['GET'], function (PDO $db): void {
    $sort = textField($_GET, 'sort');
    if ($sort !== '' && $sort !== 'rating') {
        fail('Поддерживается только sort=rating');
    }
    $level = textField($_GET, 'level');
    if ($level !== '' && !in_array($level, ['проект', 'в работе', 'готово', 'приоритет'], true)) {
        fail('Неизвестный уровень готовности');
    }
    $topic = textField($_GET, 'topic');
    // SQLite LOWER/LIKE do not provide full Unicode case folding.
    $db->sqliteCreateFunction('contains_topic', function ($text, $query): int {
        return preg_match('~' . preg_quote($query, '~') . '~iu', $text) === 1 ? 1 : 0;
    }, 2);
    $sql = 'SELECT * FROM cards WHERE published = 1';
    $params = [];
    if ($level !== '') {
        $sql .= ' AND readiness_level = ?';
        $params[] = $level;
    }
    if ($topic !== '') {
        $fields = ['context', 'data_materials', 'expected_result', 'success_criteria', 'constraints', 'users'];
        $sql .= ' AND (' . implode(' OR ', array_map(function ($field) {
            return "contains_topic($field, ?) = 1";
        }, $fields)) . ')';
        $params = array_merge($params, array_fill(0, count($fields), $topic));
    }
    $sql .= $sort === 'rating' ? ' ORDER BY rating DESC, id ASC' : ' ORDER BY id ASC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond($stmt->fetchAll());
});
