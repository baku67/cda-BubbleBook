<?php

namespace App\Enum;

enum Visibility: string
{
    case BAD = 'bad';
    case AVERAGE = 'average';
    case GOOD = 'good';
    case CRYSTAL = 'crystal clear';
}