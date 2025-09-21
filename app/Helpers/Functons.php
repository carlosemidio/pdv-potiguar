<?php

use App\Services\UnitService;

if (!function_exists('unit_convert')) {
    /**
     * Helper para converter unidades facilmente
     *
     * @param float $value
     * @param string $from
     * @param string $to
     * @return float
     */
    function unit_convert(float $value, string $from, string $to): float
    {
        return UnitService::convert($value, $from, $to);
    }
}
