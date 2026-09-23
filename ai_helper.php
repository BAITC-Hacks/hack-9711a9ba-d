<?php
declare(strict_types=1);
require_once __DIR__ . '/rating.php';

/** Local deterministic fallback. It does not call or train a language model. */
function draftFields(): array
{
    return array_merge(array_keys(ratingWeights()), ['title', 'topic', 'need', 'interaction_format']);
}

function buildCardDraft(string $description, array $answers): array
{
    $card = array_fill_keys(draftFields(), '');
    // Verbatim user input only. Missing facts are left blank.
    $card['context'] = $description;
    foreach ($answers as $field => $answer) {
        if (!in_array($field, draftFields(), true) || !is_string($answer)) {
            throw new InvalidArgumentException('Ответы должны содержать только текстовые поля карточки');
        }
        $card[$field] = trim($answer);
    }
    return $card;
}

function clarificationQuestions(array $card): array
{
    $templates = [
        'context' => 'Что происходит сейчас, в чём проблема и что нужно изменить?',
        'data_materials' => 'Какие данные, примеры или материалы доступны и как команда получит к ним доступ?',
        'expected_result' => 'Какой конкретный результат должна передать команда: прототип, отчёт или другой продукт?',
        'success_criteria' => 'По каким измеримым признакам вы примете результат и как их проверите?',
        'constraints' => 'Какие есть сроки, ограничения по технологиям, бюджету и доступу к данным?',
        'users' => 'Кто будет пользоваться решением и какую задачу эти люди выполняют?',
        'business_contact' => 'Кто отвечает за задачу, как связаться и как часто получать обратную связь?',
    ];
    $questions = [];
    $seen = [];
    foreach (ratingDetails($card)['missing_fields'] as $missing) {
        $field = $missing['field'];
        $questions[] = ['field' => $field, 'question' => $templates[$field], 'reason' => $missing['reason']];
        $seen[$field] = true;
    }
    // A fully described card still gets at least three review questions.
    foreach ($templates as $field => $question) {
        if (count($questions) >= 3) {
            break;
        }
        if (!isset($seen[$field])) {
            $questions[] = ['field' => $field, 'question' => 'Проверьте актуальность: ' . $question, 'reason' => 'review'];
        }
    }
    return $questions;
}

/** Output boundary for the stub and any future AI provider. */
function validateAssistantOutput(array $output, string $description, array $answers): array
{
    if (!isset($output['card'], $output['questions']) || !is_array($output['card']) ||
        !is_array($output['questions']) || count($output['questions']) < 3 || count($output['questions']) > 7) {
        throw new UnexpectedValueException('Некорректная структура ответа помощника');
    }
    $expected = buildCardDraft($description, $answers);
    if (count($output['card']) !== count($expected)) {
        throw new UnexpectedValueException('Некорректные поля ответа помощника');
    }
    foreach ($expected as $field => $value) {
        if (!array_key_exists($field, $output['card']) || $output['card'][$field] !== $value) {
            throw new UnexpectedValueException('Ответ помощника содержит неподтверждённые исходными данными факты');
        }
    }
    $seen = [];
    foreach ($output['questions'] as $question) {
        if (!is_array($question) || !isset($question['field'], $question['question'], $question['reason']) ||
            !in_array($question['field'], array_keys(ratingWeights()), true) ||
            !is_string($question['question']) || preg_match('/\S/u', $question['question']) !== 1 ||
            !in_array($question['reason'], ['empty', 'not_confirmed', 'review'], true) ||
            isset($seen[$question['field']])) {
            throw new UnexpectedValueException('Некорректный уточняющий вопрос');
        }
        $seen[$question['field']] = true;
    }
    return $output;
}

function localAssistant(string $description, array $answers): array
{
    $card = buildCardDraft($description, $answers);
    return validateAssistantOutput(['card' => $card, 'questions' => clarificationQuestions($card)], $description, $answers);
}
