<?php 

namespace App\DTO\Response;

class UserProfilDTO
{
    public function __construct(
        public string $username,
        public string $email,
        public string $accountType,
        public string|null $nationality,
        public bool $isVerified,
        public bool $is2fa
    ) {}
}