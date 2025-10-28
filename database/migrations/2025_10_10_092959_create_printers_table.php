<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('printers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_id')->constrained()->onDelete('cascade');

            $table->string('name');           // Nome dado pelo lojista: cozinha, balcão, etc.
            $table->string('product_name');   // Nome do modelo da impressora
            $table->string('type', 32);        // Tipo de conexão: usb, network, etc.

            // USB fields
            $table->string('vendor_id', 20)->nullable();
            $table->string('product_id', 20)->nullable();
            $table->string('device_path', 32)->nullable();

            // Network fields
            $table->string('host', 100)->nullable(); // IP ou hostname
            $table->smallInteger('port')->nullable()->default(9100);
            
            // Índices únicos por tipo
            $table->unique(
                ['store_id', 'vendor_id', 'product_id', 'device_path'],
                'unique_usb_per_store'
            );
            
            $table->unique(
                ['store_id', 'host', 'port'],
                'unique_network_per_store'
            );
            
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('printers');
    }
};
