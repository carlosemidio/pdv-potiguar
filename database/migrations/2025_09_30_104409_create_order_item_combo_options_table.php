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
        Schema::create('order_item_combo_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id');
            $table->foreign('order_item_id', 'order_item_id_combo_option_fk')
                ->references('id')->on('order_items')->onDelete('cascade');
            $table->foreignId('combo_option_item_id');
            $table->foreign('combo_option_item_id', 'combo_option_item_id_order_item_fk')
                ->references('id')->on('combo_option_items')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->unique(['order_item_id', 'combo_option_item_id'], 'order_item_combo_opt_unique');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item_combo_options');
    }
};
