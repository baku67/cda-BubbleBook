<?php
namespace App\Controller\Auth;

use App\Entity\User\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Routing\Annotation\Route;

class RefreshTokenController
{
    private $entityManager;
    private $jwtManager;

    public function __construct(EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager)
    {
        $this->entityManager = $entityManager;
        $this->jwtManager = $jwtManager;
    }

    #[Route('/api/refresh-token', name: 'api_refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $refreshTokenValue = $data['refresh_token'] ?? null;

        if (!$refreshTokenValue) {
            return new JsonResponse(['error' => 'Refresh token is required'], 400);
        }

        $refreshToken = $this->entityManager->getRepository(RefreshToken::class)->findOneBy(['token' => $refreshTokenValue]);

        if (!$refreshToken || $refreshToken->getExpiresAt() < new \DateTime()) {
            return new JsonResponse(['error' => 'Invalid or expired refresh token'], 401);
        }

        $user = $refreshToken->getUser();
        $newJwt = $this->jwtManager->create($user);

        // Configurer le cookie du refresh token
        $response = new JsonResponse(['token' => $newJwt]);
        $response->headers->setCookie(Cookie::create('refresh_token', $refreshToken->getToken())
            ->withHttpOnly(true)
            ->withSameSite(Cookie::SAMESITE_NONE)
            ->withSecure(true) // En production uniquement ou en Dev avec SAMESITE_NONE
        );

        return $response;
    }
}

