<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class FirstLogin2DTO
{
    #[Assert\NotBlank(message: 'Le nom d\'utilisateur est requis.')]
    #[Assert\Length(
        max: 50,
        maxMessage: 'Le nom d\'utilisateur ne peut pas dépasser {{ limit }} caractères.'
    )]
    public string $username;

    #[Assert\Length(
        max: 3,
        maxMessage: 'Le code Pays "ISO 3166-1 alpha-3" requiert {{ limit }} caractères.'
    )]
    public ?string $nationality;

    // TODO: à rendre plus flexible si select from file ou photo
    #[Assert\Choice(
        choices: [
            "assets/images/default/avatars/profil-picture-default-1.png",
            "assets/images/default/avatars/profil-picture-default-2.png",
            "assets/images/default/avatars/profil-picture-default-3.png",
            "assets/images/default/avatars/profil-picture-default-4.png",
            "assets/images/default/avatars/profil-picture-default-5.png",
            "assets/images/default/avatars/profil-picture-default-6.png",
            "assets/images/default/avatars/profil-picture-default-7.png",
            "assets/images/default/avatars/profil-picture-default-8.png",
            "assets/images/default/avatars/profil-picture-default-9.png",
        ],
        message: "The selected avatar is not valid."
    )]
    public ?string $avatar = null;

    #[Assert\Choice(
        choices: [
            'assets/images/default/banners/default-banner-0.webp',
            'assets/images/default/banners/default-banner-1.webp',
            'assets/images/default/banners/default-banner-2.webp',
            'assets/images/default/banners/default-banner-3.webp',
            'assets/images/default/banners/default-banner-4.webp',
            'assets/images/default/banners/default-banner-5.webp',
            'assets/images/default/banners/default-banner-6.webp',
            'assets/images/default/banners/default-banner-7.webp',
            'assets/images/default/banners/default-banner-8.webp',
            'assets/images/default/banners/default-banner-9.webp',
            'assets/images/default/banners/default-banner-10.webp',
            'assets/images/default/banners/default-banner-11.webp',
            'assets/images/default/banners/default-banner-12.webp',
            'assets/images/default/banners/default-banner-13.webp',
            'assets/images/default/banners/default-banner-14.webp',
            'assets/images/default/banners/default-banner-15.webp',
        ],
        message: "The selected banner is not valid."
    )]
    public ?string $banner = null;
}