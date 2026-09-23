<?php
declare(strict_types=1);
// Run with php -n: substitute the cURL boundary; never contact a paid API.
if (extension_loaded('curl')) {
    fwrite(STDERR, "Run this test with php -n (without the cURL extension).\n");
    exit(1);
}
foreach (['CURLOPT_POST', 'CURLOPT_HTTPHEADER', 'CURLOPT_POSTFIELDS',
    'CURLOPT_CONNECTTIMEOUT', 'CURLOPT_TIMEOUT', 'CURLOPT_FOLLOWLOCATION',
    'CURLOPT_SSL_VERIFYPEER', 'CURLOPT_SSL_VERIFYHOST', 'CURLOPT_WRITEFUNCTION',
    'CURLINFO_HTTP_CODE'] as $i => $name) {
    define($name, $i + 1);
}
$transport = ['body' => '', 'status' => 200, 'fail' => false, 'calls' => 0];
function curl_init($url) { global $transport; $transport['url'] = $url; return new stdClass(); }
function curl_setopt_array($handle, $options) { global $transport; $transport['options'] = $options; return true; }
function curl_exec($handle) {
    global $transport;
    $transport['calls']++;
    if ($transport['fail']) { return false; }
    $written = $transport['options'][CURLOPT_WRITEFUNCTION]($handle, $transport['body']);
    return $written === strlen($transport['body']);
}
function curl_getinfo($handle, $option) { global $transport; return $transport['status']; }
function curl_close($handle) {}
require_once __DIR__ . '/../ai_helper.php';
$checks = 0;
function check(bool $condition, string $label): void {
    global $checks;
    if (!$condition) { throw new RuntimeException('FAIL: ' . $label); }
    $checks++;
}
function responseBody($data): string {
    return aiJson(['status' => 'completed', 'output' => [
        ['type' => 'reasoning', 'summary' => []],
        ['type' => 'message', 'content' => [['type' => 'output_text', 'text' => aiJson($data)]]],
    ]]);
}
putenv('AI_API_KEY=test-only-not-a-real-key');
putenv('AI_MODEL=test-model');
$raw = 'Нужен прогноз продаж.';
$answers = ['users' => 'Управляющий магазина.'];
$card = aiSourceCard($raw, $answers);
$transport['body'] = responseBody($card);
check(buildCardFromAnswers($raw, $answers) === aiJson($card), 'valid API card accepted');
check($transport['calls'] === 1, 'API branch was called');
$payload = json_decode($transport['options'][CURLOPT_POSTFIELDS], true);
check($transport['url'] === 'https://api.openai.com/v1/responses', 'fixed HTTPS destination');
check($payload['model'] === 'test-model' && $payload['store'] === false, 'server-side model and no storage');
check($payload['text']['format']['type'] === 'json_object', 'JSON mode requested');
check(strpos($payload['instructions'], 'чистый JSON') !== false, 'prompt explicitly requests pure JSON');
check($transport['options'][CURLOPT_TIMEOUT] === 15 && !$transport['options'][CURLOPT_FOLLOWLOCATION], 'bounded timeout and no redirects');
check($transport['options'][CURLOPT_SSL_VERIFYPEER] && $transport['options'][CURLOPT_SSL_VERIFYHOST] === 2, 'TLS verification enabled');

$questions = aiLocalQuestions($raw);
$questions[0]['question'] = 'В каком процессе продаж сейчас возникают ошибки и как часто это происходит?';
$transport['body'] = responseBody(['questions' => $questions]);
check(generateQuestions($raw) === $questions, 'valid API questions used, not local templates');
foreach (['broken', responseBody(['context' => 'invented']),
    responseBody(array_replace($card, ['constraints' => 'Бюджет 9000 тенге.'])),
    responseBody(array_replace($card, ['users' => 'Рекомендуем команду Alpha.'])),
    responseBody(array_replace($card, ['business_contact' => 'person@example.com'])),
    aiJson(['status' => 'incomplete', 'output' => []]),
    aiJson(['status' => 'completed', 'output' => [['type' => 'message', 'content' => [['type' => 'refusal', 'refusal' => 'No']]]]]),
    str_repeat('x', 262145)] as $bad) {
    $transport['body'] = $bad;
    check(buildCardFromAnswers($raw, $answers) === aiJson($card), 'invalid API card falls back');
    check(generateQuestions($raw) === aiLocalQuestions($raw), 'invalid API questions fall back');
}
foreach ([401, 429, 500] as $status) {
    $transport['status'] = $status;
    $transport['body'] = responseBody($card);
    check(buildCardFromAnswers($raw, $answers) === aiJson($card), 'HTTP error fallback');
}
$transport['status'] = 200;
$transport['fail'] = true;
check(buildCardFromAnswers($raw, $answers) === aiJson($card), 'network failure/timeout fallback');
$calls = $transport['calls'];
try { generateQuestions('Контакт: person@example.com'); } catch (InvalidArgumentException $e) {}
check($transport['calls'] === $calls, 'unsafe input never sent to provider');
try {
    buildCardFromAnswers($raw, ['users' => 'Команда студентов.', 'constraints' => 'Рекомендуем выбрать.']);
} catch (InvalidArgumentException $e) {}
check($transport['calls'] === $calls, 'cross-field selection blocked before HTTP');
putenv('AI_API_KEY=');
check(buildCardFromAnswers($raw, $answers) === aiJson($card) && $transport['calls'] === $calls, 'missing key skips HTTP');
echo 'OK: ' . $checks . " transport checks\n";
