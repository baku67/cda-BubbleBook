<?php
namespace App\Service\Friendship;

use App\DTO\Response\UserFriendRequestDTO;
use App\Entity\Friendship\Friendship;
use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use App\Repository\Friendship\FriendshipRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class FriendshipService
{
    public function __construct(
        private FriendshipRepository $friendshipRepository,
        private EntityManagerInterface $entityManager
    ) {}

    /**
     * Crée et persiste une nouvelle demande d’amitié.
     *
     * @throws BadRequestHttpException si la demande est invalide ou existe déjà
     * @throws ConflictHttpException si la relation existe déjà
     */
    public function createFriendship(User $emitter, User $recipient, ?string $message): void
    {
        if ($emitter === $recipient) {
            throw new BadRequestHttpException('Vous ne pouvez pas vous ajouter vous-même.');
        }

        // Vérifie qu’il n’existe pas déjà une demande ou relation
        if ($this->friendshipRepository->existsBetween($emitter, $recipient)) {
            throw new ConflictHttpException('Une demande ou relation existe déjà entre ces utilisateurs.');
        }

        $friendship = new Friendship($emitter, $recipient);
        if(!empty($message)) {
            $friendship->setMessage($message);
        }

        $this->entityManager->persist($friendship);
        $this->entityManager->flush();
    }


    // Accepte ou refuse la demande:
    public function respondToRequest(User $emitter, User $recipient, bool $accept): void
    {
        $friendship = $this->friendshipRepository->findOneBetween($emitter, $recipient)
             ?? throw new BadRequestHttpException('Demande non trouvée.');

        $accept
            ? $friendship->accept()
            : $friendship->reject();

        $this->entityManager->flush();
    }

    /**
     * Supprime la relation d’amitié (demande ou lien) entre $emitter et $recipient.
     *
     * @throws NotFoundHttpException si aucune relation n’existe.
     */
    public function removeFriendship(User $emitter, User $recipient): void
    {
        $friendship = $this->friendshipRepository->findOneBetween($emitter, $recipient);
        if (!$friendship) {
            throw new NotFoundHttpException(
                'Aucune relation d’ami trouvée entre ces utilisateurs.'
            );
        }

        $this->entityManager->remove($friendship);
        $this->entityManager->flush();
    }



    public function getRequestsByStatus(User $user, FriendshipStatus $status): array
    {
        $friendships = $this->friendshipRepository->findByUserAndStatus($user, $status);
        
        $dtos = [];
        foreach ($friendships as $f) {
            // Si c'est une demande en attente (pending), on sait que $user === recipient,
            // donc l’autre est toujours l'emitter()
            //
            // Si c'est accepted, $user peut être emitter ou recipient,
            // on veut toujours l’autre user
            $other = $f->getEmitter()->getId() === $user->getId()
                ? $f->getRecipient()
                : $f->getEmitter()
            ;

            $dtos[] = new UserFriendRequestDTO(
                $f->getId(),
                $other->getId(),
                $other->getUsername(),
                $other->getAvatarUrl(),
                $other->getBannerUrl(),
                $other->getNationality(),
                $f->getStatus()->value,
                $f->getCreatedAt(),
                $f->getMessage(),
            );
        }
        return $dtos;
    }


    public function getRequestsCountByStatus(User $user, FriendshipStatus $status): int
    {
        $friendshipsCount = $this->friendshipRepository->countByUserAndStatus($user, $status);
        
        return $friendshipsCount;
    }


    /**
     * @param int  $friendshipId
     * @param bool $accept        true = accept, false = reject
     */
    public function respondToRequestById(User $user, int $friendshipId, bool $accept): void
    {
        $friendship = $this->friendshipRepository->find($friendshipId);
        if (!$friendship) {
            throw new NotFoundHttpException('Demande non trouvée.');
        }

        if ($friendship->getRecipient() !== $user) {
            throw new AccessDeniedHttpException('Non autorisé.');
        }

        $accept
            ? $friendship->accept()
            : $friendship->reject();

        $this->entityManager->flush();
    }
}