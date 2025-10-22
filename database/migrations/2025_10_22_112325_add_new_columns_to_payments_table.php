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
        Schema::table('payments', function (Blueprint $table) {
            // Caixa em que o pagamento foi lançado
            $table->foreignId('cash_register_id')->after('order_id')
                ->nullable();
            $table->foreign('cash_register_id')->references('id')
                ->on('cash_registers')->onDelete('set null');
            // Valor pago pelo cliente
            $table->decimal('paid_amount', 10, 2)->default(0)->after('amount');
            // Troco dado ao cliente
            $table->decimal('change_amount', 10, 2)->default(0)->after('paid_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['cash_register_id']);
            $table->dropColumn(['cash_register_id', 'paid_amount', 'change_amount']);
        });
    }
};
