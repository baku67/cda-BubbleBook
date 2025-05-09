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
        readonly public array $tags,
        readonly public int $maxDepth,
        readonly public string $oxygenMode,
        readonly public ?int $oxygenMix,
        readonly public bool $safetyStop,
        readonly public array $decompressionStops
    ) {}

    public static function fromEntity(Dive $dive): self
    {
        // Convert tags collection to array of tag names
        $tags = [];
        foreach ($dive->getDiveTags() as $tag) {
            $tags[] = $tag->getName();
        }

        $decompressionStops = [];
        foreach ($dive->getDecompressionStops() as $stop) {
            $decompressionStops[] = [
                'depth'      => $stop->getDepth(),
                'duration'   => $stop->getDuration(),
                'timeOffset' => $stop->getTimeOffset()
            ];
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
            $tags,
            $dive->getMaxDepth(),
            $dive->getOxygenMode()->value,
            $dive->getOxygenMix(),
            $dive->isSafetyStop(),
            $decompressionStops,
        );
    }

    public function toArray(): array
    {
        return [
            'id'                 => $this->id,
            'title'              => $this->title,
            'description'        => $this->description,
            'diveDatetime'       => $this->diveDatetime,
            'diveDuration'       => $this->diveDuration,
            'weight'             => $this->weight,
            'temperature'        => $this->temperature,
            'visibility'         => $this->visibility,
            'satisfaction'       => $this->satisfaction,
            'tags'               => $this->tags,
            'maxDepth'           => $this->maxDepth,
            'oxygenMode'         => $this->oxygenMode,
            'oxygenMix'          => $this->oxygenMix,
            'safetyStop'         => $this->safetyStop,
            'decompressionStops' => $this->decompressionStops
        ];
    }
}