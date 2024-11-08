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


class LoginController extends AbstractController
{

    public function __construct(
        // private EntityManagerInterface $entityManager, 
        // private UserPasswordHasherInterface $passwordHasher, 
        // private JWTTokenManagerInterface $jwtManager, 
        // private UserRepository $userRepository
    )
    { }


    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        // Request $request
    ): JsonResponse
    {
        // *** ByPass json_login:
        // - JWTCreatedListener
        
        return new JsonResponse(['message' => 'Authentication is handled automatically by json_login symfony'], 200);
    }
}
