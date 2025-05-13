<?php
namespace App\Controller\Friendship;

use App\Entity\User\User;
use App\Repository\User\UserRepository;
use App\Service\Friendship\FriendshipService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
    public function requestFriend(User $recipient): Response {

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
        $this->friendshipService->createFriendship($emitter, $recipient);

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

}