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
        Schema::create('variant_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sp_variant_id');
            $table->foreign('sp_variant_id', 'fk_variant_ingredients_sp_variant_id')
                ->references('id')
                ->on('store_product_variants')
                ->onDelete('cascade');
            $table->foreignId('ingredient_id')->constrained()->onDelete('cascade');
            $table->foreignId('unit_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('quantity', 10, 2);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_ingredient');
    }
};
