<?php
namespace App\DTO\Response;

// ResponseDTO
class UserCertificateDTO
{
    public function __construct(
        public ?int $id,
        public ?CertificateDTO $certificate,
        public ?\DateTimeImmutable $obtainedDate,
        public ?string $location
    ) {}
}