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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('brand_id')->constrained('brands')->onDelete('cascade');

            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->integer('stock_quantity')->default(0);
            $table->boolean('status')->default(true);
            $table->boolean('featured')->default(false);

            $table->unique(['name', 'store_id']);
            $table->unique(['slug', 'store_id']);

            $table->bigInteger('view_count')->default(0);

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
