<?php 
namespace App\DTO\Response;

// ResponseDTO
class DivelogDTO
{
    public function __construct(
        readonly public int $id,
        readonly public string $title,
        readonly public ?string $description,
        readonly public \DateTimeImmutable $createdAt,
        readonly public ?string $theme,
    ) {}
}