<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderPaymentsController extends Controller
{
    protected $order;
    protected $payment;

    public function __construct(Order $order, Payment $payment)
    {
        $this->order = $order;
        $this->payment = $payment;
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:1000',
        ]);

        $data = $request->only(['order_id', 'method', 'amount', 'notes']);
        $order = $this->order->findOrFail($data['order_id']);
        $data['user_id'] = Auth::id();
        $data['tenant_id'] = $order->tenant_id;

        $this->authorize('update', $order);

        try {
            if (in_array($order->status, ['completed', 'canceled'])) {
                $orderStatuses = [ 'pending' => 'Pendente', 'in_progress' => 'Em andamento', 'completed' => 'Finalizado', 'canceled' => 'Cancelado' ];
                $currentStatus = $orderStatuses[$order->status] ?? $order->status;

                return redirect()->back()
                    ->with('fail', 'Não é possível adicionar pagamentos a um pedido '. $currentStatus . '.');
            }

            $payment = DB::transaction(function () use ($data, $order) {
                $payment = $order->payments()->create($data);

                // Update order's paid amount
                $order->paid_amount = Payment::where('order_id', $order->id)->sum('amount');
                
                if ($order->paid_amount >= $order->total_amount) {
                    $order->payment_status = true;
                }

                $order->save();

                return $payment;
            });

            if (!$payment) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar pagamento ao pedido.');
            }

            return redirect()->route('orders.show', $data['order_id'])
                ->with('success', 'Pagamento registrado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao adicionar pagamento ao pedido: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Payment $payment)
    {
        $order = $payment->order;
        $this->authorize('delete', $order);

        try {
            DB::transaction(function () use ($payment, $order) {

                $payment->delete();

                // Update order's paid amount
                $order->paid_amount -= $payment->amount;
                $order->payment_status = $order->paid_amount >= $order->total_amount;
                $order->save();
            });

            return redirect()->route('orders.show', $payment->order_id)
                ->with('success', 'Pagamento removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover pagamento do pedido: ' . $e->getMessage());
        }
    }

}
