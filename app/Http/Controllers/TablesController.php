<?php

namespace App\Http\Controllers;

use App\Http\Resources\TableResource;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TablesController extends Controller
{
    protected $table;

    public function __construct(Table $table)
    {
        $this->table = $table;
    }

    public function index(Request $request)
    {
        $this->authorize('tables_view');

        $search = $request->search ?? '';
        $trashed = $request->trashed ?? false;
        $tablesQuery = $this->table->query();
        $user = User::find(Auth::id());

        if (!$user->hasPermission('tables_view', true)) {
            $tablesQuery->where('user_id', Auth::id());
        }

        if ($user->tenant_id != null) {
            $tablesQuery->where('tenant_id', $user->tenant_id);
        }

        if ($user->store_id != null) {
            $tablesQuery->where('store_id', $user->store_id);
        }

        if ($search != '') {
            $tablesQuery->where('name', 'like', "%$search%");
        }

        if ($trashed) {
            $tablesQuery->withTrashed();
        }

        $tables = $tablesQuery->orderBy('name')
            ->with('store')
            ->paginate(12)
            ->withQueryString();

        foreach ($tables as $table) {
            if ($table->status === 'occupied') {
                $order = Order::where('table_id', $table->id)
                    ->where('store_id', $table->store_id)
                    ->whereIn('status', ['pending', 'in_progress'])
                    ->first();

                if ($order) {
                    $table->order_id = $order->id;
                }
            }
        }

        return Inertia::render('Tables/Index', [
            'tables' => TableResource::collection($tables),
            'search' => $search,
            'trashed' => $trashed,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Table::class);
        
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:tables,name,NULL,id,store_id,' . Auth::user()->store_id,
        ], [
            'name.required' => 'O nome da mesa é obrigatório.',
            'name.string' => 'O nome da mesa deve ser uma string.',
            'name.max' => 'O nome da mesa não pode exceder 255 caracteres.',
            'name.unique' => 'Já existe uma mesa com este nome na loja.',
        ]);

        try {
            $user = User::find(Auth::user()->id);

            $data['user_id'] = $user->id;
            $data['store_id'] = $user->store_id;
            $data['tenant_id'] = $user->tenant_id;

            $table = $this->table->create($data);

            if (!$table) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar mesa.');
            }

            return redirect()->route('tables.index')
                ->with('success', 'Mesa criada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar mesa: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $table = $this->table->findOrFail($id);
        $this->authorize('update', $table);

        try {
            if (!$table->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar mesa.');
            }

            return redirect()->route('tables.index')
                ->with('success', 'Mesa atualizada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar mesa: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $table = $this->table->findOrFail($id);

        $this->authorize('delete', $table);

        try {
            if (!$table->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover mesa.');
            }

            return redirect()->back()
                ->with('success', 'Mesa removida com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover mesa: ' . $e->getMessage());
        }
    }

    public function restore(Table $table)
    {
        $this->authorize('delete', $table);

        try {
            if (!$table->restore()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao restaurar mesa.');
            }

            return redirect()->back()
                ->with('success', 'Mesa restaurada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao restaurar mesa: ' . $e->getMessage());
        }
    }
}
