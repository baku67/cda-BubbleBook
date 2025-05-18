<?php
namespace App\Repository\User;

use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use App\Enum\PrivacyOption;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }


    /**
     * Détermine si $other est visible par $viewer selon les règles de privacy.
     */
    public function isVisibleTo(User $viewer, User $other): bool
    {
        $qb = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            // On lie la table Friendship pour détecter une relation ACCEPTED
            ->leftJoin(
                'App\Entity\Friendship\Friendship',
                'f',
                'WITH',
                '(f.emitter   = :viewer AND f.recipient = u AND f.status = :accepted)
                 OR
                 (f.recipient = :viewer AND f.emitter   = u AND f.status = :accepted)'
            )
            ->andWhere('u = :other')
            ->andWhere('u.profilPrivacy != :noOne')
            ->andWhere(
                '(u.profilPrivacy = :all
                  OR (u.profilPrivacy = :friendsOnly AND f.id IS NOT NULL)
                )'
            )
            ->setParameter('viewer',      $viewer)
            ->setParameter('other',       $other)
            ->setParameter('noOne',       PrivacyOption::NO_ONE)
            ->setParameter('all',         PrivacyOption::ALL)
            ->setParameter('friendsOnly', PrivacyOption::FRIENDS_ONLY)
            ->setParameter('accepted',    FriendshipStatus::ACCEPTED)
            ->getQuery()
            ->getSingleScalarResult();

        return (int) $qb > 0;
    }


    /**
     * Recherche des users visibles par $viewer, avec filtres, pagination, et projection.
     *
     * @param User        $viewer    L’utilisateur qui fait la recherche
     * @param string|null $query     Mot-clé sur le username
     * @param string|null $type      Filtre accountType
     * @param string      $order     Champ de tri (ex. "username") + direction (ex. "asc")
     * @param int         $page
     * @param int         $pageSize
     *
     * @return array[]  getArrayResult()
     */
    public function searchUsers(
        User $viewer, 
        ?string $query, 
        ?string $type, 
        string $order, 
        int $page, 
        int $pageSize
    ): array
    {
        $qb = $this->createQueryBuilder('u')
            // Projection légère
            ->select([
                'u.id',
                'u.username',
                'u.nationality',
                'u.avatarUrl',
                'u.bannerUrl',
                'u.initialDivesCount',
                'u.accountType',
            ])
            // Join conditionnel pour tester l’amitié validée
            ->leftJoin(
                'App\Entity\Friendship\Friendship',
                'f',
                'WITH',
                '(f.emitter   = :viewer AND f.recipient = u AND f.status = :accepted)
                 OR
                 (f.recipient = :viewer AND f.emitter   = u AND f.status = :accepted)'
            )
            // Exclusion totale de NO_ONE
            ->andWhere('u.profilPrivacy != :noOne')
            // On inclut soit ALL, soit FRIENDS_ONLY avec amitié existante
            ->andWhere(
                '(u.profilPrivacy = :all
                  OR (u.profilPrivacy = :friendsOnly AND f.id IS NOT NULL))'
            )
            // On ne doit pas voir soi-même
            ->andWhere('u.id != :viewerId')
            // Paramètres de base
            ->setParameter('viewer',      $viewer)
            ->setParameter('accepted',    FriendshipStatus::ACCEPTED)
            ->setParameter('noOne',       PrivacyOption::NO_ONE)
            ->setParameter('all',         PrivacyOption::ALL)
            ->setParameter('friendsOnly', PrivacyOption::FRIENDS_ONLY)
            ->setParameter('viewerId',    $viewer->getId());

        // Filtre accountType
        if ($type !== null) {
            $qb->andWhere('u.accountType = :accountType')
               ->setParameter('accountType', $type);
        }

        // Filtre mot-clé sur username
        if ($query !== null) {
            $qb->andWhere('LOWER(u.username) LIKE LOWER(:q)')
               ->setParameter('q', '%'.trim($query).'%');
        }

        // Gérer le tri : on explode l’ordre en champ + sens
        [$field, $dir] = explode(' ', trim($order)) + [1 => 'asc'];
        $field     = in_array($field, ['username','id','nationality','initialDivesCount','accountType'], true)
                   ? $field
                   : 'username';
        $direction = strtoupper($dir) === 'DESC' ? 'DESC' : 'ASC';
        $qb->orderBy("u.$field", $direction);

        // Pagination
        $qb->setFirstResult(($page - 1) * $pageSize)
           ->setMaxResults($pageSize);

        return $qb->getQuery()->getArrayResult();
    }

//    /**
//     * @return User[] Returns an array of User objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
