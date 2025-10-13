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
        Schema::create('combo_option_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sp_variant_id');
            $table->foreign('sp_variant_id', 'fk_combo_option_groups_sp_variants')
                ->references('id')->on('store_product_variants')->onDelete('cascade');
            $table->string('name');
            $table->integer('min_options')->default(0);
            $table->integer('max_options')->default(0);
            $table->boolean('is_required')->default(false);
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
        Schema::dropIfExists('combo_option_groups');
    }
};
