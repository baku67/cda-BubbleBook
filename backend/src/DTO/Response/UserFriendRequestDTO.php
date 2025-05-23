<?php

namespace App\DTO\Response;

class UserFriendRequestDTO
{
    public function __construct(
        readonly public int                 $friendshipId,
        readonly public int                 $emitterId,
        readonly public string              $emitterUsername,
        readonly public string              $emitterAvatarUrl,
        readonly public string              $emitterBannerUrl,
        readonly public ?string             $emitterNationality,
        readonly public string              $status,
        readonly public \DateTimeImmutable  $sentAt,
        readonly public ?string             $message,
    ) {}
}