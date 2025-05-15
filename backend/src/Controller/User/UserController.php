<?php
namespace App\Controller\User;

use App\DTO\Request\UserSearchCriteriaDTO;
use App\Entity\User\User;
use App\Repository\User\UserRepository;
use App\Service\Auth\MailConfirmationTokenService;
use App\Service\Auth\MailerService;
use App\Service\User\UserProfileService;
use App\Service\User\UserSearchService;
use App\Service\User\UserUpdateService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{

    public function __construct(
        private UserRepository $userRepository,
        private UserSearchService $userSearchService,
        private EntityManagerInterface $entityManager,
        private MailConfirmationTokenService $mailConfirmationTokenService,
        private MailerService $mailerService
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

    // Social searchUsers 
    #[Route('/api/users/search', name: 'api_user_search', methods: ['GET'])]
    public function searchUsers(
        Request $request,
        UserSearchService $userSearchService,
    ): JsonResponse {

        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        if (!$user->isVerified()) {
            return new JsonResponse(['error' => 'User not verified'], Response::HTTP_FORBIDDEN);
        }

        try {
            $searchCriteria = UserSearchCriteriaDTO::fromRequest($request);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        $users = $userSearchService->search($user, $searchCriteria);
    
        return $this->json($users, Response::HTTP_OK);
    }


    // Récupération d'un profil utilisateur
    #[Route('/api/user/{otherUserId}', name: 'api_other_user', methods: ['GET'])]
    public function getOtherUserProfil(int $otherUserId, UserProfileService $userProfileService): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        if (!$user->isVerified()) {
            return new JsonResponse(['error' => 'User not verified'], Response::HTTP_FORBIDDEN);
        }
    
        $otherUserProfilDTO = $userProfileService->getOtherUserProfile($user, $otherUserId);
        
        if (!$otherUserProfilDTO) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
    
        return $this->json($otherUserProfilDTO);
    }


    #[Route('/api/user/me', name: 'api_user_delete_me', methods: ['DELETE'])]
    public function deleteMe(): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }


    #[Route('/api/user/me/password', name: 'api_user_change_password', methods: ['PATCH'])]
    public function changePassword(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
    ): Response {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $current = $data['currentPassword'] ?? '';
        $new     = $data['newPassword']     ?? '';

        // Vérifie le mot de passe actuel
        if (!$passwordHasher->isPasswordValid($user, $current)) {
            return new JsonResponse(
                ['message' => 'Mot de passe actuel incorrect.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Met à jour le mot de passe
        $hashed = $passwordHasher->hashPassword($user, $new);
        $user->setPassword($hashed);
        $this->entityManager->flush();

        $this->mailerService->sendPasswordModified($user->getEmail());

        return new Response(null, Response::HTTP_NO_CONTENT);
    }


    /**
     * Demande de changement d'adresse e-mail
     */
    #[Route('/api/user/me/email', name: 'api_user_request_email_change', methods: ['POST'])]
    public function requestEmailChange(Request $request): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Vérification nouvelle adresse différente et valide:
        $data = json_decode($request->getContent(), true);
        $newEmail = trim($data['newEmail'] ?? '');
        if ('' === $newEmail || $newEmail === $user->getEmail()) {
            return new JsonResponse(
                ['error' => 'Nouvelle adresse invalide ou identique à l’actuelle.'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Vérification d'unicité:
        $existing = $this->userRepository->findOneBy(['email' => $newEmail]);
        if (null !== $existing && $existing->getId() !== $user->getId()) {
            return new JsonResponse(
                ['error' => 'Cette adresse e-mail est déjà utilisée.'],
                Response::HTTP_CONFLICT
            );
        }

        // génère le token, stocke pendingEmail + confirmationToken + expiry + envoi du mail
        $this->mailConfirmationTokenService->generateEmailChangeToken($newEmail, $user);

        // flush et 204 No Content
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/user/email/confirm', name: 'api_user_confirm_email_change', methods: ['GET'])]
    public function confirmEmailChange(Request $request): Response
    {
        $token = $request->query->get('token');

        try {
            $this->mailConfirmationTokenService->confirmEmail($token);
            return new Response(null, Response::HTTP_NO_CONTENT);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

}