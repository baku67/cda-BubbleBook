<?php

namespace App\Repository;

use App\DTO\Response\CertificateDTO;
use App\Entity\UserCertificate;
use App\Entity\User;
use App\DTO\Response\UserCertificateDTO;
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
    public function findCertificatesByUserId(int $userId): array
    {
        $query = $this->createQueryBuilder('uc')
        ->select('uc, c') // Récupère directement les entités UserCertificate et Certificate
        ->join('uc.certificate', 'c')
        ->where('uc.user = :userId')
        ->setParameter('userId', $userId)
        ->getQuery();
    
        $results = $query->getResult();
    
        return array_map(function (UserCertificate $userCertificate) {
            return new UserCertificateDTO(
                $userCertificate->getId(),
                new CertificateDTO(
                    $userCertificate->getCertificate()->getId(),
                    $userCertificate->getCertificate()->getName(),
                    $userCertificate->getCertificate()->getType()
                ),
                $userCertificate->getObtainedDate(),
                $userCertificate->getLocation()
            );
        }, $results);
    }
}
