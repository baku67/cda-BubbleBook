<?php
namespace App\Controller\Friendship;

use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use App\Repository\User\UserRepository;
use App\Service\Friendship\FriendshipService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FriendshipController extends AbstractController
{

    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private FriendshipService $friendshipService
    ){}

    #[Route('/api/friendship/request/{recipient}', name: 'friendship_request', methods: ['POST'])]
    public function requestFriend(Request $request, User $recipient): Response {

        // récup du message optionnel
        $data = $request->toArray(); 
        $message = array_key_exists('message', $data)
            ? (string) $data['message']   
            : '';                         

        // Récupération de l’utilisateur authentifié
        $emitter = $this->getUser();
        if (!$emitter instanceof User) {
            throw $this->createAccessDeniedException('Vous devez être connecté pour envoyer une demande d’ami.');
        }

        // L'utilisateur doit être vérifié
        if (!$emitter->isVerified()) {
            return new JsonResponse(
                ['error' => 'Votre compte doit être vérifié pour envoyer des demandes d’amis.'],
                Response::HTTP_FORBIDDEN
            );
        }

        // Création de la demande via le service
        $this->friendshipService->createFriendship($emitter, $recipient, $message);

        return new JsonResponse(
            null,
            Response::HTTP_CREATED
        );
    }


    #[Route('/api/friendship/request/{recipient}', name: 'api_friendship_remove', methods: ['DELETE'])]
    public function removeFriend(User $recipient): JsonResponse
    {
        $emitter = $this->getUser();
        if (!$emitter instanceof User) {
            throw $this->createAccessDeniedException('Vous devez être connecté pour supprimer une amitié.');
        }

        $this->friendshipService->removeFriendship($emitter, $recipient);

        // 204 No Content pour indiquer la suppression
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    // Récupère les FriendShips selon status 
    #[Route('/api/friendship/request', name: 'api_friendship_requests', methods: ['GET'])]
    public function listRequests(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        if (!$user->isVerified()) {
            return new JsonResponse(['error' => 'User not verified'], Response::HTTP_FORBIDDEN);
        }

        // lecture du paramètre ?status=pending ou accepted
        $statusParam = $request->query->get('status');
        try {
            $status = FriendshipStatus::from($statusParam);
        } catch (\ValueError) {
            return $this->json(['error'=>'Invalid status'], 400);
        }

        $dtos = $this->friendshipService->getRequestsByStatus($user, $status);

        return $this->json(
            $dtos,
            Response::HTTP_OK,
            [],
            // ['groups' => ['friend_request_list']]
        );
    }

    // Récupère les FriendShips selon status 
    #[Route('/api/friendship/count-request', name: 'api_friendship_requests_count', methods: ['GET'])]
    public function countRequests(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        if (!$user->isVerified()) {
            return new JsonResponse(['error' => 'User not verified'], Response::HTTP_FORBIDDEN);
        }

        // lecture du paramètre ?status=pending ou accepted
        $statusParam = $request->query->get('status');
        try {
            $status = FriendshipStatus::from($statusParam);
        } catch (\ValueError) {
            return $this->json(['error'=>'Invalid status'], 400);
        }

        $count = $this->friendshipService->getRequestsCountByStatus($user, $status);

        return $this->json(
            $count,
            Response::HTTP_OK,
            [],
            // ['groups' => ['friend_request_list']]
        );
    }

    #[Route('/api/friendship/{id}/accept', name: 'api_friendship_accept', methods: ['PATCH'])]
    public function acceptFriend(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user?->isVerified()) {
            return $this->json(['error'=>'Non autorisé'], Response::HTTP_FORBIDDEN);
        }

        $this->friendshipService->respondToRequestById($user, $id, true);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/friendship/{id}/reject', name: 'api_friendship_reject', methods: ['PATCH'])]
    public function rejectFriend(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user?->isVerified()) {
            return $this->json(['error'=>'Non autorisé'], Response::HTTP_FORBIDDEN);
        }

        $this->friendshipService->respondToRequestById($user, $id, false);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

}