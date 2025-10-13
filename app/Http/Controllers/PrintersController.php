<?php

namespace App\Http\Controllers;

use App\Http\Resources\PrinterResource;
use App\Http\Resources\UnitResource;
use App\Models\Printer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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

        $printers = $printersQuery->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Printers/Index', [
            'printers' => PrinterResource::collection($printers),
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Printer::class);
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:printers,name,NULL,id,store_id,' . Auth::user()->store_id,
            'type' => 'nullable|string|max:255',
            'vendor_id' => 'required|string|max:255|unique:printers,vendor_id,NULL,id,store_id,' . Auth::user()->store_id,
            'product_id' => 'required|string|max:255|unique:printers,product_id,NULL,id,store_id,' . Auth::user()->store_id,
        ], [
            'name.unique' => 'Já existe uma impressora com esse nome, nessa loja.',
            'vendor_id.unique' => 'Já existe uma impressora com esse Vendor ID, nessa loja.',
            'product_id.unique' => 'Já existe uma impressora com esse Product ID, nessa loja.',
        ]);

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

    public function update(Request $request, $id)
    {
        $printer = $this->printer->findOrFail($id);

        $this->authorize('update', $printer);

        $data = $request->validate([
            'name' => 'required|string|max:255|unique:printers,name,' . $printer->id . ',id,store_id,' . Auth::user()->store_id,
            'type' => 'nullable|string|max:255',
            'vendor_id' => 'required|string|max:255|unique:printers,vendor_id,' . $printer->id . ',id,store_id,' . Auth::user()->store_id,
            'product_id' => 'required|string|max:255|unique:printers,product_id,' . $printer->id . ',id,store_id,' . Auth::user()->store_id,
        ], [
            'name.unique' => 'Já existe uma impressora com esse nome, nessa loja.',
            'vendor_id.unique' => 'Já existe uma impressora com esse Vendor ID, nessa loja.',
            'product_id.unique' => 'Já existe uma impressora com esse Product ID, nessa loja.',
        ]);

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
}
