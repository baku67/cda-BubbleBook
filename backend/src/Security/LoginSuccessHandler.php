<?php
namespace App\Security;

use App\Entity\User\User;
use Doctrine\ORM\EntityManagerInterface;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Signer\Key;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

// Le LoginSuccessHandler est un handler personnalisé qui est appelé lors du succès de l'authentification via json_login. Il intervient juste après l’authentification réussie, mais avant que la réponse HTTP ne soit renvoyée au client.
// Rôle principal :
// - Personnaliser la réponse HTTP envoyée après le login.
// - Retourner des informations supplémentaires dans le JSON de réponse, comme un refresh token, firstLoginStep, ou d’autres données.
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
            throw new \InvalidArgumentException('Authenticated user is not an instance of User.');
        }

        // Récupère l'étape de la première connexion
        $firstLoginStep = $user->getFirstLoginStep() ?? null;

        // Génère le token JWT
        $accessToken = $this->jwtManager->create($user);

        // Retourne une réponse JSON
        return new JsonResponse([
            'success' => true,
            'accessToken' => $accessToken,
            'firstLoginStep' => $firstLoginStep,
        ], JsonResponse::HTTP_OK);
    }
}
