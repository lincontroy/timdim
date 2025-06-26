<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loan_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->decimal('duration', 15, 2);
            $table->decimal('interest_rate', 5, 2)->default(10.00); // in percentage e.g., 10%
            $table->decimal('total_to_pay', 15, 2)->nullable();
            $table->decimal('total_paid', 15, 2)->default(0.00);
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->date('approvedOn')->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_applications');
    }
};
