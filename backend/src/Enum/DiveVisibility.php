<?php

namespace App\Enum;

enum DiveVisibility: string
{
    case BAD = 'bad';
    case AVERAGE = 'average';
    case GOOD = 'good';
    case CRYSTAL = 'crystal clear';
}