<?php
namespace App\Controller\Divelog;

use App\DTO\Request\AddUserDivelogDTO;
use App\Service\Divelog\DivelogService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User\User;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;


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


    #[Route('/api/me/divelogs', name: 'api_me_add_divelog', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function addUserDivelog(
        Request $request,
        ValidatorInterface $validator
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        $dto = new AddUserDivelogDTO();
        $dto->title = $data['title'] ?? null;
        $dto->description = $data['description'] ?? null;
        $dto->createdAt = isset($data['createdAt']) ? new \DateTime($data['createdAt']) : null;
        $dto->theme = $data['theme'] ?? null;

        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return new JsonResponse(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        try {
            $userDivelog = $this->userDivelogService->addUserDivelog($user, $dto);
            return new JsonResponse([
                'id' => $userDivelog->getId(),
                // 'owner' => $userDivelog->getOwner()->getId(),
                'title' => $userDivelog->getTitle(),
                'createdAt' => $userDivelog->getCreatedAt()?->format('Y-m-d'),
                'theme' => $userDivelog->getTheme(),
                // 'displayOrder' => $userCertificate->getDisplayOrder(),
            ], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\LogicException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_CONFLICT);
        }
    }


    #[Route('/api/me/divelogs/{divelogId}', name: 'api_me_delete_certificate', methods: ['DELETE'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function deleteUserDivelog(int $divelogId): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        try {
            $this->userDivelogService->deleteUserDivelog($user, $divelogId);
            return new JsonResponse(['message' => 'Divelog deleted successfully.'], Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        }
    }


    #[Route('/api/me/divelogs/{divelogId}', name: 'api_me_get_divelog', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getUserDivelog(int $divelogId): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        $userDivelogDTO = $this->userDivelogService->getCurrentUserDivelog($user, $divelogId);
        return $this->json($userDivelogDTO, Response::HTTP_OK);
    }


    // *** VERIF PRIVACY SETTINGS otherUserDivelog
    // #[Route('/api/user/divelogs/{divelogId}', name: 'api_user_get_divelog', methods: ['GET'])]
    // #[IsGranted('IS_AUTHENTICATED_FULLY')]
    // public function getOtherUserDivelog(int $userId, int $divelogId): JsonResponse
    // {
    //     $user = $this->getUser();
    //     if (!$user instanceof User) {
    //         return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
    //     }

    //     // récup de l'user

    //     $userDivelogDTO = $this->userDivelogService->getOtherUserDivelog($user, $divelogId);
    //     return $this->json($otherUserDivelogDTO, Response::HTTP_OK);
    // }


    #[Route('/api/me/divelogs/order', name: 'api_me_update_divelogs_order', methods: ['PUT'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function updateUserDivelogsOrder(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['divelogs']) || !is_array($data['divelogs'])) {
            return new JsonResponse(['error' => 'Invalid data format'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->userDivelogService->updateDivelogsOrder($user, $data['divelogs']);
            return new JsonResponse(['message' => 'Order updated successfully'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

}
