<?php

namespace App\Repository\Friendship;

use App\Entity\Friendship\Friendship;
use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use App\Enum\PrivacyOption;
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
     * Récupère les Friendships pour $user selon $status (Friend-requests et friends-list):
     *  - pending  => uniquement comme recipient (liste des Firend requests dans notifs)
     *      => ! Même si leurs profil est privé (à voir..)
     *  - accepted => comme recipient OU emitter (liste amis)
     *      => ! Vérification du profilPrivacy PrivacyOption.ALL ou PrivacyOption.FRIENDS_ONLY
     */
    public function findByUserAndStatus(User $user, FriendshipStatus $status): array
    {
        $qb = $this->createQueryBuilder('f')
            // joins pour pouvoir filtrer sur profilPrivacy
            ->leftJoin('f.emitter',   'e')
            ->leftJoin('f.recipient', 'r')
            ->addSelect('e', 'r')
            ->andWhere('f.status = :status')
            ->setParameter('status', $status);

        if ($status === FriendshipStatus::PENDING) {
            // on liste les demandes reçues
            $qb->andWhere('f.recipient = :user')
               ->setParameter('user', $user);
        } else {
            // on liste les amis, quel que soit le sens,
            // mais on ne veut que ceux dont l’autre user.profilPrivacy est publique ou amis-only
            $qb->andWhere(
                '( (f.recipient = :user AND e.profilPrivacy IN (:privacyOptions)) ' .
                'OR (f.emitter   = :user AND r.profilPrivacy IN (:privacyOptions)) )'
            )
            ->setParameter('user', $user)
            ->setParameter('privacyOptions', [
                PrivacyOption::ALL,
                PrivacyOption::FRIENDS_ONLY,
            ]);
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
