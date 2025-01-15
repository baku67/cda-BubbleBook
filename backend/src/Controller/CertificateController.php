<?php

namespace App\Controller;

use App\Repository\CertificateRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\DTO\Response\CertificateDTO;

class CertificateController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}


    #[Route('/api/certificates', name: 'api_get_certificates', methods: ['GET'])]
    public function getCertificates(
        CertificateRepository $certificateRepository, 
    ): JsonResponse
    {
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

}
