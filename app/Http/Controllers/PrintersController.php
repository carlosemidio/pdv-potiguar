<?php

namespace App\Http\Controllers;

use App\Http\Requests\PrinterRequest;
use App\Http\Resources\PrinterResource;
use App\Models\Printer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PrintersController extends Controller
{
    protected $printer;

    public function __construct(Printer $printer)
    {
        $this->printer = $printer;
    }

    public function index(Request $request)
    {
        $this->authorize('printers_view');
        $user = User::find(Auth::id());

        if ($user->store_id === null) {
            return redirect(route('dashboard'))
                ->with('fail', 'Usuário não está associado a nenhuma loja. Por favor, crie uma loja primeiro.');
        }

        $search = $request->search ?? '';
        $trashed = $request->trashed ?? false;
        $printersQuery = $this->printer->query();

        if (!request()->user()->hasPermission('printers_view', true)) {
            $printersQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $printersQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($user->store_id != null) {
            $printersQuery->where('store_id', $user->store_id);
        }

        if ($search != '') {
            $printersQuery->where('name', 'like', "%$search%");
        }

        if ($trashed) {
            $printersQuery->withTrashed();
        }

        $printers = $printersQuery->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Printers/Index', [
            'printers' => PrinterResource::collection($printers),
            'search' => $search,
            'trashed' => $trashed,
        ]);
    }

    public function store(PrinterRequest $request)
    {
        $this->authorize('create', Printer::class);

        $data = $request->validated();

        try {
            $data['user_id'] = Auth::user()->id;
            $data['tenant_id'] = Auth::user()->tenant_id;
            $data['store_id'] = Auth::user()->store_id;

            $printer = $this->printer->create($data);

            if (!$printer) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar impressora.');
            }

            return redirect()->route('printers.index')
                ->with('success', 'Impressora criada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar impressora: ' . $e->getMessage());
        }
    }

    public function update(PrinterRequest $request, $id)
    {
        $printer = $this->printer->findOrFail($id);

        $this->authorize('update', $printer);

        $data = $request->validated();

        try {
            if (!$printer->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar impressora.');
            }

            return redirect()->route('printers.index')
                ->with('success', 'Impressora atualizada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar impressora: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $printer = $this->printer->findOrFail($id);

        $this->authorize('delete', $printer);

        try {
            if (!$printer->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover impressora.');
            }

            return redirect()->route('printers.index')
                ->with('success', 'Impressora removida com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover impressora: ' . $e->getMessage());
        }
    }

    public function restore(Printer $printer)
    {
        $this->authorize('delete', $printer);

        try {
            if (!$printer->restore()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao restaurar impressora.');
            }

            return redirect()->route('printers.index')
                ->with('success', 'Impressora restaurada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao restaurar impressora: ' . $e->getMessage());
        }
    }
}
