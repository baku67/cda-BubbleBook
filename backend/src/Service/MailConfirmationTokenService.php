<?php

namespace App\Service;

class MailConfirmationTokenService
{
    public function generateToken(): string
    {
        return bin2hex(random_bytes(32));
    }
}