<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;


class FirstLogin1DTO
{
    #[Assert\NotBlank(message: 'Le nom d\'utilisateur est requis.')]
    #[Assert\Length(
        max: 50,
        maxMessage: 'Le nom d\'utilisateur ne peut pas dépasser {{ limit }} caractères.'
    )]
    public string $username;

    // #[Assert\Choice(
    //     choices: ['admin', 'user', 'editor'],
    //     message: 'Le type d\'utilisateur doit être l\'un de : admin, user ou editor.'
    // )]
    // public ?string $typeUser = null;

    // #[Assert\Url(message: 'L\'URL de l\'avatar n\'est pas valide.')]
    // public ?string $avatar = null;
}