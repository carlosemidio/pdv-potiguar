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
        Schema::create('cash_registers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->foreignId('closed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('opening_amount', 15, 2);
            $table->decimal('closing_amount', 15, 2)->nullable();
            $table->decimal('system_balance', 15, 2)->nullable();
            $table->decimal('difference', 15, 2)->nullable();
            $table->boolean('status')->default(true)->comment('true = open, false = closed');
            $table->timestamp('opened_at')->useCurrent();
            $table->timestamp('closed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_registers');
    }
};
