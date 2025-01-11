<?php
namespace App\Enum;

enum Avatar: string
{
    case DEFAULT_1 = "assets/images/default/avatars/profil-picture-default-1.png";
    case DEFAULT_2 = "assets/images/default/avatars/profil-picture-default-2.png";
    case DEFAULT_3 = "assets/images/default/avatars/profil-picture-default-3.png";
    case DEFAULT_4 = "assets/images/default/avatars/profil-picture-default-4.png";
    case DEFAULT_5 = "assets/images/default/avatars/profil-picture-default-5.png";
    case DEFAULT_6 = "assets/images/default/avatars/profil-picture-default-6.png";
    case DEFAULT_7 = "assets/images/default/avatars/profil-picture-default-7.png";
    case DEFAULT_8 = "assets/images/default/avatars/profil-picture-default-8.png";
    case DEFAULT_9 = "assets/images/default/avatars/profil-picture-default-9.png";

    public const VALUES = [
        self::DEFAULT_1->value,
        self::DEFAULT_2->value,
        self::DEFAULT_3->value,
        self::DEFAULT_4->value,
        self::DEFAULT_5->value,
        self::DEFAULT_6->value,
        self::DEFAULT_7->value,
        self::DEFAULT_8->value,
        self::DEFAULT_9->value,
    ];
}
