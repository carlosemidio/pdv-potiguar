<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'zipcode',
        'state',
        'city',
        'neighborhood',
        'street',
        'number',
        'complement',
    ];

    protected $appends = [
        'full_address',
    ];

    public function getFullAddressAttribute()
    {
        return "{$this->street}, {$this->number} - {$this->neighborhood}, {$this->city}/{$this->state}, CEP: " . $this->zipcode;
    }

    public function setZipcodeAttribute($value)
    {
        // Remove any non-numeric characters
        $this->attributes['zipcode'] = preg_replace('/\D/', '', $value);
    }

    public function getZipcodeAttribute($value)
    {
        // Format the zipcode as '12345-678'
        return substr($value, 0, 5) . '-' . substr($value, 5, 3);
    }

    public function addressable()
    {
        return $this->morphTo();
    }
}
