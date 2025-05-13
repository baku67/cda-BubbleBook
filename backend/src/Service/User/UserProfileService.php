<?php
namespace App\Service\User;

use App\DTO\Response\OtherUserProfilDTO;
use App\DTO\Response\UserProfilDTO;
use App\Entity\User\User;
use App\Repository\Friendship\FriendshipRepository;
use App\Repository\User\UserRepository;

class UserProfileService
{
    public function __construct(
        private UserRepository $userRepository,
        private FriendshipRepository $friendshipRepository
    ) {}

    public function getProfile(User $user): UserProfilDTO
    {
        return new UserProfilDTO(
            $user->getUsername(),
            $user->getEmail(),
            $user->getPendingEmail(),
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

    public function getOtherUserProfile(User $currentUser, int $otherUserId): ?OtherUserProfilDTO
    {
        $otherUser = $this->userRepository->findOtherUser($otherUserId);

        if (!$otherUser) {
            return null; 
        }

        // Statut relation amis inclu dans le DTO:
        $friendship = $this->friendshipRepository
            ->findOneBetween($currentUser, $otherUser);
        $friendshipStatus = $friendship
            ? $friendship->getStatus()   // 'pending' ou 'accepted' etc.
            : 'none';

        return new OtherUserProfilDTO(
            $otherUser->getId(),
            $otherUser->getAccountType(),
            $otherUser->getUsername(),
            $otherUser->getAvatarUrl(),
            $otherUser->getBannerUrl(),
            $otherUser->getInitialDivesCount(),
            $otherUser->getNationality(),
            $otherUser->getLogBooksPrivacy()->value,
            $otherUser->getCertificatesPrivacy()->value,
            $otherUser->getGalleryPrivacy()->value,
            $friendshipStatus

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
