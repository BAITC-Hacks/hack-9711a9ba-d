<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_once __DIR__ . '/../ai_helper.php';

api(['POST'], function (PDO $db): void {
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
        $result = localAssistant($task['raw_description'], $answers);
    } catch (UnexpectedValueException $e) {
        error_log((string) $e);
        fail('Помощник вернул некорректный ответ. Карточка не сохранена.', 502);
    }
    $card = transaction($db, function () use ($db, $taskId, $result): array {
        findRow($db, 'tasks', $taskId);
        $fields = draftFields();
        $columns = implode(', ', $fields);
        $values = [$taskId];
        foreach ($fields as $field) {
            $values[] = $result['card'][$field];
        }
        $marks = implode(', ', array_fill(0, count($values), '?'));
        $db->prepare("INSERT INTO cards (task_id, $columns) VALUES ($marks)")->execute($values);
        return findRow($db, 'cards', (int) $db->lastInsertId());
    });
    respond(['provider' => 'local_stub', 'card_id' => (int) $card['id'],
        'card' => cardResponse($card), 'questions' => $result['questions']], 201);
});
