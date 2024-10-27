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
            // Key\InMemory::plainText($this->jwtPassphrase)
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

        // Récupère ou génère le Refresh Token
        // $refreshToken = $user->getRefreshToken();
        // if (!$refreshToken) {
        //     $refreshToken = bin2hex(random_bytes(64));
        //     $user->setRefreshToken($refreshToken);
        //     $this->entityManager->persist($user);
        //     $this->entityManager->flush();
        // }
        
        // Génère le Refresh Token au format JWT
        $now = new \DateTimeImmutable();
        $refreshToken = $this->jwtConfig->builder()
            ->issuedBy('http://localhost') // émetteur
            ->permittedFor('http://localhost') // audience
            ->issuedAt($now)
            ->expiresAt($now->modify('+1 month')) // Durée de validité du refresh token
            ->withClaim('user_id', $user->getId()) // Ajouter des claims si nécessaire
            ->getToken($this->jwtConfig->signer(), $this->jwtConfig->signingKey())
            ->toString();


        // Renvoie une réponse JSON avec les deux tokens
        return new JsonResponse([
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken,
        ]);
    }
}
