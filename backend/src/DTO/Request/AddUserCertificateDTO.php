<?php
namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class AddUserCertificateDTO
{
    #[Assert\NotBlank(message: 'L\'organisme certificateur est requis.')]
    #[Assert\Choice(
        choices: ['PADI', 'FFESSM', 'Autre'],
        message: 'Le type d\'organisme doit être l\'un de "PADI", "FFESSM" ou "Autre".'
    )]
    public string $organisationValue;


    #[Assert\NotBlank(message: 'Le nom de certificat est requis.')]
    public string $certificateValue;


    #[Assert\Type(\DateTime::class, message: 'La date doit être une instance valide de DateTime.')]
    #[Assert\LessThanOrEqual('today', message: 'La date d\'obtention ne peut pas être dans le futur.')]
    public ?\DateTime $obtainedDate = null;

    public ?string $location = null;

    public int $displayOrder = 0; // Initialisation avec 0 par défaut (valeur non reçue du frontend, calculée en backend)
}