<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{

    #[Route('/api/user', name: 'api_user', methods: ['GET'])]

    public function getUserProfil(): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();

        // Vérifier si l'utilisateur est connecté
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Retourner les informations utilisateur sous forme de JSON
        return new JsonResponse([
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'isVerified' => $user->isVerified(),
            'is2fa' => $user->is2fa(),
            // Ajouter d'autres informations utilisateur si nécessaire
        ]);
    }
}