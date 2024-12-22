<?php

namespace App\Repository;

use App\Entity\UserCertificate;
use App\Entity\User;
use App\DTO\User\UserCertificateDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserCertificate>
 */
class UserCertificateRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct(
            $registry, 
            UserCertificate::class,
        );
    }

    /**
     * Récupère tous les certificats de l'utilisateur connecté et map en UserCertificateDTO 
     * (On peut aussi utiliser user->getCertifs et mapper dans le controller)
     * 
     * @param int $userId
     * @return UserCertificateDTO[]
     */
    public function findCertificatesAsDTOByUserId(int $userId): array
    {
        $query = $this->createQueryBuilder('uc')
            ->select(
                'c.id AS certificateId, 
                c.name AS certificateName, 
                c.type AS certificateType, 
                uc.obtained_at AS obtainedAt'
            )
            ->join('uc.certificate', 'c')
            ->where('uc.user = :userId')
            ->setParameter('userId', $userId)
            ->getQuery();

        $results = $query->getResult();

        // Transformer les résultats en DTOs
        return array_map(function ($result) {
            return new UserCertificateDTO(
                $result['certificateId'],
                $result['certificateName'],
                $result['certificateType'],
                $result['obtainedAt']
            );
        }, $results);
    }

    //    /**
    //     * @return UserCertificate[] Returns an array of UserCertificate objects
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

    //    public function findOneBySomeField($value): ?UserCertificate
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
