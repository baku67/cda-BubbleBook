<?php
namespace App\Service\Certificate;

use App\Repository\Certificate\CertificateRepository;
use App\DTO\Response\CertificateDTO;

class CertificateService
{
    public function __construct(private CertificateRepository $certificateRepository) {}

    /**
     * Récupère tous les certificats et les transforme en DTO.
     *
     * @return CertificateDTO[]
     */
    public function getAllCertificates(): array
    {
        $certificates = $this->certificateRepository->findAll();

        return array_map(
            fn($certificate) => new CertificateDTO(
                $certificate->getId(),
                $certificate->getName(),
                $certificate->getType()
            ),
            $certificates
        );
    }
}
