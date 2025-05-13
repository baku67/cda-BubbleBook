<?php

namespace App\Enum;

enum FriendshipStatus: string
{
    case PENDING = 'PENDING';
    case ACCEPTED = 'ACCEPTED';
    case REFUSED = 'REFUSED';
}