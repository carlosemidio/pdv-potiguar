<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Resources\TableResource;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrdersController extends Controller
{
    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function index(Request $request)
    {
        $this->authorize('orders_view');
        $ordersQuery = $this->order->query();
        $user = User::find(Auth::user()->id);

        $status = $request->input('status');
        $customer_id = $request->input('customer_id');
        $date_from = $request->input('date_from');
        $date_to = $request->input('date_to');
        $customer = null;

        if ($status) {
            $ordersQuery->where('status', $status);
        }

        if ($customer_id) {
            $ordersQuery->where('customer_id', $customer_id);
            $customer = Customer::find($customer_id);
        }

        if ($date_from) {
            $ordersQuery->whereDate('created_at', '>=', $date_from);
        }

        if ($date_to) {
            $ordersQuery->whereDate('created_at', '<=', $date_to);
        }

        if (!$user->hasPermission('orders_view', true)) {
            $ordersQuery->where('user_id', $user->id);
        }

        $orders = $ordersQuery->with(['store', 'table', 'customer', 'items.storeProductVariant.productVariant'])
            ->orderBy('id', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'filters' => [
                'status' => $status,
                'customer' => $customer,
                'date_from' => $date_from,
                'date_to' => $date_to,
            ],
        ]);
    }

    public function create()
    {
        $this->authorize('create', Order::class);

        $user = User::with('store')->find(Auth::user()->id);

        if ($user->hasPermission('tables_view')) {
            $tables = Table::where('store_id', $user->store->id)
                ->where('status', 'available')
                ->get();
        }

        return Inertia::render('Orders/Form', [
            'tables' => TableResource::collection($tables ?? []),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Order::class);

        try {
            $data = $request->validate([
                'table_id' => 'nullable|exists:tables,id',
                'customer_id' => 'nullable|exists:customers,id',
                'status' => 'required|in:pending,in_progress,completed,cancelled',
                'service_fee' => 'nullable|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'paid_amount' => 'nullable|numeric|min:0',
                'payment_status' => 'required|in:0,1',
            ]);

            $user = User::with('store')->find(Auth::user()->id);

            $data['user_id'] = Auth::user()->id;
            $data['tenant_id'] = $user->tenant_id;
            $data['store_id'] = $user->store->id;

            $order = DB::transaction(function () use ($data) {
                $lastOrder = $this->order->where('store_id', $data['store_id'])
                    ->max('number');

                $data['number'] = $lastOrder ? $lastOrder + 1 : 1;

                $order = $this->order->create($data);

                if (isset($data['table_id'])) {
                    $table = Table::find($data['table_id']);
                    $table->status = 'occupied';
                    $table->save();
                }

                // update stock for each item in the order (if applicable)

                foreach ($order->items as $item) {
                    if ($item->variant) {
                        $item->variant->stock -= $item->quantity;
                        $item->variant->save();
                    } else {
                        $item->product->stock -= $item->quantity;
                        $item->product->save();
                    }
                }

                return $order;
            });

            if (!$order) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar pedido.');
            }

            return redirect()->route('orders.index')
                ->with('success', 'Pedido criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar pedido: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        $order = $this->order->findOrFail($id);

        $this->authorize('view', $order);

        $order->load(['store', 'table', 'items.storeProductVariant.productVariant', 'items.itemAddons.addon', 'customer', 'payments']);

        return Inertia::render('Orders/Show', [
            'order' => new OrderResource($order),
        ]);
    }

    public function edit($id)
    {
        $order = $this->order->findOrFail($id);

        $this->authorize('update', $order);

        $order->load(['store', 'table', 'customer']);

        return Inertia::render('Orders/Form', [
            'order' => new OrderResource($order),
            'tables' => TableResource::collection([]),
        ]);
    }

    public function update(Request $request, $id)
    {
        $order = $this->order->findOrFail($id);
        $this->authorize('update', $order);

        try {
            $data = $request->validate([
                'table_id' => 'nullable|exists:tables,id',
                'customer_id' => 'nullable|exists:customers,id',
                'status' => 'required|in:pending,in_progress,completed,cancelled',
                'service_fee' => 'nullable|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'paid_amount' => 'nullable|numeric|min:0',
                'payment_status' => 'required|in:0,1',
            ]);

            if (!$order->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar pedido.');
            }

            return redirect()->route('orders.index')
                ->with('success', 'Pedido atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar pedido: ' . $e->getMessage());
        }
    }

    public function finish($id)
    {
        $order = $this->order->findOrFail($id);
        $this->authorize('update', $order);

        try {
            if (!in_array($order->status, ['pending', 'in_progress'])) {
                return redirect()->back()
                    ->with('fail', 'Apenas pedidos pendentes ou em andamento podem ser finalizados.');
            }

            if ($order->items->isEmpty()) {
                return redirect()->back()
                    ->with('fail', 'Não é possível finalizar um pedido sem itens.');
            }

            if ($order->paid_amount < $order->total_amount) {
                return redirect()->back()
                    ->with('fail', 'O valor pago é menor que o valor total do pedido.');
            }

            $order->status = 'completed';

            if (!$order->save()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao finalizar pedido.');
            }

            if (isset($order->table_id)) {
                $table = Table::find($order->table_id);
                $table->status = 'available';
                $table->save();
            }

            return redirect()->route('orders.index')
                ->with('success', 'Pedido finalizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao finalizar pedido: ' . $e->getMessage());
        }
    }

    public function cancel($id)
    {
        $order = $this->order->findOrFail($id);
        $this->authorize('update', $order);

        try {
            if (!in_array($order->status, ['pending', 'in_progress'])) {
                return redirect()->back()
                    ->with('fail', 'Apenas pedidos pendentes ou em andamento podem ser cancelados.');
            }

            $order->status = 'cancelled';

            if (!$order->save()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao cancelar pedido.');
            }

            if (isset($order->table_id)) {
                $table = Table::find($order->table_id);
                $table->status = 'available';
                $table->save();
            }

            return redirect()->route('orders.index')
                ->with('success', 'Pedido cancelado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao cancelar pedido: ' . $e->getMessage());
        }
    }
}
