<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanRepayment extends Model
{
    //
    protected $guarded= [];

    public function loan_applications()
    {
        return $this->belongsTo(LoanApplication::class);
    }
}
