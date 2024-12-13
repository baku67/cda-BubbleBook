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
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\DTO\User\FirstLogin1DTO;

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
    public function firstLoginUpdate(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse {
        // Désérialiser les données JSON dans le DTO
        try {
            $dto = $serializer->deserialize($request->getContent(), FirstLogin1DTO::class, 'json');
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Données mal formatées ou incomplètes.'],
                Response::HTTP_BAD_REQUEST
            );
        }
    
        // Valider le DTO
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
    
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }
    
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }
    
        // Mise à jour des données utilisateur
        $user->setUsername($dto->username);

        $user->setAccountType($dto->accountType);
    
        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Erreur lors de la mise à jour. Veuillez réessayer plus tard.'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    
        return new JsonResponse(
            ['message' => 'Profil mis à jour avec succès.'],
            Response::HTTP_OK
        );
    }

}