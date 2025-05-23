<?php

namespace App\Entity\Friendship;

use App\Entity\User\User;
use App\Enum\FriendshipStatus;
use App\Repository\Friendship\FriendshipRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FriendshipRepository::class)]
class Friendship
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'friendships')]
    #[ORM\JoinColumn(nullable: false)]
    private User $emitter;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private User $recipient;

    #[ORM\Column(type: 'string', enumType: FriendshipStatus::class)]
    private FriendshipStatus $status; 

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $message = null;

    public function __construct(User $emitter, User $recipient)
    {
        $this->emitter = $emitter;
        $this->recipient = $recipient;
        $this->status = FriendshipStatus::PENDING;
        $now = new \DateTimeImmutable();
        $this->createdAt = $now;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmitter(): ?User
    {
        return $this->emitter;
    }

    public function setEmitter(?User $emitter): static
    {
        $this->emitter = $emitter;

        return $this;
    }

    public function getRecipient(): ?User
    {
        return $this->recipient;
    }

    public function setRecipient(?User $recipient): static
    {
        $this->recipient = $recipient;

        return $this;
    }

    public function getStatus(): ?FriendshipStatus
    {
        return $this->status;
    }

    public function setStatus(FriendshipStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function accept(): self
    {
        return $this->setStatus(FriendshipStatus::ACCEPTED);
    }

    public function reject(): self
    {
        return $this->setStatus(FriendshipStatus::REFUSED);
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }
}
