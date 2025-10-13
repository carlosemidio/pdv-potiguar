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
        Schema::create('variant_addon_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sp_variant_id');
            $table->foreign('sp_variant_id', 'fk_variant_addon_groups_sp_variant_id')
                ->references('id')
                ->on('store_product_variants')
                ->onDelete('cascade');
            $table->string('name');
            $table->boolean('is_required')->default(false);
            $table->integer('min_options')->default(0);
            $table->integer('max_options')->default(0);
            $table->unique(['sp_variant_id', 'name']);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_addon_groups');
    }
};
