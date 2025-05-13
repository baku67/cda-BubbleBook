<?php
namespace App\Service\Friendship;

use App\Entity\Friendship\Friendship;
use App\Entity\User\User;
use App\Repository\Friendship\FriendshipRepository;
use Doctrine\ORM\EntityManagerInterface;
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
     */
    public function createFriendship(User $emitter, User $recipient): void
    {
        if ($emitter === $recipient) {
            throw new BadRequestHttpException('Vous ne pouvez pas vous ajouter vous-même.');
        }

        // Vérifie qu’il n’existe pas déjà une demande ou relation
        if ($this->friendshipRepository->existsBetween($emitter, $recipient)) {
            throw new ConflictHttpException('Une demande ou relation existe déjà entre ces utilisateurs.');
        }

        $friendship = new Friendship($emitter, $recipient);
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

}