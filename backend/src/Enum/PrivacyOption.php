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

    // *** Pour les calculs de changement de privacy (UserUpdateService) ***

    /**
     * Classe le niveau de confidentialité :
     *   ALL = 0, FRIENDS_ONLY = 1, NO_ONE = 2
     */
    public function getRank(): int
    {
        return match ($this) {
            self::ALL          => 0,
            self::FRIENDS_ONLY => 1,
            self::NO_ONE       => 2,
        };
    }

    /**
     * Retourne true si $this est plus restrictif que $other.
     */
    public function isMoreRestrictiveThan(self $other): bool
    {
        return $this->getRank() > $other->getRank();
    }

    /**
     * Retourne true si $this est moins restrictif que $other.
     */
    public function isLessRestrictiveThan(self $other): bool
    {
        return $this->getRank() < $other->getRank();
    }
}
