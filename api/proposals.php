<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['GET', 'POST'], function (PDO $db, string $method): void {
    if ($method === 'GET') {
        onlyKeys($_GET, ['card_id', 'team_id']);
        $where = [];
        $params = [];
        foreach (['card_id' => 'cards', 'team_id' => 'teams'] as $field => $table) {
            if (array_key_exists($field, $_GET)) {
                $id = positiveId($_GET[$field], $field);
                findRow($db, $table, $id);
                $where[] = "p.$field = ?";
                $params[] = $id;
            }
        }
        if (!$where) {
            fail('Необходимо передать card_id или team_id');
        }
        $stmt = $db->prepare('SELECT p.*, t.name AS team_name, t.interests AS team_interests,
            t.skills AS team_skills, t.technologies AS team_technologies, c.title AS card_title
            FROM proposals p JOIN teams t ON t.id = p.team_id JOIN cards c ON c.id = p.card_id
            WHERE ' . implode(' AND ', $where) . ' ORDER BY p.id');
        $stmt->execute($params);
        respond($stmt->fetchAll());
        return;
    }
    $data = body();
    onlyKeys($data, ['card_id', 'team_id', 'solution_idea', 'plan', 'prototype_link', 'deadline']);
    $cardId = positiveId($data['card_id'] ?? null, 'card_id');
    $teamId = positiveId($data['team_id'] ?? null, 'team_id');
    $idea = textField($data, 'solution_idea', true);
    $plan = textField($data, 'plan', true);
    $link = textField($data, 'prototype_link');
    if ($link !== '' && (!filter_var($link, FILTER_VALIDATE_URL) ||
        !in_array(strtolower((string) parse_url($link, PHP_URL_SCHEME)), ['http', 'https'], true))) {
        fail('prototype_link должен быть HTTP/HTTPS-ссылкой или пустой строкой');
    }
    $deadline = textField($data, 'deadline', true);
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $deadline);
    if (!$date || $date->format('Y-m-d') !== $deadline) {
        fail('deadline должен быть корректной датой в формате YYYY-MM-DD');
    }
    $id = transaction($db, function () use ($db, $cardId, $teamId, $idea, $plan, $link, $deadline): int {
        $card = findRow($db, 'cards', $cardId);
        if ((int) $card['published'] !== 1) {
            fail('Отправить предложение можно после публикации карточки', 409);
        }
        findRow($db, 'teams', $teamId);
        $db->prepare('INSERT INTO proposals
            (card_id, team_id, solution_idea, plan, prototype_link, deadline)
            VALUES (?, ?, ?, ?, ?, ?)')->execute([$cardId, $teamId, $idea, $plan, $link, $deadline]);
        return (int) $db->lastInsertId();
    });
    respond(['proposal_id' => $id], 201);
});
