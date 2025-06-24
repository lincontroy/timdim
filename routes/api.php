<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Carbon;
use App\Models\Customer;
use App\Models\LoanApplication;
use App\Models\LoanRepayment;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::apiResource('customers', App\Http\Controllers\API\CustomerController::class);
Route::apiResource('loan-applications', App\Http\Controllers\API\LoanApplicationController::class);
Route::apiResource('loan-repayments', App\Http\Controllers\API\LoanRepaymentController::class);
Route::get('/repayment-summary', function () {
    $today = Carbon::today();
    $startOfWeek = $today->copy()->startOfWeek(); // Monday
    $startOfMonth = $today->copy()->startOfMonth();

    $weekTotal = LoanRepayment::whereDate('date', '>=', $startOfWeek)->sum('amount');
    $monthTotal = LoanRepayment::whereDate('date', '>=', $startOfMonth)->sum('amount');

    return response()->json([
        'week' => $weekTotal,
        'month' => $monthTotal,
    ]);
});
Route::post('/loan-applications/{id}/approve', [App\Http\Controllers\API\LoanApplicationController::class, 'approve']);
Route::post('/loan-applications/{id}/reject', [App\Http\Controllers\API\LoanApplicationController::class, 'reject']);

Route::get('/customer-count', function () {
    $count = Customer::count();
    return response()->json(['count' => $count]);
});

Route::get('/loan-pending-total', function () {
    $pendingTotal = LoanApplication::where('status', 'pending')->sum('amount');
    return response()->json(['pending' => $pendingTotal]);
});



Route::get('/loan-trends', function () {
    $disbursed = LoanApplication::selectRaw("strftime('%Y-%m', approvedOn) as month, SUM(amount) as total")
        ->where('status', 'approved')
        ->whereNotNull('approvedOn')
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    $repayments = LoanRepayment::selectRaw("strftime('%Y-%m', date) as month, SUM(amount) as total")
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    return response()->json([
        'disbursed' => $disbursed,
        'repaid' => $repayments,
    ]);
});


Route::get('/loan-disbursement-summary', function () {
    $today = Carbon::today();
    $startOfWeek = $today->copy()->startOfWeek();
    $startOfMonth = $today->copy()->startOfMonth();

    $weekTotal = LoanApplication::where('status', 'approved')
        ->whereDate('approvedOn', '>=', $startOfWeek)
        ->sum('amount');

    $monthTotal = LoanApplication::where('status', 'approved')
        ->whereDate('approvedOn', '>=', $startOfMonth)
        ->sum('amount');

    return response()->json([
        'week' => $weekTotal,
        'month' => $monthTotal,
    ]);
});
