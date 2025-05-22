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
        // 1. Désérialisation + validation
        $dto = $this->serializer
            ->deserialize(json_encode($data), UserPrivacyDTO::class, 'json');

        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }

        // 2. Sauvegarde des valeurs originales des sous-champs
        $subFields = ['logBooksPrivacy', 'certificatesPrivacy', 'galleryPrivacy'];
        $original = [];
        foreach ($subFields as $f) {
            $getter = 'get' . ucfirst($f);
            $original[$f] = $user->$getter(); // instance de PrivacyOption
        }

        // 3. Si on change le profilPrivacy → on l'applique + cascade sur tous les sous-champs
        if ($dto->profilPrivacy !== null) {
            $newProfile = PrivacyOption::tryFrom($dto->profilPrivacy)
                ?: throw new \InvalidArgumentException("Valeur invalide pour profilPrivacy");

            $user->setProfilPrivacy($newProfile);

            foreach ($subFields as $f) {
                $getter = 'get' . ucfirst($f);
                $current = $user->$getter(); 
                // Si l'ancien niveau est moins restrictif que le nouveau profil → on le relève
                if ($current->isLessRestrictiveThan($newProfile)) {
                    $setter = 'set' . ucfirst($f);
                    $user->$setter($newProfile);
                }
            }
        }

        // 4. Traitement des mises à jour explicites des sous-champs
        foreach ($subFields as $f) {
            if ($dto->$f === null) {
                continue; // pas fourni → rien à faire
            }

            $wanted = PrivacyOption::tryFrom($dto->$f)
                ?: throw new \InvalidArgumentException("Valeur invalide pour $f");

            // On n'applique que si l'utilisateur a vraiment changé la valeur
            if ($wanted !== $original[$f]) {
                // Récupère le profil à jour (celui qu’on vient de setter, ou l’ancien si pas modifié)
                $profile = $user->getProfilPrivacy();

                // Interdit de rendre un sous-champ plus ouvert que le profil
                if ($wanted->isLessRestrictiveThan($profile)) {
                    throw new \InvalidArgumentException(sprintf(
                        "Vous ne pouvez pas définir %s à %s car %s est le niveau maximal autorisé",
                        $f,
                        $wanted->value,
                        $profile->value
                    ));
                }

                $setter = 'set' . ucfirst($f);
                $user->$setter($wanted);
            }
        }

        // 5. Persistance
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

}
