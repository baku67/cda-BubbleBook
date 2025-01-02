<?php

namespace App\Controller;

use App\DTO\Request\AddCertificateDTO;
use App\Entity\User;
use App\Entity\UserCertificate;
use App\Repository\CertificateRepository;
use App\Repository\UserCertificateRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Doctrine\ORM\EntityManagerInterface;
use App\DTO\Response\CertificateDTO;
use App\DTO\Response\UserCertificateDTO;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CertificateController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}


    #[Route('/api/certificates', name: 'api_certificates', methods: ['GET'])]
    public function getCertificates(
        CertificateRepository $certificateRepository, 
    ): JsonResponse
    {
        // Route publique, pas de vérif $this->getUser

        // Récupérer tous les certificats disponibles
        $allCertificates = $certificateRepository->findAll();

        // Transformer les résultats en DTOs
        $certificateDTOs = array_map(function ($certificate) {
            return new CertificateDTO($certificate->getId(), $certificate->getName(), $certificate->getType());
        }, $allCertificates);
        
        if (!$allCertificates) {
            return new JsonResponse(['error' => 'Aucuns certificats disponibles']);
        }
        return $this->json($certificateDTOs);
    }


    #[Route('/api/user/certificates', name: 'api_user_certificates', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getUserCertificates(
        UserCertificateRepository $userCertificateRepository,
        CertificateRepository $certificateRepository, 
    ): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'CertificateController2: instanceof User'], Response::HTTP_UNAUTHORIZED);
        }

        // Choix 1: Récupère les certificats de l'utilisateur (mieux car transformation en DTO dans le repo)
        $certificatesDTOs = $userCertificateRepository->findCertificatesAsDTOByUserId($user->getId());

        // Choix 2: Récupère les certificats de l'utilisateur avec méthode de Collection Doctrine (et transformation en DTO)
        // $userCertificates = $user->getUserCertificates(); 
        // $certificatesDTOs = $userCertificates->map(function ($userCertificate) {
        //     $certificate = $userCertificate->getCertificate(); // Relation
        //     return new UserCertificateDTO(
        //         $certificate->getId(),
        //         $certificate->getName(),
        //         $certificate->getType(),
        //         $userCertificate->getObtainedAt()
        //     );
        // })->toArray();

        return $this->json($certificatesDTOs);
    }



    #[Route('/api/user/addCertificate', name: 'api_user_add_certificate', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function addUserCertificate(
        Request $request,
        ValidatorInterface $validator,
        UserCertificateRepository $userCertificateRepository,
        CertificateRepository $certificateRepository, 
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Créer et valider le DTO
        $dto = new AddCertificateDTO();
        $dto->organisationValue = $data['organisationValue'] ?? null;
        $dto->certificateValue = $data['certificateValue'] ?? null;
        $dto->obtainedDate = isset($data['obtainedDate']) ? new \DateTime($data['obtainedDate']) : null;
        $dto->location = $data['location'] ?? null;

        // Valider les données avec le Validator
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return new JsonResponse(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'CertificateController2: instanceof User'], Response::HTTP_UNAUTHORIZED);
        }


        // Vérifier si le certificat existe dans le repository
        $certificate = $certificateRepository->findOneBy([
            'name' => $dto->certificateValue,
            'type' => $dto->organisationValue,
        ]);
        if (!$certificate) {
            return new JsonResponse(['error' => 'Le certificat spécifié est introuvable.'], Response::HTTP_NOT_FOUND);
        }
        // Vérifier si l'utilisateur possède déjà ce certificat
        $existingCertificate = $userCertificateRepository->findOneBy([
            'user' => $user,
            'certificate' => $certificate,
        ]);
        if ($existingCertificate) {
            return new JsonResponse(['error' => 'Vous possédez déjà ce certificat.'], Response::HTTP_CONFLICT);
        }


        // Créer un nouvel objet UserCertificate
        $userCertificate = new UserCertificate();
        $userCertificate->setUser($user);
        $userCertificate->setCertificate($certificate);
        if ($dto->obtainedDate) {
            $obtainedDateImmutable = \DateTimeImmutable::createFromMutable($dto->obtainedDate);
            $userCertificate->setObtainedDate($obtainedDateImmutable);
        }
        $userCertificate->setLocation($dto->location);

        // Ajouter le certificat à l'utilisateur
        $user->addUserCertificate($userCertificate);

        try {
            $this->entityManager->persist($userCertificate);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'Erreur lors de l\'ajout du certificat. Veuillez réessayer plus tard.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }


        return new JsonResponse([
            'message' => 'Votre certificat a bien été ajouté.'
        ], Response::HTTP_CREATED); // 201
    }


    #[Route('/api/user/deleteCertificate/{certificateId}', name: 'api_user_delete_certificate', methods: ['DELETE'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function deleteUserCertificate(
        int $certificateId,
        UserCertificateRepository $userCertificateRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized access.'], Response::HTTP_UNAUTHORIZED);
        }
    
        // Trouver le certificat utilisateur
        $userCertificate = $userCertificateRepository->findOneBy([
            'certificate' => $certificateId,
            'user' => $user,
        ]);
    
        if (!$userCertificate) {
            return new JsonResponse(['error' => 'Certificate not found or does not belong to the user.'], Response::HTTP_NOT_FOUND);
        }
    
        // Supprimer le certificat
        try {
            $entityManager->remove($userCertificate);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'An error occurred while deleting the certificate.',
                'details' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        return new JsonResponse(['message' => 'Certificate deleted successfully.'], Response::HTTP_OK);
    }
    

}
