<?php
declare(strict_types=1);

// The development server serves only the UI and public API endpoints.
// Database files, .env, seed scripts, source archives and tests stay private.
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
if ($path === '/' || $path === '/index.html' || $path === '/frontend' || $path === '/frontend/') {
    header('Location: /frontend/index.html', true, 302);
    return true;
}
if ($path === '/favicon.ico') {
    http_response_code(204);
    return true;
}
$endpoints = ['tasks', 'cards', 'catalog', 'questions', 'generate', 'publish', 'teams', 'proposals', 'choose'];
$allowedApi = preg_match('#^/api/([a-z]+)\.php$#D', $path, $match)
    && in_array($match[1], $endpoints, true);
$allowedAsset = preg_match('#^/frontend/[a-zA-Z0-9_/-]+\.(html|css|js|svg|png|jpg|webp|ico|woff2)$#D', $path)
    && strpos($path, '..') === false;
if (($allowedApi || $allowedAsset) && is_file(__DIR__ . $path)) {
    if ($allowedAsset && !in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'], true)) {
        http_response_code(405);
        header('Allow: GET, HEAD');
        return true;
    }
    header('X-Content-Type-Options: nosniff');
    return false;
}
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Страница не найдена'], JSON_UNESCAPED_UNICODE);
return true;
