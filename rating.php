<?php
declare(strict_types=1);

function ratingWeights(): array
{
    return [
        'context' => 20,
        'data_materials' => 20,
        'expected_result' => 15,
        'success_criteria' => 15,
        'constraints' => 10,
        'users' => 10,
        'business_contact' => 10,
    ];

}

function ratingLevel(int $rating): string
{
    if ($rating < 40) {
        $level = 'проект';
    } elseif ($rating < 70) {
        $level = 'в работе';
    } elseif ($rating < 90) {
        $level = 'готово';
    } else {
        $level = 'приоритет';
    }

    return $level;
}

function ratingDetails(array $card): array
{
    $rating = 0;
    $breakdown = [];
    $missing = [];
    foreach (ratingWeights() as $field => $weight) {
        $text = $card[$field] ?? '';
        $filled = is_string($text) && preg_match('/\S/u', $text) === 1;
        $confirmed = in_array($card[$field . '_confirmed'] ?? 0, [1, '1', true], true);
        $points = $filled && $confirmed ? $weight : 0;
        $rating += $points;
        $breakdown[] = ['field' => $field, 'weight' => $weight, 'points' => $points,
            'filled' => $filled, 'confirmed' => $confirmed];
        if ($points === 0) {
            $missing[] = ['field' => $field, 'potential_points' => $weight,
                'reason' => $filled ? 'not_confirmed' : 'empty',
                'action' => $filled ? 'Подтвердите поле' : 'Заполните и подтвердите поле'];
        }
    }
    return ['rating' => $rating, 'level' => ratingLevel($rating),
        'breakdown' => $breakdown, 'missing_fields' => $missing];
}

function calculateRating(array $card): array
{
    $details = ratingDetails($card);
    return ['rating' => $details['rating'], 'level' => $details['level']];
}
