<?php 
namespace App\DTO\Response;

// ResponseDTO
class OtherUserProfilDTO
{
    public function __construct(
        readonly public string $id,
        readonly public string $accountType,
        readonly public string $username,
        readonly public ?string $avatarUrl,
        readonly public ?string $bannerUrl,
        readonly public ?int $initialDivesCount,
        readonly public ?string $nationality,
        readonly public string $friendshipStatus, 
        readonly public int $divesCount,

        // Calcul de la possibilité de voir les infos pour l'utilisateur connecté
        readonly public bool $canViewCertificates,
        readonly public bool $canViewDivelogs,
        readonly public bool $canViewGallery,

        // ajouter les ?Carnets (filtré via privacySettings dans query)

        // ajouter les ?Certificates (filtré via privacySettings dans query)

        // ajouter les ?Gallerie(MediasURLs?) (filtrés via privacySettings dans query)
    ) {}
}