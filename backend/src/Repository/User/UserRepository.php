<?php
namespace App\Repository\User;

use App\DTO\Response\OtherUserProfilDTO;
use App\DTO\Response\UserProfilDTO;
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


    public function findOtherUser(int $userId): ?User {
        return $this->createQueryBuilder('u')
        ->where('u.id = :userId')
        ->andWhere('u.profilPrivacy != :privacy')
        ->setParameter('userId', $userId)
        ->setParameter('privacy', 'NO_ONE')
        ->getQuery()
        ->getOneOrNullResult();
    }

    public function searchUsers(?string $query, ?string $type, string $order, int $page, int $pageSize): array
    {
        // On ne récupère plus une entité User mais un tableau avec ce qu'il faut (double sécu + opti)
        $queryBuilder = $this->createQueryBuilder('u')
        ->select([
            'u.id',
            'u.username',
            'u.nationality',
            'u.avatarUrl',
            'u.bannerUrl',
            'u.initialDivesCount',
            'u.accountType'
        ]);

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
        return $queryBuilder->getQuery()->getArrayResult();
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
