<?php

namespace App\Repository\Divelog;

use App\Entity\Divelog\Divelog;
use App\Entity\User\User;
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


    /**
     * Récupère le nombre de divelogs de l'utilisateur connecté pour calculer le displayOrder du nouveau certificat à ajouter
     * (Utilise l'entité User car Doctrine gère déjà la relation, rendant la requête plus sécurisée, lisible et conforme aux bonnes pratiques ORM.)
     * 
     * @param User $user
     * @return int 
     */
    // public function getMaxDisplayOrderForUser(User $user): int
    // {
    //     return $this->createQueryBuilder('d')
    //         ->select('MAX(d.displayOrder)')
    //         ->where('d.owner = :user')
    //         ->setParameter('user', $user)
    //         ->getQuery()
    //         ->getSingleScalarResult() ?? 0;
    // }


    // Lors de l'ajout d'un nouveau divelog, celui-ci a un displayOrder à 1 pour être tout en haut, on décale donc tout les autres éléments de 1 
    public function incrementDisplayOrdersForUser(User $user): int
    {
        return $this->createQueryBuilder('d')
            ->update()
            ->set('d.displayOrder', 'd.displayOrder + 1')
            ->where('d.owner = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

}
