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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->string('name');
            $table->string('slug');
            $table->string('email')->nullable();
            $table->unique(['user_id', 'email'], 'user_email_unique');
            $table->string('phone')->nullable();
            $table->string('domain')->unique();
            $table->unique(['city_id', 'domain'], 'city_domain_unique');
            $table->string('description')->nullable();
            $table->text('content')->nullable();
            $table->string('latitude');
            $table->string('longitude');
            $table->boolean('status')->default(true);
            $table->boolean('is_default')->default(false);

            // View count for the store
            $table->bigInteger('view_count')->default(0);

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
