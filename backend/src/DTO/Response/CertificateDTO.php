<?php

namespace App\DTO\Response;

// ResponseDTO
class CertificateDTO
{
    public ?int $id = null;
    public ?string $name = null;
    public ?string $type = null;

    public function __construct(int $id, string $name, string $type)
    {
        $this->id = $id;
        $this->name = $name;
        $this->type = $type;
    }
}