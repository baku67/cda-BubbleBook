<?php
namespace App\Controller\User;

use App\DTO\Request\UserSearchCriteriaDTO;
use App\Entity\User\User;
use App\Repository\User\UserRepository;
use App\Service\User\UserProfileService;
use App\Service\User\UserSearchService;
use App\Service\User\UserUpdateService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserController extends AbstractController
{

    public function __construct(
        private UserRepository $userRepository,
        private UserSearchService $userSearchService,
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


    // Modifs lors des FirstLoginForm
    #[Route('/api/user', name: 'api_edit_user', methods: ['PATCH'])]
    public function updateUser(Request $request, UserUpdateService $userUpdateService, UserProfileService $userProfileService): JsonResponse
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

            // Retourner le UserProfilDTO à jour
            $userProfilDTO = $userProfileService->getProfile($user);
            return $this->json($userProfilDTO, Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error updating user. Please try again later.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    // Modifs privacy depuis le account-settings
    #[Route('/api/user/privacy', name: 'api_edit_user_privacy', methods: ['PUT'])]
    public function updateUserPrivacy(Request $request, UserUpdateService $userUpdateService, UserProfileService $userProfileService): JsonResponse
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
            $userUpdateService->updateUserPrivacySettings($user, $data);

            // Retourner le UserProfilDTO à jour
            $userProfilDTO = $userProfileService->getProfile($user);
            return $this->json($userProfilDTO, Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error updating user privacy settings. Please try again later.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Social searchUser 
    #[Route('/api/users/search', name: 'api_user_search', methods: ['GET'])]
    public function searchUsers(
        Request $request,
        UserSearchService $userSearchService,
    ): JsonResponse {

        try {
            $searchCriteria = UserSearchCriteriaDTO::fromRequest($request);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        $users = $userSearchService->search($searchCriteria);
    
        return $this->json($users, Response::HTTP_OK);
    }

}