<?php
namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

// RequestDTO
class AddDiveDTO
{
    public int $divelogId;

    /**
     * @Assert\Valid()
     * @Type("App\DTO\AddDiveInfosDTO")
     */
    private AddDiveInfosDTO $infos;

    /**
     * @Assert\Valid()
     * @Type("array<App\DTO\MediaDTO>")
     */
    private array $medias = [];

    /**
     * @Assert\All({
     *   @Assert\Type("integer")
     * })
     */
    private array $buddies = [];

    public function getInfos(): AddDiveInfosDTO { return $this->infos; }
    public function setInfos(AddDiveInfosDTO $i){ $this->infos = $i; return $this; }

    public function getMedias(): array { return $this->medias; }
    public function setMedias(array $m){ $this->medias = $m; return $this; }

    public function getBuddies(): array { return $this->buddies; }
    public function setBuddies(array $b){ $this->buddies = $b; return $this; }
}