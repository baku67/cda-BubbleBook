<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private JWTTokenManagerInterface $jwtManager;
    private EntityManagerInterface $entityManager;
    private Configuration $jwtConfig;
    private string $jwtPassphrase;

    public function __construct(JWTTokenManagerInterface $jwtManager, EntityManagerInterface $entityManager,  string $jwtPassphrase)
    {
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
        $this->jwtPassphrase = $jwtPassphrase;
        $this->jwtConfig = Configuration::forSymmetricSigner(
            new Sha256(),
            Key\InMemory::file('/var/www/html/config/jwt/private.pem', $this->jwtPassphrase)
        );

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

        // Renvoie une réponse JSON avec les deux tokens
        return new JsonResponse([
            'accessToken' => $accessToken,
        ]);
    }
}
