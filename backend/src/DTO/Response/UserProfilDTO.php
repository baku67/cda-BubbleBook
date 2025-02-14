<?php 
namespace App\DTO\Response;

// ResponseDTO
class UserProfilDTO
{
    public function __construct(
        readonly public string $username,
        readonly public string $email,
        readonly public string $accountType,
        readonly public ?string $nationality,
        readonly public ?string $avatarUrl,
        readonly public ?string $bannerUrl,
        readonly public bool $isVerified,
        readonly public bool $is2fa,
        readonly public ?int $initialDivesCount,
        readonly public string $profilPrivacy,
    ) {}
}