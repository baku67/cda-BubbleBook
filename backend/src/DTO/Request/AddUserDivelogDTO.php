<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class AddUserDivelogDTO
{
    #[Assert\NotBlank(message: 'Un titre de carnet de plongée est requis.')]
    public string $title = '';

    public ?string $description = null;

    #[Assert\Type(\DateTime::class, message: 'La date doit être une instance valide de DateTime.')]
    #[Assert\LessThanOrEqual('today', message: 'La date de création ne peut pas être dans le futur.')]
    public ?\DateTime $createdAt = null;

    public ?string $theme = '';

}