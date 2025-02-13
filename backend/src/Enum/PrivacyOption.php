<?php

namespace App\Enum;

enum PrivacyOption: string
{
    case ALL = 'tout le monde';
    case FRIENDS_ONLY = 'amis uniquement';
    case NO_ONE = 'aucun';

    public function getLabel(): string
    {
        return match ($this) {
            self::ALL => 'Tout le monde',
            self::FRIENDS_ONLY => 'Amis uniquement',
            self::NO_ONE => 'Aucun',
        };
    }

    public static function getChoices(): array
    {
        return [
            'Tout le monde' => self::ALL,
            'Amis uniquement' => self::FRIENDS_ONLY,
            'Aucun' => self::NO_ONE,
        ];
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::ALL => 'Votre contenu est visible par tout le monde.',
            self::FRIENDS_ONLY => 'Seuls vos amis peuvent voir ce contenu.',
            self::NO_ONE => 'Personne ne peut voir ce contenu.',
        };
    }
}
