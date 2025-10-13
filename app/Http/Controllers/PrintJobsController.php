<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Printer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PrintJobsController extends Controller
{
    protected $printer;

    public function __construct(Printer $printer)
    {
        $this->printer = $printer;
    }

    public function printOrder($orderId, $printerId)
    {
        try {
            $order = Order::findOrFail($orderId);
            $this->authorize('update', $order);

            $user = User::find(Auth::id());

            if ($user->store_id === null) {
                return redirect(route('dashboard'))
                    ->with('fail', 'Usuário não está associado a nenhuma loja. Por favor, crie uma loja primeiro.');
            }

            $printer = Printer::find($printerId);

            if (!$printer) {
                return redirect()->back()->with('fail', 'Impressora não encontrada.');
            }

            if ($printer->store_id !== $user->store_id) {
                return redirect()->back()->with('fail', 'Impressora não pertence à loja do usuário.');
            }

            $order->load(['store',
                'table',
                'customer',
                'payments',
                'items.storeProductVariant.productVariant',
                'items.orderItemOptions.addonGroupOption.addonGroup',
                'items.orderItemOptions.addonGroupOption.addon',
                'items.orderItemAddons.variantAddon.addon',
                'items.storeProductVariant.comboItems.itemVariant.productVariant',
                'items.comboOptionItems.comboOptionItem.storeProductVariant.productVariant'
            ]);

            // Disparar evento para imprimir a ordem
            Log::info('Disparando evento PrintOrder', [
                'order_id' => $order->id,
                'printer_id' => $printer->id,
                'printer_name' => $printer->name,
                'broadcast_driver' => config('broadcasting.default')
            ]);
            
            event(new \App\Events\PrintOrder($order, $printer));
            
            Log::info('Evento PrintOrder disparado com sucesso');

            return redirect()->back()->with('success', 'Ordem de impressão enviada para a impressora.');
        } catch (\Exception $e) {
            Log::error('Erro ao processar impressão da ordem', [
                'order_id' => $orderId,
                'printer_id' => $printerId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('fail', 'Erro ao processar impressão: ' . $e->getMessage());
        }
    }

    public function printOrderItems(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|exists:orders,id',
                'order_items_ids' => 'required|array',
                'printer_id' => 'required|exists:printers,id',
            ]);

            $order = Order::find($request->input('order_id'));
            $this->authorize('update', $order);

            $orderItemsIds = $request->input('order_items_ids');
            $printerId = $request->input('printer_id');

            $user = User::find(Auth::id());

            if ($user->store_id === null) {
                return redirect(route('dashboard'))
                    ->with('fail', 'Usuário não está associado a nenhuma loja. Por favor, crie uma loja primeiro.');
            }

            $printer = Printer::find($printerId);

            if (!$printer) {
                return redirect()->back()->with('fail', 'Impressora não encontrada.');
            }

            if ($printer->store_id !== $user->store_id) {
                return redirect()->back()->with('fail', 'Impressora não pertence à loja do usuário.');
            }

            // Disparar evento para imprimir os itens da ordem
            Log::info('Disparando evento PrintOrderItems', [
                'order_items_ids' => $orderItemsIds,
                'printer_id' => $printer->id,
                'printer_name' => $printer->name,
                'broadcast_driver' => config('broadcasting.default')
            ]);

            event(new \App\Events\PrintOrderItems($order->number, $orderItemsIds, $printer));

            Log::info('Evento PrintOrderItems disparado com sucesso');
            
            return redirect()->back()->with('success', 'Itens de impressão enviados para a impressora.');
        } catch (\Exception $e) {
            Log::error('Erro ao processar impressão de itens da ordem', [
                'order_id' => $request->input('order_id'),
                'printer_id' => $request->input('printer_id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('fail', 'Erro ao processar impressão: ' . $e->getMessage());
        }
    }
}
