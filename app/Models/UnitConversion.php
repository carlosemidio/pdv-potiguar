<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitConversion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'from_unit_id',
        'to_unit_id',
        'factor',
    ];

    public function from()
    {
        return $this->belongsTo(Unit::class, 'from_unit_id');
    }

    public function to()
    {
        return $this->belongsTo(Unit::class, 'to_unit_id');
    }

    public static function convert($value, Unit $from, Unit $to)
    {
        if ($from->id === $to->id) {
            return $value;
        }

        $conversion = self::where('from_unit_id', $from->id)
            ->where('to_unit_id', $to->id)
            ->first();

        if ($conversion) {
            return $value * $conversion->factor;
        }

        if (!$conversion) {
            throw new \Exception("Conversão de {$from->symbol} para {$to->symbol} não encontrada.");
        }

        return $value / $conversion->factor;
        // ex: 250g -> 250 / 1000 = 0.25kg
    }
}
