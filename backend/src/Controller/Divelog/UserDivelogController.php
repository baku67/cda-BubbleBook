<?php
namespace App\Controller\Divelog;

use App\Service\Divelog\DivelogService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User\User;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Response;


class UserDivelogController extends AbstractController
{
    public function __construct(private DivelogService $userDivelogService) {}

    // Récupération des divelogs de l'utilisateur connecté
    #[Route('/api/me/divelogs', name: 'api_get_my_divelogs', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getCurrentUserDivelogs(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        $userDivelogsDTOs = $this->userDivelogService->getCurrentUserDivelogs($user);
        return $this->json($userDivelogsDTOs, Response::HTTP_OK);
    }


    // TODO
    // Récupération des divelogs d'un autre utilisateur par ID
    #[Route('/api/user/{otherUserId}/divelogs', name: 'api_get_user_divelogs', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getOtherUserDivelogs(int $otherUserId): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }
        
        $userDivelogsDTOs = $this->userDivelogService->getOtherUserDivelogs($otherUserId);
        return $this->json($userDivelogsDTOs, Response::HTTP_OK);
    }

}


    // #[Route('/api/user/divelogs/{id}', name: 'api_get_user_divelog', methods: ['GET'])]
    // #[IsGranted('IS_AUTHENTICATED_FULLY')]
    // public function getUserDivelog(int $id): JsonResponse
    // {
    //     $user = $this->getUser();
    //     if (!$user instanceof User) {
    //         return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
    //     }

    //     $userDivelogDTO = $this->userDivelogService->getUserDivelog($user, $id);
    //     return $this->json($userDivelogDTO, Response::HTTP_OK);
    // }