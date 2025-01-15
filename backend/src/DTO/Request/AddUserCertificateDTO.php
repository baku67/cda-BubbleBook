<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class AddUserCertificateDTO
{
    #[Assert\NotBlank(message: 'L\'organisme certificateur est requis.')]
    #[Assert\Choice(
        choices: ['PADI', 'FFESSM'],
        message: 'Le type de compte doit être l\'un de "PADI" ou "FFESSM".'
    )]
    public ?string $organisationValue = null;


    #[Assert\NotBlank(message: 'Le nom de certificat est requis.')]
    public ?string $certificateValue = null;


    #[Assert\Type(\DateTime::class, message: 'La date doit être une instance valide de DateTime.')]
    #[Assert\LessThanOrEqual('today', message: 'La date d\'obtention ne peut pas être dans le futur.')]
    public ?\DateTime $obtainedDate = null;

    public ?string $location = null;
}