<?php

namespace App\Enums;

enum PaymentType: string
{
    case CASH = 'cash';
    case PIX = 'pix';
    case DEBIT_CARD = 'debit_card';
    case CREDIT_CARD = 'credit_card';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::CASH => 'Dinheiro',
            self::PIX => 'Pix',
            self::DEBIT_CARD => 'Cartão de Débito',
            self::CREDIT_CARD => 'Cartão de Crédito',
            self::OTHER => 'Outro',
        };
    }
}
