<?php

namespace App\Http\Controllers;

use App\Enums\OrderItemStatus;
use App\Enums\OrderStatus;
use App\Models\AddonGroupOption;
use App\Models\ComboOptionGroup;
use App\Models\ComboOptionItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StoreProductVariant;
use App\Models\VariantAddon;
use App\Models\VariantAddonGroup;
use App\Services\OrderItemStockMovementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderItemsController extends Controller
{
    protected $order;
    protected $orderItem;
    protected $orderItemStockMovementService;

    public function __construct(Order $order, OrderItem $orderItem, OrderItemStockMovementService $orderItemStockMovementService)
    {
        $this->order = $order;
        $this->orderItem = $orderItem;
        $this->orderItemStockMovementService = $orderItemStockMovementService;
    }

    public function nextStatus($id)
    {
        $orderItem = $this->orderItem->findOrFail($id);
        $this->authorize('update', $orderItem->order);

        try {
            $order = Order::find($orderItem->order_id);

            if ($order->status == OrderStatus::PENDING->value) {
                return redirect()->back()
                    ->with('fail', 'Não é possível alterar o status de itens de um pedido pendente.');
            }

            if (($order->status == OrderStatus::COMPLETED->value) || ($order->status == OrderStatus::CANCELED->value)) {
                return redirect()->back()
                    ->with('fail', 'Não é possível alterar o status de itens de um pedido finalizado ou cancelado.');
            }

            $validTransitions = [
                OrderItemStatus::PENDING->value => OrderItemStatus::IN_PROGRESS->value,
                OrderItemStatus::IN_PROGRESS->value => OrderItemStatus::READY->value,
                OrderItemStatus::READY->value => OrderItemStatus::SERVED->value,
            ];

            if (!array_key_exists($orderItem->status, $validTransitions)) {
                return redirect()->back()
                    ->with('fail', 'Não é possível alterar o status deste item.');
            }

            DB::transaction(function () use ($orderItem, $validTransitions, $order) {
                $orderItem->status = $validTransitions[$orderItem->status];
                $orderItem->save();

                // registrar movimentação de estoque, se aplicável
                if (($orderItem->status == OrderItemStatus::IN_PROGRESS->value) && $orderItem->storeProductVariant->manage_stock) {
                    $this->orderItemStockMovementService->registerSaleFromOrderItem($orderItem);

                    if ($order->status != OrderStatus::IN_PROGRESS->value) {
                        $order->status = OrderStatus::IN_PROGRESS->value;
                        $order->save();
                    }
                }
            });

            return redirect()->back()
                ->with('success', 'Status do item atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar status do item: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $this->authorize('create', Order::class);

        try {
            $request->validate([
                'order_id' => 'required|exists:orders,id',
                'store_product_variant_id' => 'nullable|exists:store_product_variants,id',
                'quantity' => 'required|integer|min:1',
                'notes' => 'nullable|string|max:1000',
            ]);

            $data = $request->all();

            $variantRequiredGroups = VariantAddonGroup::where('sp_variant_id', $data['store_product_variant_id'] ?? 0)
                ->where('is_required', 1)->get()->keyBy('id');

            // Validação customizada dos limites dos grupos de opções
            if (count($variantRequiredGroups) > 0) {
                $validationErrors = [];

                $variantGroupTotals = [];

                if (isset($data['options']) && is_array($data['options'])) {
                    foreach ($data['options'] as $optionData) {
                        $addonOption = AddonGroupOption::where('id', $optionData['id'])->first();

                        if ($addonOption instanceof AddonGroupOption) {
                            if (!isset($variantGroupTotals[$addonOption->addon_group_id])) {
                                $variantGroupTotals[$addonOption->addon_group_id] = 0;
                            }

                            $variantGroupTotals[$addonOption->addon_group_id] += intval($optionData['quantity']);
                        }
                    }
                }

                // Buscar limites dos grupos
                foreach ($variantRequiredGroups as $groupId => $group) {
                    if ($group) {
                        $min = (int) $group->min_options;
                        $max = (int) $group->max_options;

                        if (!isset($variantGroupTotals[$groupId])) {
                            $validationErrors["addonGroupOptionQuantities.$groupId"] = "Selecione ao menos $min" . ($min > 1 ? ' opções' : ' opção');
                        } else {
                            if ($min > 0 && $variantGroupTotals[$groupId] < $min) {
                                $validationErrors["addonGroupOptionQuantities.$groupId"] = "Selecione ao menos $min" . ($min > 1 ? ' opções' : ' opção');
                            }

                            if ($max > 0 && $variantGroupTotals[$groupId] > $max) {
                                $validationErrors["addonGroupOptionQuantities.$groupId"] = "Selecione no máximo $max" . ($max > 1 ? ' opções' : ' opção');
                            }
                        }
                    }
                }

                if (!empty($validationErrors)) {
                    throw \Illuminate\Validation\ValidationException::withMessages($validationErrors);
                }
            }

            $requiredComboOptionGroups = ComboOptionGroup::where('sp_variant_id', $data['store_product_variant_id'] ?? 0)
                ->where('is_required', 1)
                ->get();

            // Validação customizada dos limites dos grupos de opções de combo
            if (count($requiredComboOptionGroups) > 0) {
                $validationErrors = [];

                $comboGroupTotals = [];

                if (isset($data['combo_options']) && is_array($data['combo_options'])) {
                    foreach ($data['combo_options'] as $optionData) {
                        $comboOptionItem = ComboOptionItem::where('id', $optionData['id'])->first();

                        if ($comboOptionItem instanceof ComboOptionItem) {
                            if (!isset($comboGroupTotals[$comboOptionItem->option_group_id])) {
                                $comboGroupTotals[$comboOptionItem->option_group_id] = 0;
                            }

                            $comboGroupTotals[$comboOptionItem->option_group_id] += intval($optionData['quantity']);
                        }
                    }
                }

                // Buscar limites dos grupos
                foreach ($requiredComboOptionGroups as $group) {
                    $groupId = $group->id;
                    if ($group) {
                        $min = (int) $group->min_options;
                        $max = (int) $group->max_options;

                        if (!isset($comboGroupTotals[$groupId])) {
                            $validationErrors["comboOptionGroupQuantities.$groupId"] = "Selecione ao menos $min" . ($min > 1 ? ' opções' : ' opção');
                        } else {
                            if ($min > 0 && $comboGroupTotals[$groupId] < $min) {
                                $validationErrors["comboOptionGroupQuantities.$groupId"] = "Selecione ao menos $min" . ($min > 1 ? ' opções' : ' opção');
                            }
                            if ($max > 0 && $comboGroupTotals[$groupId] > $max) {
                                $validationErrors["comboOptionGroupQuantities.$groupId"] = "Selecione no máximo $max" . ($max > 1 ? ' opções' : ' opção');
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
                    'notes' => $data['notes'] ?? null,
                ]);

                if (isset($data['options']) && is_array($data['options'])) {
                    foreach ($data['options'] as $optionData) {
                        $addonOption = AddonGroupOption::where('id', $optionData['id'])->first();

                        if ($addonOption instanceof AddonGroupOption) {
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

                if ($data['combo_options'] ?? false) {
                    foreach ($data['combo_options'] as $comboOption) {
                        if (isset($comboOption['id']) && $comboOption['id'] > 0) {
                            $comboOptionItem = ComboOptionItem::where('id', $comboOption['id'])->first();

                            if ($comboOptionItem instanceof ComboOptionItem) {
                                $orderItem->comboOptionItems()->create([
                                    'combo_option_item_id' => $comboOptionItem->id,
                                    'quantity' => $comboOption['quantity'],
                                    'unit_price' => $comboOptionItem->additional_price,
                                ]);

                                // Incrementar no preço do item
                                if ($comboOptionItem->additional_price > 0) {
                                    $orderItem->total_price += ($comboOptionItem->additional_price * intval($comboOption['quantity']));
                                    $orderItem->save();
                                }
                            }
                        }
                    }
                }

                if ($data['addons'] ?? false) {
                    foreach ($data['addons'] as $addon) {
                        if (isset($addon['id']) && $addon['id'] > 0) {
                            $variantAddon = VariantAddon::where('id', $addon['id'])->first();

                            $orderItem->orderItemAddons()->create([
                                'variant_addon_id' => $variantAddon->id,
                                'quantity' => $addon['quantity'],
                                'unit_price' => $variantAddon->price,
                                'total_price' => ($variantAddon->price * intval($addon['quantity'])),
                            ]);

                            // Incrementar no preço do item
                            if ($variantAddon->price > 0) {
                                $orderItem->total_price += ($variantAddon->price * intval($addon['quantity']));
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

            $orderItem->load('storeProductVariant', 'orderItemAddons.variantAddon.addon.addonIngredients');

            if (!$orderItem->storeProductVariant->is_produced && (count($orderItem->orderItemAddons) < 1)) {
                DB::transaction(function () use ($orderItem) {
                    // marcar como preparado imediatamente
                    $orderItem->status = OrderItemStatus::READY->value;
                    $orderItem->save();

                    // registrar movimentação de estoque, se aplicável
                    if ($orderItem->storeProductVariant && $orderItem->storeProductVariant->manage_stock) {
                        $this->orderItemStockMovementService->registerSaleFromOrderItem($orderItem);
                    }
                });
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
