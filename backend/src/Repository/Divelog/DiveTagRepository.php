<?php

namespace App\Repository\Divelog;

use App\Entity\Divelog\DiveTag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DiveTag>
 */
class DiveTagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DiveTag::class);
    }

    //    /**
    //     * @return DiveTag[] Returns an array of DiveTag objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('d.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?DiveTag
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
