<?php
namespace App\Repository\User;

use App\Entity\User\User;
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

    public function searchUsers(?string $query, ?string $type, string $order, int $page, int $pageSize): array
    {
        $queryBuilder = $this->createQueryBuilder('u');
        // $queryBuilder = $this->createQueryBuilder('u')
        // ->select([
        //     'u.id',
        //     'u.username',
        //     'u.nationality',
        //     'u.avatar_url',
        //     'u.banner_url',
        //     'u.initial_dives_count',
        //     'u.accountType'
        // ]);

        // EN PREMIER pour sécu
        // Exclure les utilisateurs dont "profil_privacy" est "NO_ONE"
        // TODO: gérer l'affichage des profils amis qui ont "FRIENDS_ONLY"
        $queryBuilder->andWhere('u.profilPrivacy != :privacy')
            ->setParameter('privacy', 'NO_ONE');

        // Filtrage par type de compte (option-diver / option-club)
        $allowedAccountTypes = ['option-diver', 'option-club'];
        if (!empty($type) && in_array($type, $allowedAccountTypes, true)) {
            $queryBuilder
                ->andWhere('u.accountType = :accountType')
                ->setParameter('accountType', $type);
        }

        // Filtrage par mot-clé (noms)
        if (!empty($query)) {
            $queryBuilder
                ->andWhere('LOWER(u.username) LIKE LOWER(:query)')
                ->setParameter('query', '%' . strtolower($query) . '%');
        }

        // Pagination
        $queryBuilder
            ->setFirstResult(($page - 1) * $pageSize)
            ->setMaxResults($pageSize);

        // Exécuter la requête et retourner les résultats
        return $queryBuilder->getQuery()->getResult();
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
