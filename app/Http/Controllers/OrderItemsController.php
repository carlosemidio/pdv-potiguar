<?php

namespace App\Http\Controllers;

use App\Models\Addon;
use App\Models\Order;
use App\Models\OrderItem;
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
                'product_id' => 'required|exists:products,id',
                'product_variant_id' => [
                    'nullable',
                    'exists:product_variants,id',
                    function ($attribute, $value, $fail) use ($request) {
                        if ($value) {
                            $variant = \App\Models\ProductVariant::find($value);
                            if (!$variant || $variant->product_id != $request->input('product_id')) {
                                $fail('A variante selecionada não pertence ao produto informado.');
                            }
                        }
                    },
                ],
                'quantity' => 'required|integer|min:1',
                'unit_price' => 'required|numeric|min:0',
            ]);

            $data = $request->only(['order_id', 'product_id', 'product_variant_id', 'quantity', 'unit_price', 'addons']);

            $orderItem = DB::transaction(function () use ($data) {
                $order = $this->order->findOrFail($data['order_id']);

                $data['product_variant_id'] = intval($data['product_variant_id'] ?? 0) > 0 ? intval($data['product_variant_id']) : null;

                $orderItem = $order->items()->create([
                    'product_id' => $data['product_id'],
                    'product_variant_id' => (isset($data['product_variant_id']) && $data['product_variant_id'] > 0) ? $data['product_variant_id'] : null,
                    'quantity' => $data['quantity'],
                    'unit_price' => $data['unit_price'],
                    'total_price' => ($data['unit_price'] * $data['quantity']),
                ]);

                if (!empty($data['addons'])) {
                    $addonsTotal = 0;

                    foreach ($data['addons'] as $addon) {
                        $orderItem->itemAddons()->create([
                            'addon_id' => $addon['addon_id'] ?? null,
                            'quantity' => $addon['quantity'] ?? 1, // Default to 1 if not specified
                            'unit_price' => $addon['unit_price'] ?? 0,
                            'total_price' => (($addon['unit_price'] ?? 0) * ($addon['quantity'] ?? 1)),
                        ]);

                        $addonsTotal += (($addon['unit_price'] ?? 0) * ($addon['quantity'] ?? 1));
                    }

                    // Update order item total price to include addons
                    $orderItem->total_price += $addonsTotal;
                    $orderItem->save();
                }

                // Recalculate order totals
                $order->load('items.itemAddons');
                $order->total_amount = $order->items->sum('total_price');

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
            if (!$orderItem->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover item do pedido.');
            }

            // Recalculate order totals
            $order = $orderItem->order;
            $order->load('items.itemAddons');
            $order->total_amount = $order->items->sum(function ($item) {
                $itemTotal = $item->total_price;
                $addonsTotal = $item->itemAddons->sum('total_price');
                return $itemTotal + $addonsTotal;
            });

            $order->save();

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Item removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover item do pedido: ' . $e->getMessage());
        }
    }
}
