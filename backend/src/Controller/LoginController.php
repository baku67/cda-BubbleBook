<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

// config/security.yaml:
        // login:
        // pattern: ^/api/login
        // stateless: true
        // json_login:
        //     check_path: /api/login
        //     username_path: email
        //     password_path: password
        //     success_handler: lexik_jwt_authentication.handler.authentication_success
        //     failure_handler: lexik_jwt_authentication.handler.authentication_failure

// Permet d'avoir rien a faire pour le login et la génération du JWT ect...
// Peut etre réactiver pour condition supplémentaires etc
// MOT CLE: json_login

class LoginController extends AbstractController
{
    // private $entityManager;
    // private $passwordHasher;
    // private $userRepository;
    // private $jwtManager;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager, UserRepository $userRepository)
    {
        // $this->entityManager = $entityManager;
        // $this->passwordHasher = $passwordHasher;
        // $this->userRepository = $userRepository;
        // $this->jwtManager = $jwtManager;
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        // Request $request
    )
    {
        // $data = json_decode($request->getContent(), true);
        
        // // Validation des données
        // if (empty($data['email']) || empty($data['password'])) {
        //     return new JsonResponse(['error' => 'Invalid data provided'], 400);
        // }

        // // Récupération de l'utilisateur par email
        // $user = $this->userRepository->findOneBy(['email' => $data['email']]);

        // if (!$user || !$this->passwordHasher->isPasswordValid($user, $data['password'])) {
        //     return new JsonResponse(['error' => 'Invalid credentials'], 401);
        // }

        // // Génération du token JWT
        // $token = $this->jwtManager->create($user);

        // return new JsonResponse(['token' => $token], 200);

        // La logique d'authentification est déjà gérée par le système de sécurité,
        // donc cette méthode peut rester vide ou renvoyer une réponse par défaut.
        return new JsonResponse(['message' => 'Authentication is handled automatically by json_login symfony'], 200);
    }
}
