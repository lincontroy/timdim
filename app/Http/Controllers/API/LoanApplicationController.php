<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LoanApplication;
use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\Request;

class LoanApplicationController extends Controller
{
    public function index()
    {
        return LoanApplication::with('customer')->latest()->get();
    }

    public function store(Request $request)
    {
        // dd($request);
        $validated = $request->validate([
            'user_id' => 'required',
            'amount' => 'required|numeric|min:1',
            'status' => 'nullable|string',
            'reason' => 'nullable|string',
        ]);

        return LoanApplication::create([
            'customer_id' => $request->user_id,
            'amount' => $request->amount,
            'duration' => $request->duration,
            'status' => 'pending',
            'reason' => $request->reason,
        ]);
    }

    public function show($id)
    {
        return LoanApplication::with('user')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $loan = LoanApplication::findOrFail($id);
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:1',
            'status' => 'nullable|string',
            'reason' => 'nullable|string',
        ]);

        $loan->update($validated);
        return $loan;
    }

    public function destroy($id)
    {
        LoanApplication::findOrFail($id)->delete();
        return response()->json(['message' => 'Loan application deleted']);
    }

    public function approve($id)
{
    $loan = LoanApplication::findOrFail($id);
    $loan->status = 'approved';
    $loan->approvedOn = now()->toDateString(); 
    $loan->save();

    return response()->json(['message' => 'Loan approved']);
}

public function reject(Request $request, $id)
{
    $loan = LoanApplication::findOrFail($id);
    $loan->status = 'rejected';
    $loan->rejection_reason = $request->input('reason');
    $loan->save();

    return response()->json(['message' => 'Loan rejected']);
}

}
