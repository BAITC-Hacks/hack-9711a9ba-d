<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['GET', 'POST'], function (PDO $db, string $method): void {
    if ($method === 'GET') {
        $cardId = positiveId($_GET['card_id'] ?? null, 'card_id');
        findRow($db, 'cards', $cardId);
        $stmt = $db->prepare('SELECT * FROM proposals WHERE card_id = ? ORDER BY id');
        $stmt->execute([$cardId]);
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
        findRow($db, 'cards', $cardId);
        findRow($db, 'teams', $teamId);
        $db->prepare('INSERT INTO proposals
            (card_id, team_id, solution_idea, plan, prototype_link, deadline)
            VALUES (?, ?, ?, ?, ?, ?)')->execute([$cardId, $teamId, $idea, $plan, $link, $deadline]);
        return (int) $db->lastInsertId();
    });
    respond(['proposal_id' => $id], 201);
});
