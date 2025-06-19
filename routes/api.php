<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('customers', App\Http\Controllers\API\CustomerController::class);
Route::apiResource('loan-applications', App\Http\Controllers\API\LoanApplicationController::class);

