<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\MailConfirmationTokenService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
// use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface; // déprécié pour UserPasswordHasher
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Service\MailerService;

class RegisterController extends AbstractController
{
    public function __construct(
        private MailerService $mailService, 
        private MailConfirmationTokenService $mailConfirmationTokenService,
        private EntityManagerInterface $entityManager, 
        private UserPasswordHasherInterface $passwordHasher, 
        private UserRepository $userRepository,
    )
    {}


    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (empty($data['email']) || empty($data['password']) || empty($data['username'])) {
            return new JsonResponse(['error' => 'Invalid data provided'], 400);
        }

        // Vérifier si l'utilisateur existe déjà avec cet email
        if ($this->userRepository->findOneBy(['email' => $data['email']])) {
            return new JsonResponse(['error' => 'Email already in use'], 400);
        }

        // Création de l'utilisateur & initialisations (Default Values SQL ?)
        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setUsername($data['username']);
        // Définir les rôles 
        $user->setRoles(['ROLE_USER']); // Rôle par défaut
        // Envoyés/Initialisés à false:
        $user->set2fa($data['is2fa'] ?? false);
        $user->setVerified(false);

        // Envoi et persistence BDD d'un token de confirmation d'email (avec expiration):
        $this->mailConfirmationTokenService->generateUserMailConfirmToken($data['email'], $user);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'User created'], 201);
    }


    #[Route('/api/check-email-exist', name: 'check_email_exist', methods: ['POST'])]
    public function checkEmailExist(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];

        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user) {
            return new JsonResponse(['exists' => true], 200);
        }

        return new JsonResponse(['exists' => false], 200);
    }


    // Click sur le lien de Confirmation de mail:
    #[Route('/api/confirm-email', name: 'api_confirm_email', methods: ['GET'])]
    public function confirmEmail(Request $request): JsonResponse
    {
        $token = $request->query->get('token');

        // Vérifier si le token est valide
        $user = $this->userRepository->findOneBy(['confirmationToken' => $token]);

        if (!$user) {
            return new JsonResponse(['error' => 'Invalid token'], 400);
        }

        // Mettre à jour l'utilisateur comme vérifié
        $user->setVerified(true);
        $user->setConfirmationToken(null); // Supprime le token, car il n'est plus nécessaire

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Email successfully verified'], 200);
    }


    // Renvoi d'un lien de confirmation de mail:
    #[Route('/api/resend-confirmation', name: 'resend_confirmation', methods: ['POST'])]
    public function resendConfirmationEmail(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
    
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
    
        if (!$user || $user->getEmail() !== $email) {
            return new JsonResponse(['error' => 'Unauthorized'], 403);
        }

        if ($user->isVerified()) {
            return new JsonResponse(['error' => 'This account is already verified'], 400);
        }

        // Générer un nouveau token avec le service
        $this->mailConfirmationTokenService->generateUserMailConfirmToken($data['email'], $user);

        // Mettre à jour l'utilisateur
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Confirmation email sent'], 200);
    }
}
