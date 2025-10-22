<?php

namespace App\Enums;

enum CashMovementType: string
{
    case OPENING = 'opening';
    case CLOSING = 'closing';
    case SALE = 'sale';
    case REFUND = 'refund';
    case ADDITION = 'addition';
    case REMOVAL = 'removal';

    public function label(): string
    {
        return match ($this) {
            self::OPENING => 'Abertura',
            self::CLOSING => 'Fechamento',
            self::SALE => 'Venda',
            self::REFUND => 'Reembolso',
            self::ADDITION => 'Adição',
            self::REMOVAL => 'Remoção',
        };
    }
}
