<?php

namespace App\DTO\Response;

// ResponseDTO
class UserCertificateDTO
{
    public ?int $id = null;
    public ?CertificateDTO $certificate = null;
    public ?\DateTimeImmutable $obtainedDate = null;
    public ?string $location = null;

    public function __construct(
        int $id,
        CertificateDTO $certificate,
        ?\DateTimeImmutable $obtainedDate = null,
        ?string $location = null
    ) {
        $this->id = $id;
        $this->certificate = $certificate;
        $this->obtainedDate = $obtainedDate;
        $this->location = $location;
    }
}