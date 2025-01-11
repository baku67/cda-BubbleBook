<?php

namespace App\Enum;

enum Banner: string
{
    case DEFAULT_0 = "assets/images/default/banners/default-banner-0.webp";
    case DEFAULT_1 = "assets/images/default/banners/default-banner-1.webp";
    case DEFAULT_2 = "assets/images/default/banners/default-banner-2.webp";
    case DEFAULT_3 = "assets/images/default/banners/default-banner-3.webp";
    case DEFAULT_4 = "assets/images/default/banners/default-banner-4.webp";
    case DEFAULT_5 = "assets/images/default/banners/default-banner-5.webp";
    case DEFAULT_6 = "assets/images/default/banners/default-banner-6.webp";
    case DEFAULT_7 = "assets/images/default/banners/default-banner-7.webp";
    case DEFAULT_8 = "assets/images/default/banners/default-banner-8.webp";
    case DEFAULT_9 = "assets/images/default/banners/default-banner-9.webp";
    case DEFAULT_10 = "assets/images/default/banners/default-banner-10.webp";
    case DEFAULT_11 = "assets/images/default/banners/default-banner-11.webp";
    case DEFAULT_12 = "assets/images/default/banners/default-banner-12.webp";
    case DEFAULT_13 = "assets/images/default/banners/default-banner-13.webp";
    case DEFAULT_14 = "assets/images/default/banners/default-banner-14.webp";
    case DEFAULT_15 = "assets/images/default/banners/default-banner-15.webp";

    public const VALUES = [
        self::DEFAULT_0->value,
        self::DEFAULT_1->value,
        self::DEFAULT_2->value,
        self::DEFAULT_3->value,
        self::DEFAULT_4->value,
        self::DEFAULT_5->value,
        self::DEFAULT_6->value,
        self::DEFAULT_7->value,
        self::DEFAULT_8->value,
        self::DEFAULT_9->value,
        self::DEFAULT_10->value,
        self::DEFAULT_11->value,
        self::DEFAULT_12->value,
        self::DEFAULT_13->value,
        self::DEFAULT_14->value,
        self::DEFAULT_15->value,
    ];
}

