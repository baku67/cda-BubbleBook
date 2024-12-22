<?php

namespace App\DTO\Response;

// ResponseDTO
class UserCertificateDTO
{
    public ?int $certificateId = null;
    public ?string $certificateName = null;
    public ?string $certificateType = null;
    public ?\DateTimeImmutable $obtainedAt = null;

    public function __construct(
        int $certificateId, 
        string $certificateName, 
        string $certificateType, 
        ?\DateTimeImmutable $obtainedAt = null
    ) {
        $this->certificateId = $certificateId;
        $this->certificateName = $certificateName;
        $this->certificateType = $certificateType;
        $this->obtainedAt = $obtainedAt;
    }
}
