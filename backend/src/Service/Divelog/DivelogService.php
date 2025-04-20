<?php
namespace App\Service\Divelog;

use App\DTO\Response\DivelogDTO;
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
            $divelog->getTheme()
        ), $divelogs);
    }


    public function getOtherUserDiveLogs(int $targetUserId): array
    {
        return $this->divelogRepository->findPublicOrFriendVisibleByUserId($targetUserId);
    }

}