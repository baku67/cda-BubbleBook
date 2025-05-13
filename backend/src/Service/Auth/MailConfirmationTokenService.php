<?php
namespace App\Service\Auth;

use App\Entity\User\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\Auth\MailerService;
use InvalidArgumentException;

class MailConfirmationTokenService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private MailerService $mailerService
    ){}

    public function generateUserMailConfirmToken(string $toEmail, User $user): void 
    {
        // 1️⃣ Détermine si on est en changement d’email ou en inscription
        $isChangeFlow = null !== $user->getPendingEmail();

        // 2️⃣ Choix du destinataire : pendingEmail prioritaire si set
        $recipient = $isChangeFlow
            ? $user->getPendingEmail()
            : $toEmail;

        $newToken = bin2hex(random_bytes(32));
        $user->setConfirmationToken($newToken);

        // Définir la date d'expiration du token à 1 heure après la génération (vérifié)
        $expiryDate = new \DateTime('+1 hour');
        $user->setConfirmationTokenExpiry($expiryDate);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Envoi du mail de confirmation (à faire après `flush()` pour garantir la persistance)
        try {
            $this->mailerService->sendConfirmationEmail($recipient, $newToken);
        } catch (\Exception $e) {
            // return new JsonResponse(['error' => 'Unable to send confirmation email'], 500);
        }
    }


    /**
     * Génère un token de confirmation de changement d'e-mail,
     * stocke la nouvelle adresse dans pendingEmail, définit l'expiration,
     * marque emailVerified=false et envoie le mail de confirmation.
     */
    public function generateEmailChangeToken(string $newEmail, User $user): void
    {
        // Stocke la nouvelle adresse en attente
        $user->setPendingEmail($newEmail);

        // Génère un token sécurisé
        $token = bin2hex(random_bytes(32));
        $user->setConfirmationToken($token);
        // Fixe la date d'expiration
        $expiryDate = new \DateTime('+1 hour');
        $user->setConfirmationTokenExpiry($expiryDate);

        // Tant que non confirmé, on invalide l'ancienne vérification
        $user->setVerified(false);

        // Persiste et flush l'entité User
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Prépare et envoie l'email de confirmation
        try {
            $this->mailerService->sendEmailChangeConfirmation($user);
        } catch (\Exception $e) {
            // return new JsonResponse(['error' => 'Unable to send confirmation email'], 500);
        }
    }

    /**
     * Confirme un token, qu’il soit issu de l’inscription ou d’un changement d’e-mail.
     *
     * @throws InvalidArgumentException si token manquant, invalide ou expiré
     */
    public function confirmEmail(string $rawToken): User
    {
        $token = trim($rawToken);
        if ('' === $token) {
            throw new InvalidArgumentException('Token manquant.');
        }

        /** @var User|null $user */
        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneBy(['confirmationToken' => $token]);

        if (null === $user) {
            throw new InvalidArgumentException('Token invalide.');
        }

        $expiry = $user->getConfirmationTokenExpiry();
        if (!$expiry instanceof \DateTimeInterface ||
            $expiry->getTimestamp() < (new \DateTimeImmutable())->getTimestamp()
        ) {
            throw new InvalidArgumentException('Token expiré.');
        }

        // Cas 1 : changement d’e-mail
        if (null !== $user->getPendingEmail()) {
            // swap
            $user->setEmail($user->getPendingEmail());
            $user->clearPendingEmail();
            $user->setVerified(true);
        }
        // Cas 2 : simple confirmation d’inscription
        else {
            $user->setVerified(true);
        }

        // nettoyage commun
        $user->setConfirmationToken(null);
        $user->setConfirmationTokenExpiry(null);

        $this->entityManager->flush();

        return $user;
    }
}