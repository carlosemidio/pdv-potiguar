<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Addon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StoreProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderItemsController extends Controller
{
    protected $order;
    protected $orderItem;

    public function __construct(Order $order, OrderItem $orderItem)
    {
        $this->order = $order;
        $this->orderItem = $orderItem;
    }

    public function store(Request $request)
    {
        $this->authorize('create', Order::class);

        try {
            $request->validate([
                'order_id' => 'required|exists:orders,id',
                'store_product_variant_id' => 'nullable|exists:store_product_variants,id',
                'quantity' => 'required|integer|min:1',
                'unit_price' => 'required|numeric|min:0',
            ]);

            $data = $request->only(['order_id', 'store_product_variant_id', 'quantity', 'addons']);
            $order = $this->order->findOrFail($data['order_id']);
            $this->authorize('update', $order);

            if ($order->status != OrderStatus::IN_PROGRESS->value) {
                return redirect()->back()
                    ->with('fail', 'Não é possível adicionar itens a um pedido que não esteja em andamento.');
            }

            $orderItem = DB::transaction(function () use ($data, $order) {
                $storeProductVariant = null;
                if (isset($data['store_product_variant_id']) && $data['store_product_variant_id'] > 0) {
                    $storeProductVariant = StoreProductVariant::find($data['store_product_variant_id']);
                 
                    if (!$storeProductVariant) {
                        throw new \Exception('Variante de produto não encontrada.');
                    }
                }

                $orderItem = $order->items()->create([
                    'store_product_variant_id' => $data['store_product_variant_id'] ?? null,
                    'quantity' => $data['quantity'],
                    'unit_price' => $storeProductVariant->price,
                    'total_price' => ($storeProductVariant->price * $data['quantity']),
                ]);

                if (!empty($data['addons'])) {
                    $addonsTotal = 0;

                    foreach ($data['addons'] as $addonData) {
                        if (!isset($addonData['addon_id'])) {
                            continue;
                        }

                        $addon = Addon::find($addonData['addon_id']);

                        if (!$addon) {
                            continue;
                        }

                        $orderItem->itemAddons()->create([
                            'addon_id' => $addon->id,
                            'quantity' => $addonData['quantity'] ?? 1, // Default to 1 if not specified
                            'unit_price' => $addon->price,
                            'total_price' => ($addon->price * ($addonData['quantity'] ?? 1)),
                        ]);

                        $addonsTotal += ($addon->price * ($addonData['quantity'] ?? 1));
                    }

                    // Update order item total price to include addons
                    $orderItem->total_price += $addonsTotal;
                    $orderItem->save();
                }

                // Recalculate order totals
                $order->load('items.itemAddons');
                $order->amount = $order->items->sum('total_price');
                $order->total_amount = (($order->amount + $order->service_fee) - $order->discount);
                $order->save();

                return $orderItem;
            });

            if (!$orderItem) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar item ao pedido.');
            }

            return redirect()->route('orders.show', $data['order_id'])
                ->with('success', 'Pedido criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao adicionar item ao pedido: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $orderItem = $this->orderItem->findOrFail($id);
        $this->authorize('update', $orderItem->order);

        try {
            $order = Order::find($orderItem->order_id);

            if ($order->status != OrderStatus::IN_PROGRESS->value) {
                return redirect()->back()
                    ->with('fail', 'Não é possível remover itens de um pedido que não esteja em andamento.');
            }

            if (!in_array($order->status, ['pending', 'in_progress'])) {
                $orderStatuses = [ 'pending' => 'Pendente', 'in_progress' => 'Em andamento', 'completed' => 'Finalizado', 'canceled' => 'Cancelado' ];
                $currentStatus = $orderStatuses[$order->status] ?? $order->status;

                return redirect()->back()
                    ->with('fail', 'Não é possível remover itens de um pedido '. $currentStatus . '.');
            }

            DB::transaction(function () use ($orderItem, $order) {
                // Recalculate order totals
                $orderItem->delete();

                $order->load('items.itemAddons');

                $order->amount = $order->items->sum(function ($item) {
                    $itemTotal = $item->total_price;
                    $addonsTotal = $item->itemAddons->sum('total_price');
                    return $itemTotal + $addonsTotal;
                });

                $order->total_amount = (($order->amount + $order->service_fee) - $order->discount);
                $order->save();
            });            

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Item removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover item do pedido: ' . $e->getMessage());
        }
    }
}
