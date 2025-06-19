<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LoanApplication;
use App\Models\User;
use Illuminate\Http\Request;

class LoanApplicationController extends Controller
{
    public function index()
    {
        return LoanApplication::with('user')->latest()->get();
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

        return LoanApplication::create($validated);
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
}
