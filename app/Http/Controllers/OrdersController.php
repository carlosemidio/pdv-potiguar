<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PrinterResource;
use App\Http\Resources\TableResource;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Printer;
use App\Models\Table;
use App\Models\User;
use App\Services\OrderItemStockMovementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrdersController extends Controller
{
    protected $order;
    protected $orderItemStockMovementService;

    public function __construct(Order $order, OrderItemStockMovementService $orderItemStockMovementService)
    {
        $this->order = $order;
        $this->orderItemStockMovementService = $orderItemStockMovementService;
    }

    public function index(Request $request)
    {
        $this->authorize('orders_view');
        $ordersQuery = $this->order->query();
        $user = User::with('store')->find(Auth::id());

        if (!$user->hasPermission('orders_view', true)) {
            $ordersQuery->where('user_id', Auth::id());
        }

        if ($user->tenant_id != null) {
            $ordersQuery->where('tenant_id', $user->tenant_id);
        }

        if ($user->store_id != null) {
            $ordersQuery->where('store_id', $user->store_id);
        }

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

        $orders = $ordersQuery->with(['store', 'table', 'customer', 'items.storeProductVariant.productVariant'])
            ->orderBy('id', 'desc')
            ->paginate(12)
            ->withQueryString();

        $tables = [];

        if ($user->hasPermission('tables_view')) {
            $tables = Table::where('store_id', $user->store_id)->get();
        }

        return Inertia::render('Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'tables' => isset($tables) ? TableResource::collection($tables) : [],
            'filters' => [
                'status' => $status,
                'customer' => $customer,
                'date_from' => $date_from,
                'date_to' => $date_to,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Order::class);

        try {
            $data = $request->validate([
                'table_id' => 'nullable|exists:tables,id',
                'customer_id' => 'nullable|exists:customers,id',
            ]);

            $user = User::find(Auth::user()->id);

            if ($user->store_id == null) {
                return redirect()->back()
                    ->with('fail', 'Usuário não está associado a uma loja.');
            }

            $data['user_id'] = Auth::user()->id;
            $data['tenant_id'] = $user->tenant_id;
            $data['store_id'] = $user->store_id;
            $data['status'] = OrderStatus::IN_PROGRESS->value;

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

            return redirect()->route('orders.show', $order->id)
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

        $order->load([
            'store',
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

        // Ordenar items por id do maior para o menor
        $order->setRelation('items', $order->items->sortByDesc('id')->values());

        // Gerar link do WhatsApp
        if ($order->customer && $order->customer->phone) {
            $message = "Olá {$order->customer->name}!\n";
            $message .= "Aqui estão os detalhes do seu pedido:\n\n";
            $message .= "Nº: {$order->number}\n";
            $message .= "Data: " . $order->created_at->format('d/m/Y à\s H:i') . "\n";
            $message .= "Itens:\n";

            foreach ($order->items as $item) {
                $message .= "  - *{$item->quantity}x {$item->storeProductVariant->productVariant->name}*\n";
                $message .= "    Preço: R$ " . number_format($item->unit_price, 2, ',', '.') . "\n";

                if ($item->orderItemOptions->isNotEmpty()) {
                    $message .= "    Opções:\n";

                    foreach ($item->orderItemOptions as $option) {
                        $message .= "      • {$option->quantity}x {$option->addonGroupOption->addon->name}";
                        
                        if ($option->unit_price > 0) {
                            $message .= " + (R$ " . number_format($option->unit_price, 2, ',', '.') . ")";
                        }

                        $message .= "\n";
                    }
                }

                if ($item->comboOptionItems->isNotEmpty()) {
                    $message .= "    Itens do Combo:\n";

                    foreach ($item->comboOptionItems as $orderItemComboOption) {
                        $message .= "      • {$orderItemComboOption->quantity}x {$orderItemComboOption->comboOptionItem->storeProductVariant->productVariant->name}\n";
                    }
                }

                if ($item->orderItemAddons->isNotEmpty()) {
                    $message .= "    Adicionais:\n";

                    foreach ($item->orderItemAddons as $addon) {
                        $message .= "      • {$addon->quantity}x {$addon->variantAddon->addon->name} + (R$ " . number_format($addon->total_price, 2, ',', '.') . ")\n";
                    }
                }

                $message .= "    Total do item: R$ " . number_format($item->total_price, 2, ',', '.') . "\n";
            }

            $message .= "\nTotal: R$ " . number_format($order->total_amount, 2, ',', '.');
            $encodedMessage = urlencode($message);
            $whatsappUrl = "https://wa.me/55{$order->customer->phone}?text={$encodedMessage}";
        } else {
            $whatsappUrl = null;
        }

        $printers = [];
        $user = User::with('store')->find(Auth::id());
        
        if ($user->hasPermission('printers_view')) {
            $printers = Printer::where('store_id', $user->store_id)->get();
        }

        return Inertia::render('Orders/Show', [
            'order' => new OrderResource($order),
            'whatsappUrl' => $whatsappUrl,
            'printers' => PrinterResource::collection($printers),
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

    public function reject($id) // New method to reject an order
    {
        $order = $this->order->findOrFail($id);
        $this->authorize('update', $order);

        try {
            if ($order->status !== OrderStatus::PENDING->value) {
                return redirect()->back()
                    ->with('fail', 'Apenas pedidos pendentes podem ser rejeitados.');
            }

            DB::transaction(function () use ($order) {
                $order->update(['status' => OrderStatus::REJECTED->value]);
            });

            return redirect()->route('orders.index')
                ->with('success', 'Pedido rejeitado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao rejeitar pedido: ' . $e->getMessage());
        }
    }

    public function confirm($id)
    {
        $order = $this->order->findOrFail($id);
        $this->authorize('update', $order);

        try {
            $isPending = ($order->status === OrderStatus::PENDING->value);

            if (!$isPending) {
                return redirect()->back()
                    ->with('fail', 'Apenas pedidos pendentes podem ser confirmados.');
            }

            // Call to external API with GuzzleHttp
            $client = new \GuzzleHttp\Client();
            $response = $client->post('https://api.pdvp.com.br/api/v1/stores/' . $order->store->slug . '/orders/' . $order->number . '/confirm');

            if ($response->getStatusCode() !== 200) {
                return redirect()->back()
                    ->with('fail', 'Erro ao confirmar pedido na API externa.');
            }

            DB::transaction(function () use ($order) {
                $order->update(['status' => OrderStatus::CONFIRMED->value]);
                $order->load('items');
                
                // update stock for each item in the order (if applicable)
                foreach ($order->items as $item) {
                    if ($item->storeProductVariant && $item->storeProductVariant->manage_stock) {
                        $this->orderItemStockMovementService->registerSaleFromOrderItem($item);
                    }
                }
            });

            return redirect()->route('orders.index')
                ->with('success', 'Pedido confirmado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao confirmar pedido: ' . $e->getMessage());
        }
    }

    public function ship($id)
    {
        $order = $this->order->findOrFail($id);
        $this->authorize('update', $order);

        try {
            if ($order->status == OrderStatus::COMPLETED->value || $order->status == OrderStatus::CANCELED->value) {
                return redirect()->back()
                    ->with('fail', 'Não é possível enviar um pedido que já está finalizado ou cancelado.');
            }

            DB::transaction(function () use ($order) {
                $order->update(['status' => OrderStatus::SHIPPED->value]);
            });

            return redirect()->route('orders.index')
                ->with('success', 'Pedido enviado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao enviar pedido: ' . $e->getMessage());
        }
    }

    public function finish($id)
    {
        $order = $this->order->findOrFail($id);
        $this->authorize('update', $order);

        try {
            if (in_array($order->status, [OrderStatus::COMPLETED->value, OrderStatus::CANCELED->value])) {
                return redirect()->back()
                    ->with('fail', 'Não é possível finalizar um pedido que já está finalizado ou cancelado.');
            }

            if ($order->items->isEmpty()) {
                return redirect()->back()
                    ->with('fail', 'Não é possível finalizar um pedido sem itens.');
            }

            if ($order->paid_amount < $order->total_amount) {
                return redirect()->back()
                    ->with('fail', 'O valor pago é menor que o valor total do pedido.');
            }

            DB::transaction(function () use ($order) {
                $order->update(['status' => OrderStatus::COMPLETED->value]);
                $order->load('items.storeProductVariant.productVariant');

                if (isset($order->table_id) && $order->table_id != null) {
                    $table = Table::find($order->table_id);
                    $table->status = 'available';
                    $table->save();
                }
            });

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
            DB::transaction(function () use ($order) {
                if (!in_array($order->status, [OrderStatus::PENDING->value, OrderStatus::IN_PROGRESS->value])) {
                    $order->update(['status' => OrderStatus::CANCELED->value]);
                } else {
                    $order->update(['status' => OrderStatus::REJECTED->value]);
                }
            });

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
