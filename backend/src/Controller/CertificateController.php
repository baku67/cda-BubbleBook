<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserCertificateRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class CertificateController extends AbstractController
{
    #[Route('/api/user/certificates', name: 'api_user_certificates', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getUserCertificates(UserCertificateRepository $userCertificateRepository): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            // ça peut venir de là:
            return new JsonResponse(['error' => 'enlo CERTIFICATECONTROLLER PHP'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupère les certificats de l'utilisateur
        $certificates = $userCertificateRepository->findCertificatesByUserId($user->getId());

        // if (!$certificates) {
        //     return new JsonResponse(['error' => 'EROORORORORO']);
        // }
        // Renvoie la réponse au format JSON
        return $this->json($certificates);
    }
}
