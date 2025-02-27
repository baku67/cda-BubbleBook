<?php

namespace App\DTO\Response;

use App\Entity\User\User;

class UserSearchDTO
{
    public function __construct(
        readonly public int $id,
        readonly public string $username,
        readonly public ?string $nationality,
        readonly public ?string $avatarUrl,
        readonly public ?string $bannerUrl,
        readonly public ?int $initialDivesCount,
        readonly public string $accountType,
    ) {}

    public static function fromEntity(User $user): self
    {
        return new self(
            $user->getId(),
            $user->getUsername(),
            $user->getNationality(),
            $user->getAvatarUrl(),
            $user->getBannerUrl(),
            $user->getInitialDivesCount(),
            $user->getAccountType(),
        );
    }

    /**
     * Convertit un tableau d'entités User en tableau de DTO.
     */
    public static function fromEntities(array $users): array
    {
        return array_map(fn(User $user) => self::fromEntity($user), $users);
    }
}
