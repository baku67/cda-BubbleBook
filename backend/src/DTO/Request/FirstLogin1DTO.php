<?php
namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class FirstLogin1DTO
{
    #[Assert\Choice(
        choices: ['option-diver', 'option-club'],
        message: 'Le type de compte doit être l\'un de "option-diver" ou "option-club".'
    )]
    public ?string $accountType = null;
}