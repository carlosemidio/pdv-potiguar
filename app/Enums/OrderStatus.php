<?php

namespace App\Enums;

enum OrderStatus: string {
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case IN_PROGRESS = 'in_progress';
    case REJECTED = 'rejected';
    case PAID = 'paid';
    case SHIPPED = 'shipped';
    case COMPLETED = 'completed';
    case CANCELED = 'canceled';
}
