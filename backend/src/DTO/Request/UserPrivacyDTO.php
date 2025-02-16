<?php
namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;
use App\Enum\PrivacyOption;

class UserPrivacyDTO
{
    #[Assert\Choice(choices: PrivacyOption::VALUES, message: 'Invalid profilPrivacy value.')]
    public ?string $profilPrivacy = null;

    #[Assert\Choice(choices: PrivacyOption::VALUES, message: 'Invalid logBooksPrivacy value.')]
    public ?string $logBooksPrivacy = null;

    #[Assert\Choice(choices: PrivacyOption::VALUES, message: 'Invalid certificatesPrivacy value.')]
    public ?string $certificatesPrivacy = null;

    #[Assert\Choice(choices: PrivacyOption::VALUES, message: 'Invalid galleryPrivacy value.')]
    public ?string $galleryPrivacy = null;
}
