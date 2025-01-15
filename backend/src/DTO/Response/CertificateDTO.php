<?php
namespace App\DTO\Response;

// ResponseDTO
class CertificateDTO
{
    public function __construct(
        public ?int $id,
        public ?string $name,
        public ?string $type
    ) {}
}
