<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{

    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
    ){}


    #[Route('/api/user', name: 'api_user', methods: ['GET'])]
    public function getUserProfil(): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
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



    #[Route('/api/firstLoginUpdate', name: 'api_firstLoginUpdate', methods: ['POST'])]
    public function firstLoginUpdate(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);


        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }


        if (strlen($data['username']) < 3) {
            return new JsonResponse([
                'message' => 'Le nom d\'utilisateur doit contenir au moins 3 caractères.'
            ], Response::HTTP_BAD_REQUEST);
        }

        $user->setUsername($data['username']); // Initialisé avec un random "diver#43232"-> profil


        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'Erreur lors de l\'inscription. Veuillez réessayer plus tard.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'message' => 'Profil updaté (firstLogin, username etc)'
        ], Response::HTTP_OK); // 200 alors que UPDATE mais c'est un POST bref
    }

}