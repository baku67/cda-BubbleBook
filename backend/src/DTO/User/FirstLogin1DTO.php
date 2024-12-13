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
        message: 'Le type d\'utilisateur doit être l\'un de "diver" ou "club".'
    )]
    public ?string $toggle = null;

    // #[Assert\Url(message: 'L\'URL de l\'avatar n\'est pas valide.')]
    // public ?string $avatar = null;
}