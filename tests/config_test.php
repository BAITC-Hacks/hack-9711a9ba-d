<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

$names = ['AI_API_KEY', 'AI_MODEL', 'SANA_TEST_IGNORED'];
$original = [];
foreach ($names as $name) {
    $original[$name] = getenv($name);
    putenv($name);
}
$fixture = tempnam(sys_get_temp_dir(), 'sana-env-');
$checks = 0;
function configCheck(bool $condition, string $message): void
{
    global $checks;
    if (!$condition) {
        throw new RuntimeException($message);
    }
    $checks++;
}
try {
    loadSanaEnvironment($fixture . '.missing');
    configCheck(getenv('AI_API_KEY') === false, 'Missing .env should be optional');
    file_put_contents($fixture, "\xEF\xBB\xBF# Configuration\n\nAI_API_KEY = 'test-key'\nAI_MODEL=\"test-model\"\nSANA_TEST_IGNORED=ignored\n");
    loadSanaEnvironment($fixture);
    configCheck(getenv('AI_API_KEY') === 'test-key', 'BOM, comments and single quotes should be supported');
    configCheck(getenv('AI_MODEL') === 'test-model', 'Double quotes should be removed');
    configCheck(getenv('SANA_TEST_IGNORED') === false, 'Unknown environment names must not be set');

    putenv('AI_API_KEY=');
    putenv('AI_MODEL=from-environment');
    loadSanaEnvironment($fixture);
    configCheck(getenv('AI_API_KEY') === '', 'Explicitly empty environment key must disable external AI');
    configCheck(getenv('AI_MODEL') === 'from-environment', 'Process environment must take precedence');

    file_put_contents($fixture, "# A malformed line\nnot-an-assignment\n");
    try {
        loadSanaEnvironment($fixture);
        throw new LogicException('Malformed syntax should be rejected');
    } catch (RuntimeException $e) {
        configCheck(strpos($e->getMessage(), '2') !== false, 'Invalid configuration should identify its line');
    }
    putenv('AI_API_KEY');
    putenv('AI_MODEL');
    file_put_contents($fixture, "AI_API_KEY=should-not-be-applied\nAI_MODEL=\"unclosed\n");
    try {
        loadSanaEnvironment($fixture);
        throw new LogicException('Unclosed quote should be rejected');
    } catch (RuntimeException $e) {
        configCheck(strpos($e->getMessage(), '2') !== false, 'Unclosed quote should identify its line');
        configCheck(getenv('AI_API_KEY') === false, 'Invalid .env must not partially apply variables');
    }
    echo 'OK: ' . $checks . " configuration checks\n";
} finally {
    unlink($fixture);
    foreach ($original as $name => $value) {
        putenv($value === false ? $name : $name . '=' . $value);
    }
}
