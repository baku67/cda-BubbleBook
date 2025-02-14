<?php
namespace App\DTO\Response;

// ResponseDTO
class CertificateDTO
{
    public function __construct(
        readonly public ?int $id,
        readonly public ?string $name,
        readonly public ?string $type
    ) {}
}
