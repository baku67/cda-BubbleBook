<?php

namespace App\DTO\Request;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterDTO
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;

    #[Assert\NotBlank]
    #[Assert\Length(min: 6, max: 50)]
    public string $password;

    #[Assert\NotBlank]
    #[Assert\EqualTo(propertyPath: "password", message: "Passwords must match.")]
    public string $passwordCheck;

    #[Assert\NotNull]
    #[Assert\IsTrue(message: "You must accept the terms.")]
    public bool $acceptTerms;

    public function __construct(string $email, string $password, string $passwordCheck, bool $acceptTerms)
    {
        $this->email = $email;
        $this->password = $password;
        $this->passwordCheck = $passwordCheck;
        $this->acceptTerms = $acceptTerms;
    }
}
