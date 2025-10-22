<?php

namespace App\Http\Controllers;

use App\Http\Resources\CashMovementResource;
use App\Http\Resources\CashRegisterResource;
use App\Models\CashMovement;
use App\Models\CashRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CashRegistersController extends Controller
{
    protected $cashRegister;

    public function __construct(CashRegister $cashRegister)
    {
        $this->cashRegister = $cashRegister;
    }

    public function index(Request $request)
    {
        $this->authorize('cash-registers_view');
        $registersQuery = $this->cashRegister->query();

        if (!request()->user()->hasPermission('cash-registers_view', true)) {
            $registersQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $registersQuery->where('tenant_id', request()->user()->tenant_id);
        }

        $storeId = $request->user()->store_id;
        $registers = $registersQuery
            ->where('store_id', $storeId)
            ->with(['user', 'closer'])
            ->orderBy('opened_at', 'desc')
            ->paginate(10);

        $openedCashRegister = $registers->firstWhere('status', 1);

        return Inertia::render('CashRegister/Index', [
            'cashRegisters' => CashRegisterResource::collection($registers),
            'openedCashRegister' => $openedCashRegister ? new CashRegisterResource($openedCashRegister) : null,
        ]);
    }

    public function show(CashRegister $register)
    {
        $this->authorize('view', $register);

        $movements = CashMovement::where('cash_register_id', $register->id)
            ->with(['user'])
            ->orderBy('id', 'desc')
            ->paginate(15);

        return Inertia::render('CashRegister/Show', [
            'cashRegister' => new CashRegisterResource($register->load(['user'])),
            'movements' => CashMovementResource::collection($movements),
        ]);
    }

    public function open(Request $request)
    {
        $this->authorize('create', CashRegister::class);

        $data = $request->validate([
            'opening_amount' => 'required|numeric|min:0',
        ]);

        try {
            $cashRegister = $this->cashRegister->create([
                'user_id' => Auth::user()->id,
                'tenant_id' => Auth::user()->tenant_id,
                'store_id' => Auth::user()->store_id,
                'opening_amount' => $data['opening_amount'],
                'system_balance' => $data['opening_amount'],
                'status' => 1, // assuming '1' means opened
                'opened_at' => now(),
            ]);

            if (!$cashRegister) {
                return redirect()->back()
                    ->with('fail', 'Erro ao abrir caixa.');
            }

            $cashRegister->movements()->create([
                'user_id' => Auth::user()->id,
                'type' => 'opening',
                'amount' => $data['opening_amount'],
                'description' => 'Abertura de caixa',
            ]);

            return redirect()->back()
                ->with('success', 'Caixa aberto com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao abrir caixa: ' . $e->getMessage());
        }
    }

    public function addMovement(Request $request, CashRegister $register)
    {
        $this->authorize('update', $register);

        $request->validate([
            'type' => 'required|in:sale,removal,addition,refund',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
        ]);

        try {
            $movement = DB::transaction(function () use ($request, $register) {
                $movement = $register->movements()->create([
                    'user_id' => $request->user()->id,
                    'type' => $request->type,
                    'amount' => $request->amount,
                    'description' => $request->description,
                ]);
                
                $register->update([
                    'system_balance' => $register->calculated_system_balance
                ]);

                return $movement;
            });

            if (!$movement) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar movimento de caixa.');
            }

            return redirect()->back()
                ->with('success', 'Movimento de caixa adicionado com sucesso!');

        } catch (\Throwable $th) {
            return redirect()->back()
                ->with('fail', 'Erro ao adicionar movimento de caixa: ' . $th->getMessage());
        }        
    }

    public function close(Request $request, CashRegister $register)
    {
        $this->authorize('update', $register);

        $data = $request->validate([
            'closing_amount' => 'required|numeric|min:0',
        ]);

        try {
            $updated = DB::transaction(function () use ($register, $data, $request) {
                $systemBalance = $register->calculated_system_balance;
                $difference = $data['closing_amount'] - $systemBalance;

                $register->movements()->create([
                    'user_id' => $request->user()->id,
                    'type' => 'closing',
                    'amount' => $data['closing_amount'],
                    'description' => 'Fechamento do caixa',
                ]);

                return $register->update([
                    'closing_amount' => $data['closing_amount'],
                    'system_balance' => $systemBalance,
                    'difference' => $difference,
                    'closed_by' => $request->user()->id,
                    'status' => 0, // assuming '0' means closed
                    'closed_at' => now(),
                ]);
            });

            if (!$updated) {
                return redirect()->back()
                    ->with('fail', 'Erro ao fechar caixa.');
            }

            return redirect()->back()
                ->with('success', 'Caixa fechado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao fechar caixa: ' . $e->getMessage());
        }
    }
}
