<?php

namespace App\DTO;

class CertificateDTO
{
    public int $id;
    public string $name;
    public string $type;

    public function __construct(int $id, string $name, string $type)
    {
        $this->id = $id;
        $this->name = $name;
        $this->type = $type;
    }
}