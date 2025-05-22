<?php 
namespace App\DTO\Response;

// ResponseDTO
class UserProfilDTO
{
    public function __construct(
        readonly public string $username,
        readonly public string $email,
        readonly public ?string $pendingEmail,
        readonly public ?int $firstLoginStep,
        readonly public string $accountType,
        readonly public ?string $nationality,
        readonly public ?string $avatarUrl,
        readonly public ?string $bannerUrl,
        readonly public bool $isVerified,
        readonly public bool $is2fa,
        readonly public ?int $initialDivesCount,
        readonly public string $profilPrivacy,
        readonly public string $logBooksPrivacy,
        readonly public string $certificatesPrivacy,
        readonly public string $galleryPrivacy,
        readonly public int $divesCount,
    ) {}
}