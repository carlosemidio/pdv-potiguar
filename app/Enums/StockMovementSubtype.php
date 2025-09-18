<?php

namespace App\Enums;

enum StockMovementSubtype: string
{
    // Entradas
    case PURCHASE = 'purchase';
    case RETURN_CUSTOMER = 'return_customer';
    case ADJUSTMENT_IN = 'adjustment_in';
    case TRANSFER_IN = 'transfer_in';

    // Saídas
    case SALE = 'sale';
    case WASTE = 'waste';
    case RETURN_SUPPLIER = 'return_supplier';
    case ADJUSTMENT_OUT = 'adjustment_out';
    case TRANSFER_OUT = 'transfer_out';
}
