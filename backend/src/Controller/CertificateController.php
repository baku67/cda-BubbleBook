<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\CertificateRepository;
use App\Repository\UserCertificateRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\DTO\CertificateDTO;
use App\DTO\User\UserCertificateDTO;

class CertificateController extends AbstractController
{

    #[Route('/api/certificates', name: 'api_certificates', methods: ['GET'])]
    public function getCertificates(
        CertificateRepository $certificateRepository, 
    ): JsonResponse
    {
        // Route publique, pas de vérif $this->getUser

        // Récupérer tous les certificats disponibles
        $allCertificates = $certificateRepository->findAll();

        // Transformer les résultats en DTOs
        $certificateDTOs = array_map(function ($certificate) {
            return new CertificateDTO($certificate->getId(), $certificate->getName(), $certificate->getType());
        }, $allCertificates);
        
        if (!$allCertificates) {
            return new JsonResponse(['error' => 'Aucuns certificats disponibles']);
        }
        return $this->json($certificateDTOs);
    }


    #[Route('/api/user/certificates', name: 'api_user_certificates', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getUserCertificates(
        UserCertificateRepository $userCertificateRepository,
        CertificateRepository $certificateRepository, 
    ): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'CertificateController2: instanceof User'], Response::HTTP_UNAUTHORIZED);
        }

        // Choix 1: Récupère les certificats de l'utilisateur (mieux car transformation en DTO dans le repo)
        $certificatesDTOs = $userCertificateRepository->findCertificatesAsDTOByUserId($user->getId());

        // Choix 2: Récupère les certificats de l'utilisateur avec méthode de Collection Doctrine (et transformation en DTO)
        // $userCertificates = $user->getUserCertificates(); 
        // $certificatesDTOs = $userCertificates->map(function ($userCertificate) {
        //     $certificate = $userCertificate->getCertificate(); // Relation
        //     return new UserCertificateDTO(
        //         $certificate->getId(),
        //         $certificate->getName(),
        //         $certificate->getType(),
        //         $userCertificate->getObtainedAt()
        //     );
        // })->toArray();

        return $this->json($certificatesDTOs);
    }
}
