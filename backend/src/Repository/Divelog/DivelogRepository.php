<?php

namespace App\Repository\Divelog;

use App\DTO\Response\DivelogDTO;
use App\Entity\Divelog\Divelog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Divelog>
 */
class DivelogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Divelog::class);
    }

    /**
     * Récupère tous les divelogs de l'utilisateur connecté 
     * Ne récupère pas les dives associés pour éviter de surcharger la requête.
     * 
     * @param int $userId
     * @return array
     */
    public function findCurrentUserDivelogs(int $userId): array
    {
        return $this->createQueryBuilder('d')
            ->where('d.owner = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('d.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * SELON PRIVACY SETTINGS:
     * Récupère tous les divelogs d'un autre utilisateur par ID e
     * Ne récupère pas les dives associés pour éviter de surcharger la requête.
     * 
     * @param int $userId
     * @return array
     */
    // public function findDivelogsByUserId(int $userId): array
    // {

    //     return null;
    // }

}
