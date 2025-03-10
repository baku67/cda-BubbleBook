<?php
namespace App\Repository\Certificate;

use App\DTO\Response\CertificateDTO;
use App\Entity\Certificate\UserCertificate;
use App\DTO\Response\UserCertificateDTO;
use App\Entity\User\User;
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
     * (Utilise userId car elle est conçue pour récupérer et mapper les certificats en DTO, évitant ainsi d'exposer directement les entités Doctrine.)
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
                $userCertificate->getDisplayOrder(),
                $userCertificate->getObtainedDate(),
                $userCertificate->getLocation()
            );
        }, $results);
    }


    /**
     * Récupère le nombre de certificats de l'utilisateur connecté pour calculer le displayOrder du nouveau certificat à ajouter
     * (Utilise l'entité User car Doctrine gère déjà la relation, rendant la requête plus sécurisée, lisible et conforme aux bonnes pratiques ORM.)
     * 
     * @param User $user
     * @return int 
     */
    public function getMaxDisplayOrderForUser(User $user): int
    {
        return $this->createQueryBuilder('uc')
            ->select('MAX(uc.displayOrder)')
            ->where('uc.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult() ?? 0;
    }
}
