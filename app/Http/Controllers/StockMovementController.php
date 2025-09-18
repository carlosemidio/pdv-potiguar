<?php

namespace App\Http\Controllers;

use App\Enums\StockMovementSubtype;
use App\Http\Resources\StockMovementResource;
use App\Models\StockMovement;
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

        $query = StockMovement::with(['user', 'tenant', 'store', 'storeProductVariant.productVariant.product'])
            ->orderByDesc('id');

        if ($search = $request->get('search')) {
            $query->whereHas('storeProductVariant.productVariant.product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
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

        $data = $query->paginate(20)->withQueryString();

        return Inertia::render('StockMovement/Index', [
            'stockMovements' => StockMovementResource::collection($data),
            'filters' => $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', StockMovement::class);

        return Inertia::render('StockMovement/Form', [
            'subtypes' => collect(StockMovementSubtype::cases())->map(fn($c) => ['value' => $c->value, 'label' => $c->name])->values(),
        ]);
    }

    public function store(Request $request, StockMovementService $service)
    {
        $this->authorize('create', StockMovement::class);

        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|numeric|min:0.0001',
            'subtype' => 'required|string|in:' . implode(',', array_map(fn($c) => $c->value, StockMovementSubtype::cases())),
            'cost_price' => 'nullable|numeric|min:0',
            'reason' => 'nullable|string|max:255',
            'document_number' => 'nullable|string|max:100',
        ]);

        $user = User::with('store')->find(Auth::id());

        try {
            $movement = $service->register(
                $user->id,
                $user->tenant_id,
                $validated['store_id'],
                $validated['product_variant_id'],
                (float) $validated['quantity'],
                StockMovementSubtype::from($validated['subtype']),
                $validated['cost_price'] ?? null,
                $validated['reason'] ?? null,
                $validated['document_number'] ?? null,
            );

            return redirect()->route('stock-movement.index')
                ->with('success', 'Movimentação registrada com sucesso.');
        } catch (\Throwable $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao registrar movimentação: ' . $e->getMessage());
        }
    }
}
