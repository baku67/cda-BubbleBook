<?php
namespace App\Service\Auth;

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

    public function registerUser(array $data): array
    {
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email address.');
        }

        if (strlen($data['password']) < 6) {
            throw new \InvalidArgumentException('Password must be at least 6 characters long.');
        }

        if ($this->userRepository->findOneBy(['email' => $data['email']])) {
            throw new \InvalidArgumentException('Email is already in use.');
        }

        $defaultRole = $this->roleRepository->findOneBy(['name' => 'ROLE_USER']);
        if (!$defaultRole) {
            throw new \RuntimeException('Default role not found.');
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setAvatarUrl('assets/images/default/avatars/profil-picture-default-original.webp');
        $user->setBannerUrl('assets/images/default/banners/default-banner-00.webp');
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));

        try {
            $username = $this->usernameService->generateUniqueUsername();
            $user->setUsername($username);
        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to generate unique username.');
        }

        $user->addRole($defaultRole);
        $user->set2fa($data['is2fa'] ?? false);
        $user->setVerified(false);
        $user->setAccountType('option-diver');
        $user->setFirstLoginStep(1);

        try {
            $this->mailConfirmationTokenService->generateUserMailConfirmToken($data['email'], $user);
        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to send confirmation email.');
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return [
            'message' => 'User registered successfully.'
        ];
    }
}
