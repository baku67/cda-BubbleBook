<?php
namespace App\Service\Utils;

use App\Repository\User\UserRepository;

class UsernameService
{
    public function __construct(private UserRepository $userRepository){}

    /**
     * Génère un pseudonyme unique sous la forme "diver#123456"
     *
     * @throws \Exception Si aucune combinaison unique n'a été trouvée après plusieurs tentatives
     */
    public function generateUniqueUsername(): string
    {
        $maxAttempts = 5; // Nombre maximum de tentatives
        $attempts = 0;

        do {
            $attempts++;
            $randomNumber = random_int(10000, 999999);
            $username = 'diver#' . $randomNumber;

            $existingUser = $this->userRepository->findOneBy(['username' => $username]);
        } while ($existingUser !== null && $attempts < $maxAttempts);

        if ($existingUser !== null) {
            throw new \Exception('Impossible de générer un pseudonyme unique. Veuillez réessayer.');
        }

        return $username;
    }
}
