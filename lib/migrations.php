<?php
declare(strict_types=1);
require_once __DIR__ . '/../rating.php';

function migrateDatabase(PDO $db): void
{
    $db->exec('BEGIN IMMEDIATE');
    try {
        $schema = file_get_contents(__DIR__ . '/../schema.sql');
        if ($schema === false) {
            throw new RuntimeException('Не удалось прочитать schema.sql');
        }
        $db->exec($schema);
        $version = (int) $db->query('PRAGMA user_version')->fetchColumn();
        if ($version < 1) {
            $columns = array_column($db->query('PRAGMA table_info(cards)')->fetchAll(), 'name');
            foreach (['title', 'topic', 'need', 'interaction_format'] as $column) {
                if (!in_array($column, $columns, true)) {
                    $db->exec("ALTER TABLE cards ADD COLUMN $column TEXT NOT NULL DEFAULT ''");
                }
            }
            $columns = array_column($db->query('PRAGMA table_info(proposals)')->fetchAll(), 'name');
            if (!in_array('status', $columns, true)) {
                $db->exec("ALTER TABLE proposals ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'accepted', 'rejected'))");
                // Preserve earlier explicit decisions; this is not a new selection.
                $db->exec("UPDATE proposals SET status = CASE WHEN chosen = 1 THEN 'accepted' ELSE 'pending' END");
            }
            $cards = $db->query('SELECT * FROM cards')->fetchAll();
            $stmt = $db->prepare('UPDATE cards SET rating = ?, readiness_level = ? WHERE id = ?');
            foreach ($cards as $card) {
                $rating = calculateRating($card);
                $stmt->execute([$rating['rating'], $rating['level'], $card['id']]);
            }
            $db->exec("UPDATE tasks SET status = CASE WHEN EXISTS
                (SELECT 1 FROM cards WHERE task_id = tasks.id AND published = 1)
                THEN 'published' ELSE 'draft' END");
            $db->exec('PRAGMA user_version = 1');
        }
        $db->exec('COMMIT');
    } catch (Throwable $e) {
        $db->exec('ROLLBACK');
        throw $e;
    }
}
