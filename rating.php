<?php
declare(strict_types=1);

function calculateRating(array $card): array
{
    $weights = [
        'context' => 20,
        'data_materials' => 20,
        'expected_result' => 15,
        'success_criteria' => 15,
        'constraints' => 10,
        'users' => 10,
        'business_contact' => 10,
    ];

    $rating = 0;
    foreach ($weights as $field => $weight) {
        $confirmed = $card[$field . '_confirmed'] ?? 0;
        if (in_array($confirmed, [1, '1', true], true)) {
            $rating += $weight;
        }
    }

    if ($rating < 40) {
        $level = 'проект';
    } elseif ($rating < 70) {
        $level = 'в работе';
    } elseif ($rating < 90) {
        $level = 'готово';
    } else {
        $level = 'приоритет';
    }

    return ['rating' => $rating, 'level' => $level];
}
