<?php

namespace App\Console\Commands;

use App\Events\PrintOrder;
use App\Models\Order;
use App\Models\Printer;
use Illuminate\Console\Command;

class TestPrintOrderEvent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:print-order {order_id?} {printer_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test PrintOrder event broadcasting';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orderId = $this->argument('order_id') ?? Order::first()?->id;
        $printerId = $this->argument('printer_id') ?? Printer::first()?->id;

        if (!$orderId) {
            $this->error('Nenhum pedido encontrado. Crie um pedido primeiro.');
            return 1;
        }

        if (!$printerId) {
            $this->error('Nenhuma impressora encontrada. Crie uma impressora primeiro.');
            return 1;
        }

        $order = Order::find($orderId);
        $printer = Printer::find($printerId);

        if (!$order) {
            $this->error("Pedido {$orderId} não encontrado.");
            return 1;
        }

        if (!$printer) {
            $this->error("Impressora {$printerId} não encontrada.");
            return 1;
        }

        $this->info("Enviando evento PrintOrder...");
        $this->info("Pedido: {$order->id}");
        $this->info("Impressora: {$printer->name}");

        // Disparar o evento
        event(new PrintOrder($order, $printer));

        $this->info('✅ Evento PrintOrder enviado com sucesso!');
        $this->info('📺 Verifique os logs em storage/logs/laravel.log');
        $this->info('🎯 Monitore o canal: print-orders no frontend');

        return 0;
    }
}