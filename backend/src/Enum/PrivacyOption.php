<?php

namespace App\Enum;

enum PrivacyOption: string
{
    case ALL = 'ALL';
    case FRIENDS_ONLY = 'FRIENDS_ONLY';
    case NO_ONE = 'NO_ONE';

    public const VALUES = [
        self::ALL->value,
        self::FRIENDS_ONLY->value,
        self::NO_ONE->value,
    ];

    public static function getChoices(): array
    {
        return [
            self::ALL->value,
            self::FRIENDS_ONLY->value,
            self::NO_ONE->value,
        ];
    }
}
