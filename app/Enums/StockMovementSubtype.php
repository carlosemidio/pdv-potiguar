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

    public function labelPtBr(): string
    {
        return match($this) {
            // Entradas
            self::PURCHASE => 'Compra',
            self::RETURN_CUSTOMER => 'Devolução de Cliente',
            self::ADJUSTMENT_IN => 'Ajuste de Entrada',
            self::TRANSFER_IN => 'Transferência de Entrada',

            // Saídas
            self::SALE => 'Venda',
            self::WASTE => 'Perda/Desperdício',
            self::RETURN_SUPPLIER => 'Devolução ao Fornecedor',
            self::ADJUSTMENT_OUT => 'Ajuste de Saída',
            self::TRANSFER_OUT => 'Transferência de Saída',
        };
    }
}
