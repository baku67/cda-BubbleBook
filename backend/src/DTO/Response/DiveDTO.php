<?php
namespace App\DTO\Response;

use App\Entity\Dive\Dive;

class DiveDTO
{
    public function __construct(
        readonly public int $id,
        readonly public string $title,
        readonly public ?string $description,
        readonly public string $diveDatetime,
        readonly public int $diveDuration,
        readonly public float $weight,
        readonly public ?int $temperature,
        readonly public ?string $visibility,
        readonly public ?int $satisfaction,
        readonly public array $tags
    ) {}

    public static function fromEntity(Dive $dive): self
    {
        // Convert tags collection to array of tag names
        $tags = [];
        foreach ($dive->getDiveTags() as $tag) {
            $tags[] = $tag->getName();
        }

        return new self(
            $dive->getId(),
            $dive->getTitle(),
            $dive->getDescription(),
            $dive->getDiveDatetime()->format(DATE_ATOM),
            $dive->getDiveDuration(),
            $dive->getWeight(),
            $dive->getTemperature(),
            $dive->getVisibility()?->value,
            $dive->getSatisfaction(),
            $tags
        );
    }

    public function toArray(): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'description'   => $this->description,
            'diveDatetime'  => $this->diveDatetime,
            'diveDuration'  => $this->diveDuration,
            'weight'        => $this->weight,
            'temperature'   => $this->temperature,
            'visibility'    => $this->visibility,
            'satisfaction'  => $this->satisfaction,
            'tags'          => $this->tags,
        ];
    }
}