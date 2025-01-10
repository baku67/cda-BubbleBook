<?php 

namespace App\DTO\Response;

// ResponseDTO
class UserProfilDTO
{
    public function __construct(
        public string $username,
        public string $email,
        public string $accountType,
        public string|null $nationality,
        public string|null $avatarUrl,
        public string|null $bannerUrl,
        public bool $isVerified,
        public bool $is2fa
    ) {}
}