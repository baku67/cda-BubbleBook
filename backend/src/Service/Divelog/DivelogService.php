<?php
namespace App\Service\Divelog;

use App\DTO\Request\AddUserDivelogDTO;
use App\DTO\Response\DivelogDTO;
use App\Entity\Divelog\Divelog;
use App\Entity\User\User;
use App\Repository\Divelog\DivelogRepository;
use Doctrine\ORM\EntityManagerInterface;

class DivelogService
{
    public function __construct(
        private DivelogRepository $divelogRepository,
        private EntityManagerInterface $entityManager
    ) {}

    /**
     * Récupération des divelogs de l'utilisateur connecté et map en DTO
     * @param User $currentUser
     * @return DivelogDTO[]
     */
    public function getCurrentUserDivelogs(User $currentUser): array
    {
        $divelogs = $this->divelogRepository->findCurrentUserDivelogs($currentUser->getId());

        return array_map(fn($divelog) => new DivelogDTO(
            $divelog->getId(),
            $divelog->getTitle(),
            $divelog->getDescription(),
            $divelog->getCreatedAt(),
            $divelog->getTheme(),
            $divelog->getDives()->count(),
            $divelog->getDisplayOrder()
        ), $divelogs);
    }


    public function getOtherUserDiveLogs(int $targetUserId): array
    {
        return $this->divelogRepository->findPublicOrFriendVisibleByUserId($targetUserId);
    }

    public function addUserDivelogWithOrder(User $user, AddUserDivelogDTO $dto): Divelog
    {
        // Récupérer le dernier displayOrder et l'incrémenter
        $lastOrder = $this->divelogRepository->getMaxDisplayOrderForUser($user);
        $dto->displayOrder = $lastOrder + 1;
        return $this->addUserDivelog($user, $dto);
    }


    public function addUserDivelog(User $user, AddUserDivelogDTO $dto): Divelog
    {
        $existingDivelog = $this->divelogRepository->findOneBy([
            'owner' => $user,
            'title' => $dto->title,
        ]);

        if ($existingDivelog) {
            throw new \LogicException('Un carnet du même nom existe déjà.');
        }

        $userDivelog = new Divelog();
        $userDivelog->setOwner($user);
        $userDivelog->setTitle($dto->title);
        $userDivelog->setDescription($dto->description);

        $dateMutable = $dto->createdAt ?? new \DateTime(); 
        $userDivelog->setCreatedAt(
            \DateTimeImmutable::createFromMutable($dateMutable)
        );

        $userDivelog->setTheme($dto->theme ?? '');

        $this->entityManager->persist($userDivelog);
        $this->entityManager->flush();

        return $userDivelog;
    }


    public function deleteUserDivelog(User $user, int $divelogId): void
    {
        $userDivelog = $this->divelogRepository->findOneBy([
            'id' => $divelogId,
            'owner' => $user,
        ]);

        if (!$userDivelog) {
            throw new \InvalidArgumentException('Divelog not found or does not belong to the user.');
        }

        $this->entityManager->remove($userDivelog);
        $this->entityManager->flush();

        $this->reorderDisplayOrders($user); // Pour éviter les trous
    }


    public function getCurrentUserDivelog(User $user, int $divelogId): DivelogDTO
    {
        $userDivelog = $this->divelogRepository->findOneBy([
            'id' => $divelogId,
            'owner' => $user,
        ]);

        if (!$userDivelog) {
            throw new \InvalidArgumentException('Divelog not found or does not belong to the user.');
        }

        return new DivelogDTO(
            $userDivelog->getId(),
            $userDivelog->getTitle(),
            $userDivelog->getDescription(),
            $userDivelog->getCreatedAt(),
            $userDivelog->getTheme(),
            $userDivelog->getDives()->count(),
            $userDivelog->getDisplayOrder(),
        );
    }

    // Suite à suppression d'un divelog pour éviter les trous
    private function reorderDisplayOrders(User $user): void
    {
        $divelogs = $this->divelogRepository->findBy(
            ['owner' => $user],
            ['displayOrder' => 'ASC']
        );

        $order = 1;
        foreach ($divelogs as $divelog) {
            $divelog->setDisplayOrder($order++);
        }

        $this->entityManager->flush();
    }

    // Réorganisation de l'ordre des divelogs (drag and drop front)
    public function updateDivelogsOrder(User $user, array $updatedOrder): void
    {
        foreach ($updatedOrder as $orderData) {
            $divelog = $this->divelogRepository->findOneBy([
                'id' => $orderData['id'],
                'owner' => $user
            ]);

            if ($divelog) {
                $divelog->setDisplayOrder($orderData['displayOrder']);
            }
        }

        $this->entityManager->flush();
    }


}