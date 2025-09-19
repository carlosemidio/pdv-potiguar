<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderDiscountController extends Controller
{
    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function applyDiscount(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'discount_type' => 'required|integer|in:0,1',
            'discount_value' => 'required|numeric|min:0',
        ]);

        $data = $request->only(['order_id', 'discount_type', 'discount_value']);
        $order = $this->order->findOrFail($data['order_id']);

        $this->authorize('update', $order);

        try {
            $updated = DB::transaction(function () use ($data, $order) {
                $order->discount_type = $data['discount_type'];
                $order->discount_value = $data['discount_value'];
                $discount = $data['discount_type'] == 1
                    ? (($order->amount * $data['discount_value']) / 100)
                    : $data['discount_value'];

                $order->total_amount = max(0, $order->amount - $discount);
                $order->discount = $discount;
                return $order->save();
            });

            if ($updated) {
                return redirect()->back()
                    ->with('success', 'Desconto aplicado com sucesso ao pedido.');
            } else {
                return redirect()->back()
                    ->with('fail', 'Não foi possível aplicar o desconto ao pedido.');
            }
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao aplicar desconto ao pedido: ' . $e->getMessage());
        }
    }
}
