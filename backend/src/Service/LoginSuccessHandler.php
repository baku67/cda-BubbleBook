<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private JWTTokenManagerInterface $jwtManager;
    private EntityManagerInterface $entityManager;

    public function __construct(JWTTokenManagerInterface $jwtManager, EntityManagerInterface $entityManager)
    {
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
    }

    public function onAuthenticationSuccess(Request $request, $token): JsonResponse
    {
        // Récupère l'utilisateur authentifié
        $user = $token->getUser();

        if (!$user instanceof User) {
            throw new \Exception('Invalid user');
        }

        // Génère l'Access Token
        $accessToken = $this->jwtManager->create($user);

        // Récupère ou génère le Refresh Token
        $refreshToken = $user->getRefreshToken();
        if (!$refreshToken) {
            $refreshToken = bin2hex(random_bytes(64));
            $user->setRefreshToken($refreshToken);
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }

        // Renvoie une réponse JSON avec les deux tokens
        return new JsonResponse([
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken,
        ]);
    }
}
