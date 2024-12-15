<?php

namespace App\DTO\User;

use Symfony\Component\Validator\Constraints as Assert;


class FirstLogin1DTO
{
    #[Assert\NotBlank(message: 'Le nom d\'utilisateur est requis.')]
    #[Assert\Length(
        max: 50,
        maxMessage: 'Le nom d\'utilisateur ne peut pas dépasser {{ limit }} caractères.'
    )]
    public string $username;

    #[Assert\Choice(
        choices: ['option-diver', 'option-club'],
        message: 'Le type de compte doit être l\'un de "option-diver" ou "option-club".'
    )]
    public ?string $accountType = null;

    // #[Assert\Url(message: 'L\'URL de l\'avatar n\'est pas valide.')]
    // public ?string $avatar = null;


    #[Assert\Length(
        max: 3,
        maxMessage: 'Le code Pays "ISO 3166-1 alpha-3" requiert {{ limit }} caractères.'
    )]
    public ?string $nationality;
}