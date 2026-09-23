<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';

api(['POST'], function (PDO $db): void {
    require_once __DIR__ . '/../ai_helper.php';
    $data = body();
    onlyKeys($data, ['task_id', 'answers']);
    $taskId = positiveId($data['task_id'] ?? null, 'task_id');
    $rawAnswers = array_key_exists('answers', $data) ? $data['answers'] : new stdClass();
    if (!$rawAnswers instanceof stdClass) {
        fail('answers должен быть JSON-объектом с текстовыми ответами');
    }
    $answers = (array) $rawAnswers;
    onlyKeys($answers, draftFields());
    foreach ($answers as $field => $answer) {
        textField($answers, $field);
    }
    $task = findRow($db, 'tasks', $taskId);
    try {
        $draft = buildAssistantDraft($task['raw_description'], $answers, $provider);
    } catch (InvalidArgumentException $e) {
        fail($e->getMessage(), 422);
    } catch (UnexpectedValueException $e) {
        error_log((string) $e);
        fail('Помощник вернул некорректный ответ. Карточка не сохранена.', 502);
    }
    $card = transaction($db, function () use ($db, $taskId, $draft): array {
        findRow($db, 'tasks', $taskId);
        $fields = draftFields();
        $columns = implode(', ', $fields);
        $values = [$taskId];
        foreach ($fields as $field) {
            $values[] = $draft[$field];
        }
        $marks = implode(', ', array_fill(0, count($values), '?'));
        $db->prepare("INSERT INTO cards (task_id, $columns) VALUES ($marks)")->execute($values);
        return findRow($db, 'cards', (int) $db->lastInsertId());
    });
    respond($provider + ['card_id' => (int) $card['id'],
        'card' => cardResponse($card), 'questions' => clarificationQuestions($card)], 201);
});
