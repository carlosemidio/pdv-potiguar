<?php

namespace App\Enums;

enum OrderItemStatus: string {
    case PENDING = 'pending';        // ainda não enviado para produção
    case IN_PROGRESS = 'in_progress'; // em preparo
    case READY = 'ready';            // pronto para retirada/entrega
    case SERVED = 'served';          // entregue ao cliente
    case CANCELED = 'canceled';      // item cancelado
}
