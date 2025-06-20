<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\LoanRepayment;
use App\Http\Controllers\Controller;

class LoanRepaymentController extends Controller
{
    //
    public function index()
    {
        return LoanRepayment::with('loan_applications.customer')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loan_applications,id',
            'amount' => 'required|numeric|min:1',
            'method' => 'required|string|max:100',
            'date' => 'required|date',
            'reference' => 'nullable|string|max:255',
        ]);

        $repayment = LoanRepayment::create($request->all());

        return response()->json(['message' => 'Repayment recorded', 'data' => $repayment]);
    }

    public function update(Request $request, LoanRepayment $loanRepayment)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'method' => 'required|string|max:100',
            'date' => 'required|date',
            'reference' => 'nullable|string|max:255',
        ]);

        $loanRepayment->update($request->all());

        return response()->json(['message' => 'Repayment updated', 'data' => $loanRepayment]);
    }

    public function destroy(LoanRepayment $loanRepayment)
    {
        $loanRepayment->delete();
        return response()->json(['message' => 'Repayment deleted']);
    }


}
