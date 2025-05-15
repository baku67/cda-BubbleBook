<?php

namespace App\Repository\Friendship;

use App\Entity\Friendship\Friendship;
use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Friendship>
 */
class FriendshipRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Friendship::class);
    }

    
    /**
     * Indique s’il existe déjà une demande ou relation entre deux users,
     * quel que soit l’ordre emitter/recipient.
     */
    public function existsBetween(User $a, User $b): bool
    {
        $qb = $this->createQueryBuilder('f');
        $qb->select('COUNT(f)')
           ->andWhere('(f.emitter = :a AND f.recipient = :b) OR (f.emitter = :b AND f.recipient = :a)')
           ->setParameter('a', $a)
           ->setParameter('b', $b);

        return (int)$qb->getQuery()->getSingleScalarResult() > 0;
    }


    /**
     * Retourne la relation d'amitié entre $a et $b, quel que soit le sens, ou null.
     */
    public function findOneBetween(User $a, User $b): ?Friendship
    {
        return $this->createQueryBuilder('f')
            ->andWhere('(f.emitter   = :a AND f.recipient = :b)')
            ->orWhere(  '(f.emitter   = :b AND f.recipient = :a)')
            ->setParameter('a', $a)
            ->setParameter('b', $b)
            ->getQuery()
            ->getOneOrNullResult();
    }


    /**
     * Récupère les Friendships pour $user selon $status :
     *  - pending  => uniquement comme recipient (liste des Firend requests dans notifs)
     *  - accepted => comme recipient OU emitter (liste amis)
     */
    public function findByUserAndStatus(User $user, FriendshipStatus $status): array
    {
        $qb = $this->createQueryBuilder('f')
            ->andWhere('f.status = :status')
            ->setParameter('status', $status);

        if ($status === FriendshipStatus::PENDING) {
            $qb->andWhere('f.recipient = :user')
               ->setParameter('user', $user);
        } else if ($status === FriendshipStatus::ACCEPTED) { 
            $qb->andWhere('(f.recipient = :user OR f.emitter = :user)')
               ->setParameter('user', $user);
        }

        return $qb
            ->orderBy('f.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
    

    //    /**
    //     * @return Friendship[] Returns an array of Friendship objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Friendship
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
