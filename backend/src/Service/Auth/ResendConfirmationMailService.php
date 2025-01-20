<?php
namespace App\Service\Auth;

use App\Entity\User\User;
use App\Service\Auth\MailConfirmationTokenService;
use Doctrine\ORM\EntityManagerInterface;

class ResendConfirmationMailService
{
    public function __construct(
        private MailConfirmationTokenService $mailConfirmationTokenService,
        private EntityManagerInterface $entityManager
    ) {}

    public function resend(User $user): void
    {
        if ($user->isVerified()) {
            throw new \InvalidArgumentException('This account is already verified.');
        }

        $this->mailConfirmationTokenService->generateUserMailConfirmToken($user->getEmail(), $user);
        $this->entityManager->flush();
    }
}
