<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
// use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface; // déprécié pour UserPasswordHasher
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegisterController
{
    private $entityManager;
    private $passwordHasher;
    private $userRepository;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, UserRepository $userRepository)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->userRepository = $userRepository;
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (empty($data['email']) || empty($data['password']) || empty($data['username'])) {
            return new JsonResponse(['error' => 'Invalid data provided'], 400);
        }

        // Vérifier si l'utilisateur existe déjà avec cet email
        if ($this->userRepository->findOneBy(['email' => $data['email']])) {
            return new JsonResponse(['error' => 'Email already in use'], 400);
        }

        // Création de l'utilisateur & initialisations (Default Values SQL ?)
        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setUsername($data['username']);
        
        // Définir les rôles (il serait prudent de vérifier que les rôles sont valides)
        $user->setRoles($data['roles'] ?? ['ROLE_USER']);

        // Envoyés/Initialisés à false:
        $user->set2fa($data['is2fa'] ?? false);
        $user->setVerified($data["isVerified"] ?? false);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'User created'], 201);
    }


    #[Route('/api/check-email-exist', name: 'check_email_exist', methods: ['POST'])]
    public function checkEmailExist(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];

        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user) {
            return new JsonResponse(['exists' => true], 200);
        }

        return new JsonResponse(['exists' => false], 200);
    }
}
