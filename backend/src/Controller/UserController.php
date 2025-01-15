<?php
namespace App\Controller;

use App\DTO\Response\UserProfilDTO;
use App\DTO\Request\FirstLogin2DTO;
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
use App\DTO\Request\FirstLogin1DTO;

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

        // Créer le DTO à partir des données de l'utilisateur
        $userProfilDTO = new UserProfilDTO(
            $user->getUsername(),
            $user->getEmail(),
            $user->getAccountType(),
            $user->getNationality(),
            $user->getAvatarUrl(),
            $user->getBannerUrl(),
            $user->isVerified(),
            $user->is2fa()
        );

        return $this->json($userProfilDTO);
    }


    // #[Route('/api/firstLoginUpdate', name: 'api_firstLoginUpdate', methods: ['PATCH'])]
    #[Route('/api/user', name: 'api_edit_user', methods: ['PATCH'])]
    public function updateUser(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // $data = $request->getContent();
        // Décodez le contenu JSON une fois
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return new JsonResponse(['error' => 'Invalid JSON format.'], Response::HTTP_BAD_REQUEST);
        }

        // Essayez de désérialiser dans chaque DTO
        // selon type de data envoyé depuis le front
        try {
            if (isset($data['accountType'])) {
                // 1ère étape : Gestion de `accountType`
                $dto = $serializer->deserialize($request->getContent(), FirstLogin1DTO::class, 'json');
                $user->setAccountType($dto->accountType);

                // Mettre à jour `first_login_step`
                if ($user->getFirstLoginStep() === 1) {
                    $user->setFirstLoginStep(2); // Passer à l'étape 2
                }
            } elseif (isset($data['username'])) {
                // 2ème étape : Gestion de `username`, `nationality`, etc.
                $dto = $serializer->deserialize($request->getContent(), FirstLogin2DTO::class, 'json');
                $user->setUsername($dto->username);
                $user->setNationality($dto->nationality);
                $user->setAvatarUrl($dto->avatar);
                $user->setBannerUrl($dto->banner);

                // Mettre à jour `first_login_step`
                if ($user->getFirstLoginStep() === 2) {
                    $user->setFirstLoginStep(null); // Toutes les étapes sont terminées
                }
            } elseif (isset($data['passStep'], $data['step']) && $data['passStep'] === true) {
                // Gestion du cas "passer une étape"
                if ($user->getFirstLoginStep() === (int)$data['step']) {
                    $user->setFirstLoginStep(null); // Marque l'étape $data['step'] comme passée 
                }
            }
            else {
                return new JsonResponse(
                    ['error' => 'Invalid data format.'],
                    Response::HTTP_BAD_REQUEST
                );
            } 
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Invalid data format.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Exécuter la validation uniquement si un DTO est défini (pas le cas pour le skipStep)
        if (isset($dto)) {
            $errors = $validator->validate($dto);
            if (count($errors) > 0) {
                return new JsonResponse(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
            }
        }

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Error updating user. Please try again later.'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return new JsonResponse(['message' => 'User updated successfully.'], Response::HTTP_OK);
    }
}