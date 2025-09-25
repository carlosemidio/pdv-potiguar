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
        Schema::create('addon_group_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('addon_group_id');
            $table->foreign('addon_group_id', 'fk_addon_group_options_addon_group_id')
                ->references('id')
                ->on('variant_addon_groups')
                ->onDelete('cascade');
            $table->foreignId('addon_id')->constrained()->onDelete('cascade');
            $table->decimal('additional_price', 10, 2)->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addon_group_options');
    }
};
