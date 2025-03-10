<?php
namespace App\Service\Certificate;

use App\DTO\Request\AddUserCertificateDTO;
use App\Entity\User\User;
use App\Entity\Certificate\UserCertificate;
use App\Repository\Certificate\CertificateRepository;
use App\Repository\Certificate\UserCertificateRepository;
use Doctrine\ORM\EntityManagerInterface;

class UserCertificateService
{
    public function __construct(
        private CertificateRepository $certificateRepository,
        private UserCertificateRepository $userCertificateRepository,
        private EntityManagerInterface $entityManager
    ) {}

    public function getUserCertificates(User $user): array
    {
        return $this->userCertificateRepository->findCertificatesByUserId($user->getId());
    }

    public function addUserCertificateWithOrder(User $user, AddUserCertificateDTO $dto): UserCertificate
    {
        // Récupérer le dernier displayOrder et l'incrémenter
        $lastOrder = $this->userCertificateRepository->getMaxDisplayOrderForUser($user);
        $dto->displayOrder = $lastOrder + 1;
        return $this->addUserCertificate($user, $dto);
    }

    public function addUserCertificate(User $user, AddUserCertificateDTO $dto): UserCertificate
    {
        $certificate = $this->certificateRepository->findOneBy([
            'name' => $dto->certificateValue,
            'type' => $dto->organisationValue,
        ]);

        if (!$certificate) {
            throw new \InvalidArgumentException('Le certificat spécifié est introuvable.');
        }

        $existingCertificate = $this->userCertificateRepository->findOneBy([
            'user' => $user,
            'certificate' => $certificate,
        ]);

        if ($existingCertificate) {
            throw new \LogicException('Vous possédez déjà ce certificat.');
        }

        $userCertificate = new UserCertificate();
        $userCertificate->setUser($user);
        $userCertificate->setCertificate($certificate);
        $userCertificate->setDisplayOrder($dto->displayOrder);

        if ($dto->obtainedDate) {
            $obtainedDateImmutable = \DateTimeImmutable::createFromMutable($dto->obtainedDate);
            $userCertificate->setObtainedDate($obtainedDateImmutable);
        }

        $userCertificate->setLocation($dto->location);
        $this->entityManager->persist($userCertificate);
        $this->entityManager->flush();

        return $userCertificate;
    }

    public function deleteUserCertificate(User $user, int $certificateId): void
    {
        $userCertificate = $this->userCertificateRepository->findOneBy([
            'certificate' => $certificateId,
            'user' => $user,
        ]);

        if (!$userCertificate) {
            throw new \InvalidArgumentException('Certificate not found or does not belong to the user.');
        }

        $this->entityManager->remove($userCertificate);
        $this->entityManager->flush();

        $this->reorderDisplayOrders($user); // Pour éviter les trous
    }

    // Suite à suppression d'un certificats pour éviter les trous
    private function reorderDisplayOrders(User $user): void
    {
        $certificates = $this->userCertificateRepository->findBy(
            ['user' => $user],
            ['displayOrder' => 'ASC']
        );

        $order = 1;
        foreach ($certificates as $certificate) {
            $certificate->setDisplayOrder($order++);
        }

        $this->entityManager->flush();
    }

    // Réorganisation de l'ordre des certificats (drag and drop front)
    public function updateCertificateOrder(User $user, array $updatedOrder): void
    {
        foreach ($updatedOrder as $orderData) {
            $certificate = $this->userCertificateRepository->findOneBy([
                'id' => $orderData['id'],
                'user' => $user
            ]);

            if ($certificate) {
                $certificate->setDisplayOrder($orderData['displayOrder']);
            }
        }

        $this->entityManager->flush();
    }
}
