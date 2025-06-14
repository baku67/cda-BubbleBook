<?php

use App\Entity\Friendship\Friendship;
use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use App\Repository\Dive\DiveRepository;
use App\Repository\Friendship\FriendshipRepository;
use App\Repository\User\UserRepository;
use App\Service\User\UserProfileService;
use PHPUnit\Framework\TestCase;

class FriendshipServiceTest extends TestCase
{
    public function testIsFriendReturnsTrueIfFriendshipIsAccepted(): void
    {
        $userA = $this->createMock(User::class);
        $userB = $this->createMock(User::class);

        $friendship = $this->createMock(Friendship::class);
        $friendship->method('getStatus')->willReturn(FriendshipStatus::ACCEPTED);

        $friendshipRepository = $this->createMock(FriendshipRepository::class);
        $friendshipRepository
            ->method('findOneBetween')
            ->with($userA, $userB)
            ->willReturn($friendship);

        $userRepository = $this->createMock(UserRepository::class);
        $diveRepository = $this->createMock(DiveRepository::class);

        $service = new class($userRepository, $friendshipRepository, $diveRepository) extends UserProfileService {
            public function callIsFriend(User $a, User $b): bool
            {
                return $this->isFriend($a, $b);
            }
        };

        $this->assertTrue($service->callIsFriend($userA, $userB));
    }

    public function testIsFriendReturnsFalseIfNoFriendship(): void
    {
        $userA = $this->createMock(User::class);
        $userB = $this->createMock(User::class);

        $friendshipRepository = $this->createMock(FriendshipRepository::class);
        $friendshipRepository
            ->method('findOneBetween')
            ->with($userA, $userB)
            ->willReturn(null);

        $userRepository = $this->createMock(UserRepository::class);
        $diveRepository = $this->createMock(DiveRepository::class);

        $service = new class($userRepository, $friendshipRepository, $diveRepository) extends UserProfileService {
            public function callIsFriend(User $a, User $b): bool
            {
                return $this->isFriend($a, $b);
            }
        };

        $this->assertFalse($service->callIsFriend($userA, $userB));
    }

    public function testIsFriendReturnsFalseIfFriendshipNotAccepted(): void
    {
        $userA = $this->createMock(User::class);
        $userB = $this->createMock(User::class);

        $friendship = $this->createMock(Friendship::class);
        $friendship->method('getStatus')->willReturn(FriendshipStatus::PENDING);

        $friendshipRepository = $this->createMock(FriendshipRepository::class);
        $friendshipRepository
            ->method('findOneBetween')
            ->with($userA, $userB)
            ->willReturn($friendship);

        $userRepository = $this->createMock(UserRepository::class);
        $diveRepository = $this->createMock(DiveRepository::class);

        $service = new class($userRepository, $friendshipRepository, $diveRepository) extends UserProfileService {
            public function callIsFriend(User $a, User $b): bool
            {
                return $this->isFriend($a, $b);
            }
        };

        $this->assertFalse($service->callIsFriend($userA, $userB));
    }
}
