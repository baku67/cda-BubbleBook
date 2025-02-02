<?php
namespace App\Service\Auth;

use App\DTO\Request\RegisterDTO;
use App\Entity\User\User;
use App\Repository\User\RoleRepository;
use App\Repository\User\UserRepository;
use App\Service\Auth\MailConfirmationTokenService;
use App\Service\Auth\MailerService;
use App\Service\Auth\UsernameService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationService
{
    public function __construct(
        private MailerService $mailService,
        private MailConfirmationTokenService $mailConfirmationTokenService,
        private UsernameService $usernameService,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository,
        private RoleRepository $roleRepository
    ) {
    }

    public function registerUser(RegisterDTO $registerDTO): User
    {
        if ($this->userRepository->findOneBy(['email' => $registerDTO->email])) {
            throw new \InvalidArgumentException('Email is already in use.');
        }

        $defaultRole = $this->roleRepository->findOneBy(['name' => 'ROLE_USER']);
        if (!$defaultRole) {
            throw new \RuntimeException('Default role not found.');
        }

        $user = new User();
        $user->setEmail($registerDTO->email);
        $user->setPassword($this->passwordHasher->hashPassword($user, $registerDTO->password));
        $user->addRole($defaultRole);

        try {
            $username = $this->usernameService->generateUniqueUsername();
            $user->setUsername($username);
        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to generate unique username.');
        }

        try {
            $this->mailConfirmationTokenService->generateUserMailConfirmToken($registerDTO->email, $user);
        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to send confirmation email.');
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }
}
