<?php

namespace App\Enum;

enum DiveOxygenMode: string
{
    case AIR = 'air';
    case NITROX = 'nitrox';
    case MIX = 'mix'; // mélange
}