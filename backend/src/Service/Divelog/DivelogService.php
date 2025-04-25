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
            $divelog->getDives()->count()
        ), $divelogs);
    }


    public function getOtherUserDiveLogs(int $targetUserId): array
    {
        return $this->divelogRepository->findPublicOrFriendVisibleByUserId($targetUserId);
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

        // $this->reorderDisplayOrders($user); // Pour éviter les trous
    }


}