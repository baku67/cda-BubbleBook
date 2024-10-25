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
// MOT CLE: json_login


class LoginController extends AbstractController
{

    public function __construct(
        private EntityManagerInterface $entityManager, 
        private UserPasswordHasherInterface $passwordHasher, 
        private JWTTokenManagerInterface $jwtManager, 
        private UserRepository $userRepository
    )
    { }


    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        // Request $request
    )
    {
        // *** ByPass json_login:
        // - JWTCreatedListener
        // - SuccessHandler pour le refreshToken 
        
        return new JsonResponse(['message' => 'Authentication is handled automatically by json_login symfony'], 200);
    }


    #[Route('/api/refresh-token', name: 'api_refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $refreshToken = $data['refreshToken'] ?? null;

        if (!$refreshToken) {
            return new JsonResponse(['error' => 'Invalid Refresh Token'], 400);
        }

        // Recherche l'utilisateur via le Refresh Token
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['refreshToken' => $refreshToken]);
        
        if (!$user) {
            return new JsonResponse(['error' => 'Invalid Refresh Token'], 400);
        }

        // Génère un nouvel Access Token
        $newAccessToken = $JWTManager->create($user);

        return new JsonResponse(['accessToken' => $newAccessToken]);
    }
}
