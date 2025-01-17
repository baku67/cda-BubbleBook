<?php
namespace App\Service\Auth;

use App\Repository\User\UserRepository;

class EmailCheckExistService
{
    public function __construct(private UserRepository $userRepository) {}

    public function isEmailExists(string $email): bool
    {
        return $this->userRepository->findOneBy(['email' => $email]) !== null;
    }
}
