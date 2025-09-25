<?php

namespace App\Http\Controllers;

use App\Enums\StockMovementSubtype;
use App\Http\Resources\StockMovementResource;
use App\Http\Resources\UnitResource;
use App\Models\Ingredient;
use App\Models\StockMovement;
use App\Models\StoreProductVariant;
use App\Models\Unit;
use App\Models\User;
use App\Services\StockMovementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('stock-movements_view');

        $query = StockMovement::query();

        if (!request()->user()->hasPermission('stock-movements_view', true)) {
            $query->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $query->where('tenant_id', request()->user()->tenant_id);
        }

        $stockableType = $request->get('stockable_type') ?? 'variant';

        if ($stockableType === 'variant') {
            $query->where('stockable_type', StoreProductVariant::class)
                ->with(['user', 'tenant', 'store', 'storeProductVariant.productVariant.product']);
        } elseif ($stockableType === 'ingredient') {
            $query->where('stockable_type', Ingredient::class)
                ->with(['user', 'tenant', 'store', 'ingredient.unit']);
        }

        if ($request->stockable_id) {
            $query->where('stockable_id', $request->stockable_id);
        }

        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');

        if ($dateFrom && $dateTo) {
            $query->whereBetween('created_at', [
                $dateFrom . ' 00:00:00',
                $dateTo . ' 23:59:59',
            ]);
        } elseif ($dateFrom) {
            $query->where('created_at', '>=', $dateFrom . ' 00:00:00');
        } elseif ($dateTo) {
            $query->where('created_at', '<=', $dateTo . ' 23:59:59');
        }

        $query->orderBy('created_at', 'desc');

        $data = $query->paginate(20);

        return Inertia::render('StockMovement/Index', [
            'stockMovements' => StockMovementResource::collection($data),
            'filters' => $request->only(['store_id', 'stockable_type', 'stockable_id', 'date_from', 'date_to']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', StockMovement::class);

        return Inertia::render('StockMovement/Form', [
            'subtypes' => collect(StockMovementSubtype::cases())->map(fn($c) => ['value' => $c->value, 'label' => $c->name])->values(),
            'units' => UnitResource::collection(Unit::all()),
        ]);
    }

    public function store(Request $request, StockMovementService $service)
    {
        $this->authorize('create', StockMovement::class);

        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'stockable_type' => 'required|string|in:variant,ingredient',
            'stockable_id' => [
                'required',
                function ($attribute, $value, $fail) use ($request) {
                    $type = $request->input('stockable_type');
                    if ($type === 'variant') {
                        if (!\App\Models\StoreProductVariant::where('id', $value)->exists()) {
                            $fail('A variante selecionada não existe.');
                        }
                    } elseif ($type === 'ingredient') {
                        if (!\App\Models\Ingredient::where('id', $value)->exists()) {
                            $fail('O ingrediente selecionado não existe.');
                        }
                    } else {
                        $fail('Tipo de estoque inválido.');
                    }
                }
            ],
            'quantity' => 'required|numeric|min:0.0001',
            'subtype' => 'required|string|in:' . implode(',', array_map(fn($c) => $c->value, StockMovementSubtype::cases())),
            'cost_price' => 'nullable|numeric|min:0',
            'reason' => 'nullable|string|max:255',
            'document_number' => 'nullable|string|max:100',
            'unit_id' => 'nullable|exists:units,id',
        ]);

        $user = User::with('store')->find(Auth::id());

        try {
            // Determina o tipo polimórfico com base na entrada
            $stockableType = $validated['stockable_type'] == 'variant'
                ? StoreProductVariant::class
                : Ingredient::class;

            $unit = Unit::find($validated['unit_id']) ?? null;

            $movement = $service->register(
                $user->id,
                $user->tenant_id,
                $validated['store_id'],
                $stockableType,
                $validated['stockable_id'],
                (float) $validated['quantity'],
                StockMovementSubtype::from($validated['subtype']),
                $validated['cost_price'] ?? null,
                $validated['reason'] ?? null,
                $validated['document_number'] ?? null,
                $unit
            );

            return redirect(route('stock-movement.index') . ($validated['stockable_type'] === 'variant' ? '?stockable_type=variant' : '?stockable_type=ingredient'))
                ->with('success', 'Movimentação registrada com sucesso.');
        } catch (\Throwable $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao registrar movimentação: ' . $e->getMessage());
        }
    }
}
