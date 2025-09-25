<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\AddonGroupOption;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StoreProductVariant;
use App\Models\VariantAddonGroup;
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

            $data = $request->all();

            $variantRequiredGroups = VariantAddonGroup::where('sp_variant_id', $data['store_product_variant_id'] ?? 0)
                ->where('is_required', 1)->get()->keyBy('id');

            // Validação customizada dos limites dos grupos de opções
            if (count($variantRequiredGroups) > 0) {
                $validationErrors = [];
                if (isset($data['addonGroupOptionQuantities']) && is_array($data['addonGroupOptionQuantities'])) {
                    $groupTotals = [];
                    foreach ($data['addonGroupOptionQuantities'] as $key => $qty) {
                        if ($qty > 0) {
                            // chave: groupId_optionId
                            [$groupId, $optionId] = explode('_', $key);
                            $groupTotals[$groupId] = ($groupTotals[$groupId] ?? 0) + $qty;

                            $data['addonGroupOptions'][] = [
                                'group_id' => $groupId,
                                'option_id' => $optionId,
                                'quantity' => $qty,
                            ];
                        }
                    }
                }

                // Buscar limites dos grupos
                foreach ($variantRequiredGroups as $groupId => $group) {
                    if ($group) {
                        $min = (int) $group->min_options;
                        $max = (int) $group->max_options;

                        if (!isset($groupTotals[$groupId])) {
                            $validationErrors["addonGroupOptionQuantities.$groupId"] = "Selecione ao menos $min" . ($min > 1 ? ' opções' : ' opção');
                        } else {
                            if ($min > 0 && $groupTotals[$groupId] < $min) {
                                $validationErrors["addonGroupOptionQuantities.$groupId"] = "Selecione ao menos $min" . ($min > 1 ? ' opções' : ' opção');
                            }

                            if ($max > 0 && $groupTotals[$groupId] > $max) {
                                $validationErrors["addonGroupOptionQuantities.$groupId"] = "Selecione no máximo $max" . ($max > 1 ? ' opções' : ' opção');
                            }
                        }
                    }
                }

                if (!empty($validationErrors)) {
                    throw \Illuminate\Validation\ValidationException::withMessages($validationErrors);
                }
            }

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
                    'cost_price' => $storeProductVariant->cost_price,
                    'unit_price' => $storeProductVariant->price,
                    'total_price' => ($storeProductVariant->price * $data['quantity']),
                ]);

                if (isset($data['addonGroupOptions']) && is_array($data['addonGroupOptions'])) {
                    foreach ($data['addonGroupOptions'] as $optionData) {
                        $addonOption = AddonGroupOption::where('addon_group_id', $optionData['group_id'])
                            ->where('id', $optionData['option_id'])
                            ->first();

                        if ($addonOption) {
                            $orderItem->orderItemOptions()->create([
                                'addon_group_option_id' => $addonOption->id,
                                'quantity' => $optionData['quantity'],
                                'unit_price' => $addonOption->additional_price,
                            ]);

                            // Se additional_price > 0, incrementar no preço do item
                            if ($addonOption->additional_price > 0) {
                                $orderItem->total_price += ($addonOption->additional_price * $optionData['quantity']);
                                $orderItem->save();
                            }
                        }
                    }
                }

                if ($data['addons'] ?? false) {
                    foreach ($data['addons'] as $addon) {
                        if (isset($addon['variant_addon_id']) && $addon['variant_addon_id'] > 0) {
                            $orderItem->orderItemAddons()->create([
                                'variant_addon_id' => $addon['variant_addon_id'],
                                'quantity' => $addon['quantity'],
                                'unit_price' => $addon['unit_price'],
                                'total_price' => (floatval($addon['unit_price']) * intval($addon['quantity'])),
                            ]);

                            // Incrementar no preço do item
                            if (floatval($addon['unit_price']) > 0) {
                                $orderItem->total_price += (floatval($addon['unit_price']) * intval($addon['quantity']));
                                $orderItem->save();
                            }
                        }
                    }
                }

                // Recalculate order totals
                $order->load('items');
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Laravel/Inertia já retorna status 422 para ValidationException
            throw $e;
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
                $order->load('items');
                $order->amount = $order->items->sum('total_price');

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
