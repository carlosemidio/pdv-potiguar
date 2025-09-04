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
        Schema::create('views', function (Blueprint $table) {
            $table->id();
            $table->morphs('viewable'); // Polymorphic relation for different viewable models
            $table->timestamp('viewed_at')->useCurrent();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->softDeletes(); // Soft delete support
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('views');
    }
};
