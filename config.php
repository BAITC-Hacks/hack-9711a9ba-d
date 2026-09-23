<?php
declare(strict_types=1);

/** Small, explicit .env loader; secrets are read only by PHP. */
function loadSanaEnvironment(string $path): void
{
    if (!is_file($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES);
    if ($lines === false) {
        throw new RuntimeException('Не удалось прочитать .env');
    }
    $pending = [];
    foreach ($lines as $number => $line) {
        $line = trim($line);
        if ($number === 0) {
            $line = ltrim($line, "\xEF\xBB\xBF");
        }
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        if (!preg_match('/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/D', $line, $matches)) {
            throw new RuntimeException('Некорректная строка .env: ' . ($number + 1));
        }
        $name = $matches[1];
        if (!in_array($name, ['AI_API_KEY', 'AI_MODEL'], true) || getenv($name) !== false) {
            continue;
        }
        $value = trim($matches[2]);
        if ($value !== '' && ($value[0] === '"' || $value[0] === "'")) {
            if (strlen($value) < 2 || substr($value, -1) !== $value[0]) {
                throw new RuntimeException('Незакрытая кавычка .env: ' . ($number + 1));
            }
            $value = substr($value, 1, -1);
        }
        $pending[$name] = $value;
    }
    foreach ($pending as $name => $value) {
        putenv($name . '=' . $value);
    }
}

loadSanaEnvironment(__DIR__ . '/.env');
