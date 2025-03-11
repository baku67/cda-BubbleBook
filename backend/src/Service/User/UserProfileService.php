<?php
namespace App\Service\User;

use App\DTO\Response\OtherUserProfilDTO;
use App\DTO\Response\UserProfilDTO;
use App\Entity\User\User;
use App\Repository\User\UserRepository;

class UserProfileService
{
    public function __construct(private UserRepository $userRepository) {}

    public function getProfile(User $user): UserProfilDTO
    {
        return new UserProfilDTO(
            $user->getUsername(),
            $user->getEmail(),
            $user->getFirstLoginStep(),
            $user->getAccountType(),
            $user->getNationality(),
            $user->getAvatarUrl(),
            $user->getBannerUrl(),
            $user->isVerified(),
            $user->is2fa(),
            $user->getInitialDivesCount(),
            $user->getProfilPrivacy()->value,
            $user->getLogBooksPrivacy()->value,
            $user->getCertificatesPrivacy()->value,
            $user->getGalleryPrivacy()->value,
        );
    }

    public function getOtherUserProfile(int $otherUserId): ?OtherUserProfilDTO
    {
        $user = $this->userRepository->findOtherUser($otherUserId);

        if (!$user) {
            return null; 
        }

        return new OtherUserProfilDTO(
            $user->getAccountType(),
            $user->getUsername(),
            $user->getAvatarUrl(),
            $user->getBannerUrl(),
            $user->getInitialDivesCount(),
            $user->getNationality(),

            // ajouter les ?Carnets (filtré via privacySettings dans query)
            // ajouter les ?Certificates (filtré via privacySettings dans query)
            // ajouter les ?Gallerie(MediasURLs?) (filtrés via privacySettings dans query)
            // $this->getFilteredDives($user),
            // $this->getFilteredCertificates($user),
            // $this->getFilteredGallery($user)
        
        );
    }

    // private function getFilteredDives(User $user): array
    // {
    //     return $user->getPrivacySettings()->isDivesPublic() 
    //         ? $user->getDives()->toArray() 
    //         : [];
    // }

    // private function getFilteredCertificates(User $user): array
    // {
    //     return $user->getPrivacySettings()->isCertificatesPublic() 
    //         ? $user->getCertificates()->toArray() 
    //         : [];
    // }

    // private function getFilteredGallery(User $user): array
    // {
    //     return $user->getPrivacySettings()->isGalleryPublic() 
    //         ? $user->getGallery()->toArray() 
    //         : [];
    // }
}
