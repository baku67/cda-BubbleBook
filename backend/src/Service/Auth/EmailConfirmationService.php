<?php 
namespace App\Service\Auth;

use App\Repository\User\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class EmailConfirmationService
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager
    ) {}

    public function confirmEmail(string $token): void
    {
        $user = $this->userRepository->findOneBy(['confirmationToken' => $token]);

        if (!$user) {
            throw new \InvalidArgumentException('Invalid token.');
        }

        if ($user->getConfirmationTokenExpiry() < new \DateTime()) {
            throw new \InvalidArgumentException('Token expired.');
        }

        $user->setVerified(true);
        $user->setConfirmationToken(null);
        $user->setConfirmationTokenExpiry(null);

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}
