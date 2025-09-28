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
        Schema::create('combo_option_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('option_group_id');
            $table->foreign('option_group_id', 'fk_option_items_option_group_id')
                ->references('id')->on('combo_option_groups')
                ->onDelete('cascade');
            $table->foreignId('sp_variant_id');
            $table->foreign('sp_variant_id', 'fk_option_items_sp_variant_id')
                ->references('id')->on('store_product_variants')
                ->onDelete('cascade');
            $table->decimal('additional_price', 10, 2)->default(0);
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
        Schema::dropIfExists('combo_option_items');
    }
};
