<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class AddCertificateDTO
{
    #[Assert\NotBlank(message: 'L\'organisme certificateur est requis.')]
    #[Assert\Choice(
        choices: ['PADI', 'FFESSM'],
        message: 'Le type de compte doit être l\'un de "PADI" ou "FFESSM".'
    )]
    public string $organisationValue = null;



    #[Assert\NotBlank(message: 'Le nom de certificat est requis.')]
    // Liste de tous les certifs depuis le repo ?
    // #[Assert\Choice(
    //     choices: ['PADI', 'FFESSM'],
    //     message: 'Le type de compte doit être l\'un de "PADI" ou "FFESSM".'
    // )]
    public string $certificateValue = null;


}