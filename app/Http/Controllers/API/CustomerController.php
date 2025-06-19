<?php

namespace App\Http\Controllers\API;

use App\Models\Customer;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Customer::latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {

        $validated = $request->validate([
            'name' => 'required',
            'email' => 'nullable|email',
            'phone' => 'required',
            'id_number' => 'required',
        ]);
        
        // Set default email if not provided
        $validated['email'] = $validated['email'] ?? 'null_' . uniqid() . '@mail.com';
    
        return Customer::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        return Customer::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id) {
        $customer = Customer::findOrFail($id);
        $customer->update($request->all());
        return $customer;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {
        Customer::destroy($id);
        return response()->noContent();
    }
}
