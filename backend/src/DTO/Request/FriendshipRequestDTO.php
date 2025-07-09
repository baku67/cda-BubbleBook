<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

class FriendshipRequestDTO
{
    /** 
     * Message facultatif joint à la demande
     * Longueur max : 500 caractères
     */
    #[Assert\Length(max: 500)]
    public ?string $message = null;
}