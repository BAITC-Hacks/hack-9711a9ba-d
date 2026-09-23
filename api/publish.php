<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['PATCH'], function (PDO $db): void {
    $data = body();
    onlyKeys($data, ['card_id', 'published', 'confirmed']);
    $id = positiveId($data['card_id'] ?? null, 'card_id');
    $published = flag($data['published'] ?? null, 'published');
    if ($published === 1 && flag($data['confirmed'] ?? null, 'confirmed') !== 1) {
        fail('Перед публикацией необходимо явно подтвердить проверку карточки');
    }
    $card = transaction($db, function () use ($db, $id, $published): array {
        $card = findRow($db, 'cards', $id);
        if ($published === 1) {
            textField($card, 'title', true);
            textField($card, 'context', true);
        }
        $rating = calculateRating($card);
        $db->prepare('UPDATE cards SET published = ?, rating = ?, readiness_level = ? WHERE id = ?')
            ->execute([$published, $rating['rating'], $rating['level'], $id]);
        syncTaskStatus($db, (int) $card['task_id']);
        return findRow($db, 'cards', $id);
    });
    respond(cardResponse($card));
});
