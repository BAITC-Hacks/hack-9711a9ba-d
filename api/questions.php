<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['GET', 'POST'], function (PDO $db, string $method): void {
    require_once __DIR__ . '/../ai_helper.php';
    $data = $method === 'POST' ? body() : $_GET;
    onlyKeys($data, ['task_id', 'card_id']);
    $id = positiveId($data['task_id'] ?? null, 'task_id');
    $task = findRow($db, 'tasks', $id);
    $card = buildCardDraft($task['raw_description'], []);
    if (array_key_exists('card_id', $data)) {
        $card = findRow($db, 'cards', positiveId($data['card_id'], 'card_id'));
        if ((int) $card['task_id'] !== $id) {
            fail('Карточка не относится к указанному черновику');
        }
    }
    try {
        $questions = assistantQuestions($task['raw_description'], $card, $provider);
    } catch (InvalidArgumentException $e) {
        fail($e->getMessage(), 422);
    }
    respond($provider + ['task_id' => $id,
        'questions' => $questions, 'rating_details' => ratingDetails($card)]);
});
