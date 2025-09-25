<?php

namespace App\Http\Controllers;

use App\Http\Resources\TenantResource;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TenantsController extends Controller
{
    protected $tenant;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    public function index(Request $request)
    {
        $this->authorize('tenants_view');

        $search = $request->search ?? '';
        $tenantsQuery = $this->tenant->query();

        if ($search != '') {
            $tenantsQuery->where('name', 'like', "%$search%");
        }

        $tenants = $tenantsQuery->orderBy('name')
            ->paginate(12, ['id', 'name', 'domain', 'status', 'created_at', 'updated_at'])
            ->withQueryString();

        return Inertia::render('Tenants/Index', [
            'tenants' => TenantResource::collection($tenants),
            'search' => $search,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Tenant::class);

        return Inertia::render('Tenants/Form');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Tenant::class);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'domain' => 'nullable|string|max:255|unique:tenants,domain',
                'status' => 'required|in:0,1',
            ]);

            $data['user_id'] = Auth::user()->id;

            $tenant = $this->tenant->create($data);

            if (!$tenant) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar inquilino.');
            }

            return redirect()->route('tenant.index')
                ->with('success', 'Empresa criada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar empresa: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $tenant = $this->tenant->findOrFail($id);

        $this->authorize('update', $tenant);

        return Inertia::render('Tenants/Form', [
            'tenant' => new TenantResource($tenant),
        ]);
    }

    public function update(Request $request, $id)
    {
        $tenant = $this->tenant->findOrFail($id);

        $this->authorize('update', $tenant);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'domain' => 'nullable|string|max:255|unique:tenants,domain,' . $tenant->id,
                'status' => 'required|in:0,1',
            ]);

            if (!$tenant->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar empresa.');
            }

            return redirect()->route('tenant.index')
                ->with('success', 'Empresa atualizada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar empresa: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $tenant = $this->tenant->findOrFail($id);

        $this->authorize('delete', $tenant);

        try {
            if (!$tenant->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover empresa.');
            }

            return redirect()->route('tenant.index')
                ->with('success', 'Inquilino removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover inquilino: ' . $e->getMessage());
        }
    }
}

