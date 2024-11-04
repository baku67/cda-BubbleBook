<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;


class MailConfirmationTokenService
{

    public function __construct(
        private EntityManagerInterface $entityManager
    ) 
    {}

    public function generateUserMailConfirmToken(User $user): string
    {
        $newToken = bin2hex(random_bytes(32));
        $user->setConfirmationToken($newToken);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $newToken;
    }
}