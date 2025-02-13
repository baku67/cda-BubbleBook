<?php
namespace App\Service\User;

use App\DTO\Response\UserProfilDTO;
use App\Entity\User\User;

class UserProfileService
{
    public function getProfile(User $user): UserProfilDTO
    {
        return new UserProfilDTO(
            $user->getUsername(),
            $user->getEmail(),
            $user->getAccountType(),
            $user->getNationality(),
            $user->getAvatarUrl(),
            $user->getBannerUrl(),
            $user->isVerified(),
            $user->is2fa(),
            $user->getInitialDivesCount(),
            $user->getProfilPrivacy()->value,
        );
    }
}
