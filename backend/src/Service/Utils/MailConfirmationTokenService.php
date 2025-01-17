<?php
namespace App\Service\Utils;

use App\Entity\User\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\Utils\MailerService;
use Symfony\Component\HttpFoundation\JsonResponse;

class MailConfirmationTokenService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private MailerService $mailerService
    ){}

    public function generateUserMailConfirmToken(string $toEmail, User $user): void 
    {
        $newToken = bin2hex(random_bytes(32));
        $user->setConfirmationToken($newToken);

        // Définir la date d'expiration du token à 1 heure après la génération (vérifié)
        $expiryDate = new \DateTime('+1 hour');
        $user->setConfirmationTokenExpiry($expiryDate);

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