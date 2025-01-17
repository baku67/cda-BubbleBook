<?php
namespace App\Controller\User;

use App\DTO\Request\FirstLogin2DTO;
use App\Entity\User\User;
use App\Repository\User\UserRepository;
use App\Service\User\UserProfileService;
use App\Service\User\UserUpdateService;
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

    #[Route('/api/user/me', name: 'api_user_me', methods: ['GET'])]
    public function getCurrentUserProfil(UserProfileService $userProfileService): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
    
        $userProfilDTO = $userProfileService->getProfile($user);
        return $this->json($userProfilDTO);
    }

    
    #[Route('/api/user', name: 'api_edit_user', methods: ['PATCH'])]
    public function updateUser(Request $request, UserUpdateService $userUpdateService): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return new JsonResponse(['error' => 'Invalid JSON format.'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $userUpdateService->updateUser($user, $data);
            return new JsonResponse(['message' => 'User updated successfully.'], Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error updating user. Please try again later.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}