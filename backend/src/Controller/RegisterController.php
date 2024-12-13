<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use App\Service\MailConfirmationTokenService;
use App\Service\UsernameService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
// use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface; // déprécié pour UserPasswordHasher
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Service\MailerService;

class RegisterController extends AbstractController
{
    public function __construct(
        private MailerService $mailService,
        private MailConfirmationTokenService $mailConfirmationTokenService,
        private UsernameService $usernameService,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository,
        private RoleRepository $roleRepository,
    ) {
        
    }


    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse([
                'message' => 'L\'email fourni n\'est pas valide.'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        if (strlen($data['password']) < 6) {
            return new JsonResponse([
                'message' => 'Le mot de passe doit contenir au moins 6 caractères.'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        // Validation des données
        if (empty($data['email']) || empty($data['password'])) {
            return new JsonResponse([
                'message' => 'Erreur lors de la création du compte. Les données envoyés sont invalides.'
            ], Response::HTTP_BAD_REQUEST); // 400
        }

        // Vérifier si l'utilisateur existe déjà avec cet email
        if ($this->userRepository->findOneBy(['email' => $data['email']])) {
            return new JsonResponse([
                'message' => 'Erreur lors de la création du compte. L\'email est déjà utilisé.'
            ], Response::HTTP_BAD_REQUEST); // 400
        }

        // Récupération du rôle 'ROLE_USER' depuis la table des rôles
        $defaultRole = $this->roleRepository->findOneBy(['name' => 'ROLE_USER']);
        if (!$defaultRole) {
            return new JsonResponse([
                'message' => 'Erreur interne : le rôle par défaut n\'existe pas.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Création de l'utilisateur & initialisations 
        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        // Initialisé avec un random "diver#432324"
        // ** Génération du pseudonyme unique **
        // **Appel au service pour générer le pseudonyme**
        try {
            $username = $this->usernameService->generateUniqueUsername();
            $user->setUsername($username);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur lors de la génération du pseudonyme.'], 500);
        }        
        // Définir les rôles 
        $user->addRole($defaultRole); // Rôle par défaut
        // Envoyés/Initialisés à false:
        $user->set2fa($data['is2fa'] ?? false);
        $user->setVerified(false);
        // Type de compte ("option-club" ou "option-diver")
        $user->setAccountType("option-diver"); // "option-diver" / "option-club" (TODO enum)

        // Envoi et persistence BDD d'un token de confirmation d'email (avec expiration):
        try {
            $this->mailConfirmationTokenService->generateUserMailConfirmToken($data['email'], $user);
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'Erreur lors de l\'envoi du mail de confirmation. Veuillez réessayer plus tard.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'Erreur lors de l\'inscription. Veuillez réessayer plus tard.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'message' => 'Votre compte a bien été créé.'
        ], Response::HTTP_CREATED); // 201
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
        $user = $this->userRepository->findOneBy(['confirmationToken' => $token]);

        if (!$user) {
            return new JsonResponse(['error' => 'Invalid token'], 400);
        }

        // Vérifier si le token est expiré
        if ($user->getConfirmationTokenExpiry() < new \DateTime()) {
            return new JsonResponse(['error' => 'Token expired'], 400);
        }

        // Màj User: email confirmé
        $user->setVerified(true);
        $user->setConfirmationToken(null); 
        $user->setConfirmationTokenExpiry(null); 

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Email successfully verified'], 200);
    }


    // Renvoi d'un lien de confirmation de mail (TODO logged in ?):
    #[Route('/api/resend-confirmation', name: 'resend_confirmation', methods: ['POST'])]
    public function resendConfirmationEmail(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
    
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
    
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
