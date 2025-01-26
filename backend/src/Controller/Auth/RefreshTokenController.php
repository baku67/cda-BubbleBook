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
        // Récupération du refresh token depuis les cookies
        $refreshTokenValue = $request->cookies->get('refresh_token');

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
            ->withValue($refreshToken->getToken())
            ->withSecure(true) // Nécessite HTTPS
            ->withHttpOnly(true)
            ->withSameSite('Strict') // ou 'Lax'
            ->withPath('/')
            ->withExpires(new \DateTime('+7 days')) // Durée de vie (ici 7 jours)
        );

        return $response;
    }


    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        // 1. Récupérer le token depuis le cookie
        $refreshTokenValue = $request->cookies->get('refresh_token');

        if ($refreshTokenValue) {
            // 2. Rechercher le token en base
            $refreshToken = $this->entityManager->getRepository(RefreshToken::class)->findOneBy(['token' => $refreshTokenValue]);

            if ($refreshToken) {
                // 3. Supprimer le token de la base
                $this->entityManager->remove($refreshToken);
                $this->entityManager->flush();
            }
        }

        // 4. Supprimer le cookie dans la réponse
        $response = new JsonResponse(['message' => 'Logged out successfully']);
        $response->headers->clearCookie('refresh_token', '/', '', true, true);

        return $response;
    }
}

