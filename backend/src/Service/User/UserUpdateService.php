<?php
namespace App\Service\User;

use App\DTO\Request\FirstLogin1DTO;
use App\DTO\Request\FirstLogin2DTO;
use App\Entity\User\User;
use App\Enum\PrivacyOption;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\SerializerInterface;

// TODO: utiliser un PUT et ne plus tenir compte des différents appels ?
class UserUpdateService
{
    public function __construct(
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private EntityManagerInterface $entityManager
    ) {}

    public function updateUser(User $user, array $data): void
    {
        if (isset($data['accountType']) && !isset($data['profilPrivacy'])) {
            $dto = $this->serializer->deserialize(json_encode($data), FirstLogin1DTO::class, 'json');
            $user->setAccountType($dto->accountType);

            if ($user->getFirstLoginStep() === 1) {
                $user->setFirstLoginStep(2);
            }
        } elseif (isset($data['username']) && !isset($data['profilPrivacy'])) {
            $dto = $this->serializer->deserialize(json_encode($data), FirstLogin2DTO::class, 'json');
            $user->setUsername($dto->username);
            $user->setNationality($dto->nationality);
            $user->setAvatarUrl($dto->avatar);
            $user->setBannerUrl($dto->banner);
            $user->setInitialDivesCount($dto->initialDivesCount);

            if ($user->getFirstLoginStep() === 2) {
                $user->setFirstLoginStep(null);
            }
        } elseif (isset($data['passStep'], $data['step']) && $data['passStep'] === true) {
            if ($user->getFirstLoginStep() === (int)$data['step']) {
                $user->setFirstLoginStep(null);
            }
        } elseif (isset($data['profilPrivacy']) || isset($data['logBooksPrivacy']) || isset($data['certificatesPrivacy']) || isset($data['galleryPrivacy'])) {
            $privacyOption = PrivacyOption::tryFrom($data['profilPrivacy']);
    
            if ($privacyOption !== null) {
                $user->setProfilPrivacy($privacyOption);
            } else {
                throw new \InvalidArgumentException('Invalid value for profilPrivacy');
            }
        } else {
            throw new \InvalidArgumentException('Invalid data format.');
        }

        if (isset($dto)) {
            $errors = $this->validator->validate($dto);
            if (count($errors) > 0) {
                throw new \InvalidArgumentException((string) $errors);
            }
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}
