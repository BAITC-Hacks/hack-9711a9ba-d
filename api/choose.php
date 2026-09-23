<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

// This endpoint is invoked only by an explicit manual business action.
api(['PATCH'], function (PDO $db): void {
    $data = body();
    onlyKeys($data, ['proposal_id', 'decision']);
    $id = positiveId($data['proposal_id'] ?? null, 'proposal_id');
    $decision = array_key_exists('decision', $data) ? $data['decision'] : 'accepted';
    if (!in_array($decision, ['accepted', 'rejected', 'pending'], true)) {
        fail('decision: accepted (принять), rejected (отклонить), pending (отменить решение)');
    }
    $proposal = transaction($db, function () use ($db, $id, $decision): array {
        findRow($db, 'proposals', $id);
        $db->prepare('UPDATE proposals SET chosen = ?, status = ? WHERE id = ?')
            ->execute([$decision === 'accepted' ? 1 : 0, $decision, $id]);
        return findRow($db, 'proposals', $id);
    });
    respond($proposal);
});
