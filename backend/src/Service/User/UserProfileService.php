<?php
namespace App\Service\User;

use App\DTO\Response\OtherUserProfilDTO;
use App\DTO\Response\UserProfilDTO;
use App\Entity\User\User;
use App\Repository\Friendship\FriendshipRepository;
use App\Repository\User\UserRepository;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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

    public function getOtherUserProfile(User $currentUser, int $otherUserId): OtherUserProfilDTO
    {
        // 1) existence
        $other = $this->userRepository->find($otherUserId);
        if (!$other) {
            throw new NotFoundHttpException('Utilisateur introuvable');
        }

        // 2) privacy
        $canSee = $this->userRepository->isVisibleTo($currentUser, $other);
        if (!$canSee) {
            throw new AccessDeniedHttpException('Profil non visible (privacy)');
        }

        // 3) friendship
        $friendship = $this->friendshipRepository->findOneBetween($currentUser, $other);
        $status     = $friendship?->getStatus()->value ?? 'none';

        // 4) DTO de réponse
        return new OtherUserProfilDTO(
            $other->getId(),
            $other->getAccountType(),
            $other->getUsername(),
            $other->getAvatarUrl(),
            $other->getBannerUrl(),
            $other->getInitialDivesCount(),
            $other->getNationality(),
            $other->getLogBooksPrivacy()->value,
            $other->getCertificatesPrivacy()->value,
            $other->getGalleryPrivacy()->value,
            $status
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
