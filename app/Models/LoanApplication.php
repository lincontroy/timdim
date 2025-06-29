<?php

namespace App\Models;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LoanApplication extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    } 


    public function guarantors()
{
    return $this->belongsToMany(Customer::class, 'guarantor_loan');
}
}
