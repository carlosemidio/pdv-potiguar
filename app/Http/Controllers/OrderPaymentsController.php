<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
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
            'paid_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $data = $request->only(['order_id', 'method', 'amount', 'paid_amount', 'notes']);
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
                if (($data['method'] === 'cash') && isset($data['paid_amount']) && ($data['amount'] < $data['paid_amount'])) {
                    // For cash payments, ensure paid_amount and change_amount are set
                    $data['change_amount'] = ($data['paid_amount'] - $data['amount']);

                    $openedCashRegister = CashRegister::where('store_id', $order->store_id)
                        ->where('status', 1)
                        ->first();

                    if (!$openedCashRegister) {
                        throw new \Exception('Não há caixa aberto para registrar o pagamento em dinheiro.');
                    }

                    $openedCashRegister->movements()->create([
                        'user_id' => Auth::id(),
                        'type' => 'sale',
                        'amount' => $data['paid_amount'],
                        'description' => "Pagamento em dinheiro no pedido #{$data['order_id']}, valor a ser pago: R$ {$data['amount']}, valor recebido: R$ {$data['paid_amount']}",
                    ]);

                    if ($data['change_amount'] > 0) {
                        $openedCashRegister->movements()->create([
                            'user_id' => Auth::id(),
                            'type' => 'removal',
                            'amount' => $data['change_amount'],
                            'description' => "Troco para o pagamento em dinheiro no pedido #{$data['order_id']}, valor do troco: R$ {$data['change_amount']}",
                        ]);
                    }

                    $openedCashRegister->update([
                        'system_balance' => $openedCashRegister->calculated_system_balance,
                    ]);

                    $data['cash_register_id'] = $openedCashRegister->id;

                    $payment = $order->payments()->create($data);
                } else {
                    $payment = $order->payments()->create($data);
                }

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

    public function destroy(int $id)
    {
        $payment = Payment::with('order')->findOrFail($id);
        $order = $payment->order;

        $this->authorize('update', $order);

        try {
            DB::transaction(function () use ($payment, $order) {
                if ($payment->method === 'cash') {
                    $openedCashRegister = CashRegister::where('store_id', $order->store_id)
                        ->where('status', 1)
                        ->first();

                    if ($openedCashRegister) {
                        // Revert cash register movements
                        $openedCashRegister->movements()->create([
                            'user_id' => Auth::id(),
                            'type' => 'refund',
                            'amount' => $payment->paid_amount,
                            'description' => "Devolução de pagamento em dinheiro do pedido #{$order->id}",
                        ]);

                        if ($payment->change_amount > 0) {
                            $openedCashRegister->movements()->create([
                                'user_id' => Auth::id(),
                                'type' => 'addition',
                                'amount' => $payment->change_amount,
                                'description' => "Reembolso de troco da devolução do pagamento em dinheiro do pedido #{$order->id}",
                            ]);
                        }

                        $openedCashRegister->update([
                            'system_balance' => $openedCashRegister->calculated_system_balance,
                        ]);
                    }
                }

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
