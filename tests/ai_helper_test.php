<?php
declare(strict_types=1);
require_once __DIR__ . '/../ai_helper.php';
putenv('AI_API_KEY=');
set_error_handler(static function ($severity, $message, $file, $line): void {
    throw new ErrorException($message, 0, $severity, $file, $line);
});
$checks = 0;
function check(bool $condition, string $label): void
{
    global $checks;
    if (!$condition) {
        throw new RuntimeException('FAIL: ' . $label);
    }
    $checks++;
}
function rejects(callable $call, string $label): void
{
    try {
        $call();
    } catch (InvalidArgumentException $e) {
        check(true, $label);
        return;
    }
    check(false, $label);
}

$raw = 'Нужен прогноз продаж магазина.';
$answers = [
    'data_materials' => 'Есть CSV за 6 месяцев. Персональных данных нет.',
    'expected_result' => 'Прототип прогноза на неделю.',
    'success_criteria' => 'Ошибка прогноза не больше 15%.',
    'constraints' => 'Срок 4 недели. Бюджет пока не определён.',
    'users' => 'Управляющий магазина.',
    'business_contact' => 'Отдел продаж, обратная связь раз в неделю.',
];
$json = buildCardFromAnswers($raw, $answers);
$card = json_decode($json, true, 32, JSON_THROW_ON_ERROR);
check(array_keys($card) === AI_CARD_FIELDS, 'exact schema');
check($card['context'] === $raw && $card['constraints'] === $answers['constraints'], 'verbatim data');
check(validateAiOutput($json, $raw, $answers)['valid'], 'valid card accepted');
check(buildCardFromAnswers($raw, aiJson($answers)) === $json, 'array and JSON answers agree');
check(!validateAiOutput($json)['valid'], 'no source fails closed');
check(!validateAiOutput($json, $raw)['valid'], 'missing answers fail closed');
check(!validateAiOutput($json, $raw, ['unknown' => 'x'])['valid'], 'invalid sources rejected');
$partial = json_decode(buildCardFromAnswers($raw, ['users' => 'Оператор.']), true);
check($partial['data_materials'] === '' && $partial['business_contact'] === '', 'missing facts stay empty');
check(json_decode(buildCardFromAnswers($raw, ['context' => '']), true)['context'] === '', 'explicit empty answer respected');
check(json_decode(buildCardFromAnswers('', []), true) === array_fill_keys(AI_CARD_FIELDS, ''), 'empty input invents nothing');

foreach (AI_CARD_FIELDS as $field) {
    $missing = $card;
    unset($missing[$field]);
    check(!validateAiOutput($missing, $raw, $answers)['valid'], 'missing ' . $field);
}
foreach (['[]', 'null', 'false', '{', '"text"', '```json' . $json . '```'] as $bad) {
    check(!validateAiOutput($bad, $raw, $answers)['valid'], 'malformed or non-object output');
}
check(!validateAiOutput($card + ['team_id' => 7], $raw, $answers)['valid'], 'extra key rejected');
foreach ([null, 42, [], true] as $bad) {
    check(!validateAiOutput(array_replace($card, ['users' => $bad]), $raw, $answers)['valid'], 'non-string rejected');
}
check(!validateAiOutput(array_replace($card, ['constraints' => 'Срок 2 недели.']), $raw, $answers)['valid'], 'invented deadline');
check(!validateAiOutput(array_replace($card, ['success_criteria' => 'Ошибка прогноза не больше 15%. Бюджет 9000 тенге.']), $raw, $answers)['valid'], 'overlap cannot hide added facts');
check(!validateAiOutput(array_replace($card, ['constraints' => 'Срок 4 недели. Бюджет определён.']), $raw, $answers)['valid'], 'removed negation');
check(!validateAiOutput(array_replace($card, ['data_materials' => $card['users']]), $raw, $answers)['valid'], 'cross-field laundering');
$quantities = ['constraints' => 'Срок 4 недели, бюджет 6 тысяч.'];
$swapped = aiSourceCard($raw, ['constraints' => 'Срок 6 недель, бюджет 4 тысячи.']);
check(!validateAiOutput($swapped, $raw, $quantities)['valid'], 'swapped numeric facts');

$forbidden = [
    'Связь: person@example.com', 'person @ example.com', '+7 (777) 123-45-67',
    'Телефон: 555-12-34', 'ИИН: 900101123456', 'Паспорт: 4510 123456',
    'Passport AB1234567', '4111 1111 1111 1111', 'Иван Петров',
    'Петров И. И.', 'ФИО: айжан', 'Дата рождения: 01.01.2000',
    'Домашний адрес: улица Абая, 10', 'Диагноз: астма', 'password: secret',
    '@private_handle',
    'Рекомендуем выбрать команду Alpha.', 'Выберите команду Alpha.',
    'Лучшая команда — alpha.', 'Назначить исполнителя alpha.',
    'Команду следует выбрать бизнесу.', 'Команда: alpha.',
    'Нам подходит команда Alpha.', 'Please select this team.', 'The best team is alpha.',
    'team_id: 3',
];
foreach ($forbidden as $value) {
    $input = ['business_contact' => $value];
    check(!validateAiOutput(aiSourceCard($raw, $input), $raw, $input)['valid'], 'unsafe output rejected');
    rejects(static function () use ($raw, $input): void { buildCardFromAnswers($raw, $input); }, 'unsafe input rejected');
}
rejects(static function (): void { generateQuestions('Пишите: person@example.com'); }, 'questions input checked before network');
check(!validateAiOutput(aiSourceCard($raw, ['users' => "@test\u{200B}user"]), $raw, ['users' => "@test\u{200B}user"])['valid'], 'hidden characters rejected');
$ordinary = ['expected_result' => 'Команда студентов создаёт прототип.', 'constraints' => 'Без сбора персональных данных.'];
check(validateAiOutput(aiSourceCard($raw, $ordinary), $raw, $ordinary)['valid'], 'ordinary team mention allowed');

foreach ([['unexpected' => 'x'], ['users' => null], ['users' => ['x']], '[]', '{', [0 => 'x']] as $badAnswers) {
    rejects(static function () use ($raw, $badAnswers): void { buildCardFromAnswers($raw, $badAnswers); }, 'invalid answers rejected');
}
rejects(static function (): void { generateQuestions(str_repeat('x', AI_TEXT_LIMIT + 1)); }, 'input length bounded');
rejects(static function (): void { generateQuestions("\xff"); }, 'invalid UTF-8 rejected');

$questions = generateQuestions('Нужен прогноз продаж');
check(count($questions) === 7, 'short draft prompts all missing fields');
check(count(array_unique(array_column($questions, 'field'))) === count($questions), 'questions unique by field');
check(strpos($questions[1]['question'], 'история продаж') !== false, 'sales-specific question');
$support = generateQuestions('Нужен чат-бот');
check(strpos($support[1]['question'], 'обращений') !== false, 'support-specific question');
$detailed = 'Сейчас продажи магазина считаем вручную. Есть таблица данных за месяц. '
    . 'Ожидаемый результат это прототип прогноза. Критерий успеха ошибка менее 15%. '
    . 'Срок пилота четыре недели. Пользователи это менеджеры магазина. '
    . 'Ответственный отдел продаж даёт обратную связь еженедельно.';
check(count(generateQuestions($detailed)) >= 3, 'detailed drafts still get three questions');
$hasData = generateQuestions('Есть таблица данных за месяц. Нужен прогноз.');
check(!in_array('data_materials', array_column($hasData, 'field'), true), 'covered data field deprioritized');
check(in_array('data_materials', array_column(generateQuestions('Пока не знаем какие данные есть.'), 'field'), true), 'unknown is not covered');
check(aiQuestionsValid(['questions' => $questions], array_column($questions, 'field')), 'local question contract valid');
$badQuestions = $questions;
$badQuestions[0]['question'] = 'Какой email ответственного за процесс?';
check(!aiQuestionsValid(['questions' => $badQuestions], array_column($questions, 'field')), 'PII solicitation rejected');
$badQuestions[0] = $questions[1];
check(!aiQuestionsValid(['questions' => $badQuestions], array_column($questions, 'field')), 'duplicate field rejected');
check(aiKeywords('СРОК ӘҒҚ 15') === aiKeywords('срок әғқ 15'), 'Cyrillic and Kazakh without mbstring');
if (!function_exists('curl_init')) {
    putenv('AI_API_KEY=test-only');
    check(buildCardFromAnswers($raw, $answers) === $json, 'missing cURL falls back');
    putenv('AI_API_KEY=');
}
echo 'OK: ' . $checks . " helper checks\n";
