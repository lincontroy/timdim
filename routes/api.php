<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('customers', App\Http\Controllers\API\CustomerController::class);
Route::apiResource('loan-applications', App\Http\Controllers\API\LoanApplicationController::class);
Route::apiResource('loan-repayments', App\Http\Controllers\API\LoanRepaymentController::class);


// web.php or api.php
Route::post('/loan-applications/{id}/approve', [App\Http\Controllers\API\LoanApplicationController::class, 'approve']);
Route::post('/loan-applications/{id}/reject', [App\Http\Controllers\API\LoanApplicationController::class, 'reject']);


