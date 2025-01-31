<?php 
namespace App\DTO\Response;

// ResponseDTO
class UserProfilDTO
{
    public function __construct(
        public string $username,
        public string $email,
        public string $accountType,
        public ?string $nationality,
        public ?string $avatarUrl,
        public ?string $bannerUrl,
        public bool $isVerified,
        public bool $is2fa,
        public ?int $initialDivesCount,
    ) {}
}