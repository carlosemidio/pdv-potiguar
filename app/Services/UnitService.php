<?php

namespace App\Services;

use App\Models\Unit;
use App\Models\UnitConversion;
use Exception;

class UnitService
{
    protected static array $units = [];
    protected static array $conversions = [];

    /**
     * Carrega as unidades e conversões em cache (apenas uma vez)
     */
    protected static function boot(): void
    {
        if (empty(self::$units)) {
            self::$units = Unit::all()->keyBy('symbol')->toArray();
        }

        if (empty(self::$conversions)) {
            self::$conversions = UnitConversion::all()->map(function ($c) {
                return [
                    'from'   => $c->from_unit_id,
                    'to'     => $c->to_unit_id,
                    'factor' => $c->factor,
                ];
            })->toArray();
        }
    }

    /**
     * Converte um valor de uma unidade para outra
     */
    public static function convert(float $value, string $fromSymbol, string $toSymbol): float
    {
        self::boot();

        if ($fromSymbol === $toSymbol) {
            return $value; // mesma unidade, não precisa converter
        }

        $fromUnit = self::$units[$fromSymbol] ?? null;
        $toUnit   = self::$units[$toSymbol] ?? null;

        if (!$fromUnit || !$toUnit) {
            throw new Exception("Unidade inválida: {$fromSymbol} ou {$toSymbol}");
        }

        $fromId = $fromUnit['id'];
        $toId   = $toUnit['id'];

        // Conversão direta
        foreach (self::$conversions as $conv) {
            if ($conv['from'] === $fromId && $conv['to'] === $toId) {
                return $value * $conv['factor'];
            }
        }

        // Conversão inversa
        foreach (self::$conversions as $conv) {
            if ($conv['from'] === $toId && $conv['to'] === $fromId) {
                return $value / $conv['factor'];
            }
        }

        throw new Exception("Não existe conversão registrada entre {$fromSymbol} e {$toSymbol}");
    }
}
