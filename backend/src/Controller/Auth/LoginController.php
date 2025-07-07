<?php
namespace App\Controller\Auth;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\RateLimiter\RateLimit;

class LoginController extends AbstractController
{
    public function __construct(){}

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    #[RateLimit(key: 'anonymous_api')]
    public function login(): JsonResponse
    {
        // *** ByPass json_login:
        // - JWTCreatedListener
        return new JsonResponse(['message' => 'Authentication is handled automatically by json_login symfony'], 200);
    }
}
