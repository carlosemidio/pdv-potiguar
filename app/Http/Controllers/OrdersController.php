<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Resources\TableResource;
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

        $search = $request->search ?? '';
        $ordersQuery = $this->order->query();
        $user = User::find(Auth::user()->id);

        if ($search != '') {
            $ordersQuery->where('name', 'like', "%$search%");
        }

        if (!$user->hasPermission('orders_view', true)) {
            $ordersQuery->where('user_id', $user->id);
        }

        $orders = $ordersQuery->with(['store', 'table'])
            ->orderBy('id', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'search' => $search,
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
                'customer_name' => 'nullable|string|max:255',
                'status' => 'required|in:pending,in_progress,completed,cancelled',
                'service_fee' => 'nullable|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'paid_amount' => 'nullable|numeric|min:0',
                'payment_status' => 'required|in:0,1',
            ]);

            $user = User::with('store')->find(Auth::user()->id);

            $data['user_id'] = Auth::user()->id;
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

        $order->load(['store', 'table', 'items.product', 'items.variant', 'items.itemAddons.addon']);

        return Inertia::render('Orders/Show', [
            'order' => new OrderResource($order),
        ]);
    }

    public function edit($id)
    {
        $order = $this->order->findOrFail($id);

        $this->authorize('update', $order);

        $order->load(['store', 'table']);

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
                'customer_name' => 'nullable|string|max:255',
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

    public function destroy($id)
    {
        $order = $this->order->findOrFail($id);
        $this->authorize('delete', $order);

        try {
            if (!$order->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover pedido.');
            }

            return redirect()->route('orders.index')
                ->with('success', 'Pedido removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover pedido: ' . $e->getMessage());
        }
    }
}
