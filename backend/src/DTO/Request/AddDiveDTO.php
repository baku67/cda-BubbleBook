<?php
namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class AddDiveDTO
{
    public int $divelogId;

    #[Assert\NotBlank(message: 'Le titre est requis')]
    #[Assert\Length(min: 6, max: 50, minMessage:'Le titre doit faire entre au moins 6', maxMessage:'Le titre ne peut pas faire plus de 50 caractères')]
    public string $title;

    public string $description;




    // #[Assert\Type(\DateTime::class, message: 'La date doit être une instance valide de DateTime.')]
    // #[Assert\LessThanOrEqual('today', message: 'La date d\'obtention ne peut pas être dans le futur.')]
    // public ?\DateTime $obtainedDate = null;

    // public ?string $location = null;

    // public int $displayOrder = 0; // Initialisation avec 0 par défaut (valeur non reçue du frontend, calculée en backend)
}