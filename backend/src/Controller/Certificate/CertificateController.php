<?php
namespace App\Controller\Certificate;

use App\Service\Certificate\CertificateService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class CertificateController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    #[Route('/api/certificates', name: 'api_get_certificates', methods: ['GET'])]
    public function getCertificates(CertificateService $certificateService): JsonResponse
    {
        $certificateDTOs = $certificateService->getAllCertificates();

        if (empty($certificateDTOs)) {
            return new JsonResponse(['error' => 'Aucuns certificats disponibles'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json($certificateDTOs);
    }

}
