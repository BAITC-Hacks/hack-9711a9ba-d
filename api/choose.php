<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

// This endpoint is invoked only by an explicit manual business action.
api(['PATCH'], function (PDO $db): void {
    $data = body();
    onlyKeys($data, ['proposal_id']);
    $id = positiveId($data['proposal_id'] ?? null, 'proposal_id');
    $proposal = transaction($db, function () use ($db, $id): array {
        $proposal = findRow($db, 'proposals', $id);
        $db->prepare('UPDATE proposals SET chosen = 0 WHERE card_id = ?')
            ->execute([$proposal['card_id']]);
        $db->prepare('UPDATE proposals SET chosen = 1 WHERE id = ?')->execute([$id]);
        return findRow($db, 'proposals', $id);
    });
    respond($proposal);
});
