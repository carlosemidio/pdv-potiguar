<?php

namespace App\Console\Commands;

use App\Events\PrintOrderItems;
use App\Models\Order;
use App\Models\Printer;
use Illuminate\Console\Command;

class TestPrintOrderItemsEvent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:print-order-items';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Testa o evento PrintOrderItems';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Enviando evento PrintOrderItems...');

        // Buscar um pedido com itens
        $order = Order::with('items')->whereHas('items')->first();
        
        if (!$order) {
            $this->error('Nenhum pedido com itens encontrado!');
            return;
        }

        // Buscar uma impressora
        $printer = Printer::first();
        
        if (!$printer) {
            $this->error('Nenhuma impressora encontrada!');
            return;
        }

        // Pegar os IDs dos itens do pedido
        $orderItemsIds = $order->items->pluck('id')->toArray();

        $this->info("Pedido: {$order->id}");
        $this->info("Itens: " . implode(', ', $orderItemsIds));
        $this->info("Impressora: {$printer->name}");

        // Disparar o evento
        event(new PrintOrderItems($order->number, $orderItemsIds, $printer));

        $this->info('✅ Evento PrintOrderItems enviado com sucesso!');
        $this->info('📺 Verifique os logs em storage/logs/laravel.log');
        $this->info('🎯 Monitore o canal: print-orders no frontend');
        $this->info('📻 Nome do evento: print.order.items');
    }
}