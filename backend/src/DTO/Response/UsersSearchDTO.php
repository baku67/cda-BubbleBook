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

    // paramètre n'est plus User mais un tableau avec ce qu'il faut (double sécu + opti)
    public static function fromRawData(array $usersData): array
    {
        return array_map(fn(array $user) => new self(
            $user['id'],
            $user['username'],
            $user['nationality'] ?? null,
            $user['avatarUrl'] ?? null,
            $user['bannerUrl'] ?? null,
            $user['initialDivesCount'] ?? null,
            $user['accountType']
        ), $usersData);
    }

    /**
     * Convertit un tableau brut de la BDD en tableau de DTO.
     */
    public static function fromEntities(array $users): array
    {
        return self::fromRawData($users); 
    }
}
