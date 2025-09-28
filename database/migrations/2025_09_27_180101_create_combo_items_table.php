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
        Schema::create('combo_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sp_variant_id');
            $table->foreign('sp_variant_id', 'fk_combo_items_sp_variants')
                ->references('id')->on('store_product_variants')->onDelete('cascade');
            $table->foreignId('item_variant_id');
            $table->foreign('item_variant_id', 'fk_combo_items_item_variants')
                ->references('id')->on('store_product_variants')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('combo_items');
    }
};
