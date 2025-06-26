<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $guarded = [];

    public function guaranteedLoans()
{
    return $this->belongsToMany(LoanApplication::class, 'guarantor_loan');
}
}
