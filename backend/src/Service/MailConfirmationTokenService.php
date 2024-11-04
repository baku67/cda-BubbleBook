<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\MailerService;

class MailConfirmationTokenService
{

    public function __construct(
        private EntityManagerInterface $entityManager,
        private MailerService $mailerService
    ) 
    {}

    public function generateUserMailConfirmToken(string $toEmail, User $user): void
    {
        $newToken = bin2hex(random_bytes(32));
        $user->setConfirmationToken($newToken);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Envoi du mail de confirmation (à faire après `flush()` pour garantir la persistance)
        try {
            $this->mailerService->sendConfirmationEmail($toEmail, $newToken);
        } catch (\Exception $e) {
            // return new JsonResponse(['error' => 'Unable to send confirmation email'], 500);
        }

    }
}