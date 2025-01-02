<?php

namespace App\Controller;

use App\Entity\User;
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
        UserCertificateRepository $userCertificateRepository,
        CertificateRepository $certificateRepository, 
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);


        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'CertificateController2: instanceof User'], Response::HTTP_UNAUTHORIZED);
        }

        // Vérification possession ou nom certif existe, ou organisme existe (Enum)
        
        // Ajout du certif a l'user
        // $user->addUserCertificate(UserCertificateDTO::fromJson($data));

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'Erreur lors de l\'ajout de certificat. Veuillez réessayer plus tard.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'message' => 'Votre certificat a bien été ajouté.'
        ], Response::HTTP_CREATED); // 201
    }
}
