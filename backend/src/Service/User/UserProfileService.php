<?php
namespace App\Service\User;

use App\DTO\Response\OtherUserProfilDTO;
use App\DTO\Response\UserProfilDTO;
use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use App\Repository\Dive\DiveRepository;
use App\Repository\Friendship\FriendshipRepository;
use App\Repository\User\UserRepository;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserProfileService
{
    public function __construct(
        private UserRepository $userRepository,
        protected FriendshipRepository $friendshipRepository,
        private DiveRepository $diveRepository,
    ) {}

    public function getProfile(User $user): UserProfilDTO
    {
        $divesCount = $this->diveRepository->countByUserId($user->getId());

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
            $user->getInitialDivesCount() + $divesCount,
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
        $friendshipStatus = $friendship?->getStatus()->value ?? 'none';

        // 4) Calcul des privacy (pour désactiver les boutons de nav otherUserCard)
        $isFriend = $this->isFriend($currentUser, $other);
        // *** Certificates
        $canViewCertificates = $this->canViewByPrivacy(
            $other->getCertificatesPrivacy()->value,
            $isFriend
        );
        // *** Divelogs
        $canViewDivelogs    = $this->canViewByPrivacy(
            $other->getLogBooksPrivacy()->value,
            $isFriend
        );
        // *** Gallery
        $canViewGallery     = $this->canViewByPrivacy(
            $other->getGalleryPrivacy()->value,
            $isFriend
        );

        $divesCount = $this->diveRepository->countByUserId($otherUserId);

        // 4) DTO de réponse
        return new OtherUserProfilDTO(
            $other->getId(),
            $other->getAccountType(),
            $other->getUsername(),
            $other->getAvatarUrl(),
            $other->getBannerUrl(),
            $other->getInitialDivesCount(),
            $other->getNationality(),
            $friendshipStatus,
            $other->getInitialDivesCount() + $divesCount,
            $canViewCertificates,
            $canViewDivelogs,
            $canViewGallery,
        );
    }

    /**
     * Détermine si $a et $b sont amis (statut "accepted").
     */
    protected function isFriend(User $a, User $b): bool
    {
        $friendship = $this->friendshipRepository->findOneBetween($a, $b);

        return
            $friendship !== null
            && $friendship->getStatus()->value === FriendshipStatus::ACCEPTED->value;
    }

    /**
     * @param string $privacy   Valeur de l'énumération : 'ALL', 'FRIENDS_ONLY', 'NO_ONE', etc.
     * @param bool   $isFriend  Résultat de isFriend()
     */
    private function canViewByPrivacy(string $privacy, bool $isFriend): bool
    {
        return match ($privacy) {
            'ALL'          => true,
            'FRIENDS_ONLY' => $isFriend,
            default        => false,
        };
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
