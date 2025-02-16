<?php
namespace App\Service\User;

use App\DTO\Request\FirstLogin1DTO;
use App\DTO\Request\FirstLogin2DTO;
use App\DTO\Request\UserPrivacyDTO;
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

    // PATCH
    public function updateUser(User $user, array $data): void
    {
        if (isset($data['accountType'])) {
            $this->updateAccountType($user, $data);
        }
    
        if (isset($data['username'])) {
            $this->updateProfileInfo($user, $data);
        }
    
        $this->entityManager->flush(); 
    }
    
    private function updateAccountType(User $user, array $data): void
    {
        $dto = $this->serializer->deserialize(json_encode($data), FirstLogin1DTO::class, 'json');
        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }
    
        $user->setAccountType($dto->accountType);
        if ($user->getFirstLoginStep() === 1) {
            $user->setFirstLoginStep(2);
        }
    }
    
    private function updateProfileInfo(User $user, array $data): void
    {
        $dto = $this->serializer->deserialize(json_encode($data), FirstLogin2DTO::class, 'json');
        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }
    
        $user->setUsername($dto->username);
        $user->setNationality($dto->nationality);
        $user->setAvatarUrl($dto->avatar);
        $user->setBannerUrl($dto->banner);
        $user->setInitialDivesCount($dto->initialDivesCount);
        if ($user->getFirstLoginStep() === 2) {
            $user->setFirstLoginStep(null);
        }
    }
    

    // PUT
    public function updateUserPrivacySettings(User $user, array $data): void
    {
        $dto = $this->serializer->deserialize(json_encode($data), UserPrivacyDTO::class, 'json');
    
        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }
    
        foreach (['profilPrivacy', 'logBooksPrivacy', 'certificatesPrivacy', 'galleryPrivacy'] as $field) {
            if ($dto->$field !== null) {
                $option = PrivacyOption::tryFrom($dto->$field);
                if ($option === null) {
                    throw new \InvalidArgumentException("Invalid value for $field");
                }
                $setter = 'set' . ucfirst($field);
                if (method_exists($user, $setter)) {
                    $user->$setter($option);
                }
            }
        }
    
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
    

}
