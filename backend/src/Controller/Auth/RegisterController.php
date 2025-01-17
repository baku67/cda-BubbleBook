<?php
namespace App\Controller\Auth;

use App\Entity\User\User;
use App\Repository\User\RoleRepository;
use App\Repository\User\UserRepository;
use App\Service\Auth\EmailCheckExistService;
use App\Service\Auth\EmailConfirmationService;
use App\Service\Auth\RegistrationService;
use App\Service\Auth\ResendConfirmationService;
use App\Service\Auth\MailConfirmationTokenService;
use App\Service\Auth\UsernameService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Service\Auth\MailerService;

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
    ) {}


    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, RegistrationService $registrationService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        try {
            $result = $registrationService->registerUser($data);
            return new JsonResponse($result, Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    #[Route('/api/check-email-exist', name: 'check_email_exist', methods: ['POST'])]
    public function checkEmailExist(Request $request, EmailCheckExistService $emailCheckExistService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
    
        if (!$email) {
            return new JsonResponse(['error' => 'Email is required.'], Response::HTTP_BAD_REQUEST);
        }
    
        $exists = $emailCheckExistService->isEmailExists($email);
    
        return new JsonResponse(['exists' => $exists], Response::HTTP_OK);
    }


    // Click sur le lien de Confirmation de mail:
    #[Route('/api/confirm-email', name: 'api_confirm_email', methods: ['GET'])]
    public function confirmEmail(Request $request, EmailConfirmationService $emailConfirmationService): JsonResponse
    {
        $token = $request->query->get('token');
    
        try {
            $emailConfirmationService->confirmEmail($token);
            return new JsonResponse(['status' => 'Email successfully verified'], Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    

    // Renvoi d'un lien de confirmation de mail (TODO logged in ?):
    #[Route('/api/resend-confirmation', name: 'resend_confirmation', methods: ['POST'])]
    public function resendConfirmationEmail(Request $request, ResendConfirmationService $resendConfirmationService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
    
        $user = $this->getUser();
        if (!$user instanceof User || $user->getEmail() !== $email) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }
    
        try {
            $resendConfirmationService->resend($user);
            return new JsonResponse(['status' => 'Confirmation email sent'], Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
