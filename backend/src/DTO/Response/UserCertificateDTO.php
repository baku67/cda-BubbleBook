<?php

namespace App\DTO\Response;

// ResponseDTO
class UserCertificateDTO
{
    public ?int $id = null;
    public ?CertificateDTO $certificate = null;
    public ?\DateTimeImmutable $obtainedAt = null;
    public ?string $location = null;

    public function __construct(
        int $id,
        CertificateDTO $certificate,
        ?\DateTimeImmutable $obtainedAt = null,
        ?string $location = null
    ) {
        $this->id = $id;
        $this->certificate = $certificate;
        $this->obtainedAt = $obtainedAt;
        $this->location = $location;
    }
}