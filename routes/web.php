<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('customers', function () {
        return Inertia::render('customers');
    })->name('customers');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('loanApplications', function () {
        return Inertia::render('loanApplications');
    })->name('loanApplications');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
