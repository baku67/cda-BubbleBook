<?php 
namespace App\DTO\Response;

// ResponseDTO
class OtherUserProfilDTO
{
    public function __construct(
        readonly public string $accountType,
        readonly public string $username,
        readonly public ?string $avatarUrl,
        readonly public ?string $bannerUrl,
        readonly public ?int $initialDivesCount,
        readonly public ?string $nationality,

        // ajouter les ?Carnets (filtré via privacySettings dans query)

        // ajouter les ?Certificates (filtré via privacySettings dans query)

        // ajouter les ?Gallerie(MediasURLs?) (filtrés via privacySettings dans query)
    ) {}
}