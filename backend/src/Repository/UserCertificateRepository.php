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
            ->select(
                'uc.id AS id, 
                 c.id AS certificateId, 
                 c.name AS certificateName, 
                 c.type AS certificateType, 
                 uc.obtained_date AS obtainedAt, 
                 uc.location AS location'
            )
            ->join('uc.certificate', 'c')
            ->where('uc.user = :userId')
            ->setParameter('userId', $userId)
            ->getQuery();
    
        $results = $query->getResult();
    
        // Adapter les résultats au nouveau modèle attendu par le frontend
        return array_map(function ($result) {
            return new UserCertificateDTO(
                $result['id'],
                new CertificateDTO(
                    $result['certificateId'],
                    $result['certificateName'],
                    $result['certificateType']
                ),
                $result['obtainedAt'] instanceof \DateTimeImmutable
                    ? $result['obtainedAt']
                    : \DateTimeImmutable::createFromMutable($result['obtainedAt']),
                $result['location']
            );
        }, $results);
    }
}
