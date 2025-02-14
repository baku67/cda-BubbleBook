<?php
namespace App\DTO\Response;

// ResponseDTO
class UserCertificateDTO
{
    public function __construct(
        readonly public ?int $id,
        readonly public ?CertificateDTO $certificate,
        readonly public ?\DateTimeImmutable $obtainedDate,
        readonly public ?string $location
    ) {}
}