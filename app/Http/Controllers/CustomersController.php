<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class CustomersController extends Controller
{
    protected $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function index()
    {
        $this->authorize('customers_view');

        $request_data = Request::all('category', 'type', 'search', 'field', 'page', 'trashed');
        $customersQuery = $this->customer->query();
        
        if (!request()->user()->hasPermission('customers_view', true)) {
            $customersQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $customersQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if (($request_data['search'] != null) && ($request_data['search'] != '') && ($request_data['field'] != null)) {
            $customersQuery->where($request_data['field'], 'like', '%' . $request_data['search'] . '%');
        }

        if (!empty($request_data['trashed']) && $request_data['trashed'] === 'true') {
            $customersQuery->withTrashed();
        }

        $customers = $customersQuery->orderBy('name')
            ->paginate(12, ['id', 'name', 'email', 'phone', 'type', 'doc', 'created_at', 'updated_at', 'deleted_at'])
            ->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => CustomerResource::collection($customers),
            'filters' => $request_data,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Customer::class);

        return Inertia::render('Customers/Form');
    }

    public function store()
    {
        $this->authorize('create', Customer::class);

        try {
            $data = Request::validate([
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'type' => 'required|string|max:50',
                'doc' => 'nullable|string|max:20',
            ]);

            $user = User::find(Auth::user()->id);
            
            if (!$user || !$user->store_id) {
                return redirect()->back()
                    ->with('fail', 'Usuário não está associado a uma loja válida.');
            }

            $data['user_id'] = $user->id;
            $data['tenant_id'] = $user->tenant_id;

            $customer = $this->customer->create($data);

            if (!$customer) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar cliente.');
            }

            return redirect()->route('customers.index')
                ->with('success', 'Cliente criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar cliente: ' . $e->getMessage());
        }
    }

    public function edit($id)
    {
        $customer = $this->customer->findOrFail($id);

        $this->authorize('update', $customer);

        return Inertia::render('Customers/Form', [
            'customer' => new CustomerResource($customer),
        ]);
    }

    public function update($id)
    {
        $customer = $this->customer->findOrFail($id);

        $this->authorize('update', $customer);

        try {
            $data = Request::validate([
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'type' => 'required|string|max:50',
                'doc' => 'nullable|string|max:20',
            ]);

            if (!$customer->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar cliente.');
            }

            return redirect()->route('customers.index')
                ->with('success', 'Cliente atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar cliente: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $customer = $this->customer->findOrFail($id);

        $this->authorize('delete', $customer);

        try {
            if (!$customer->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover cliente.');
            }

            return redirect()->back()
                ->with('success', 'Cliente removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover cliente: ' . $e->getMessage());
        }
    }

    public function restore(Customer $customer)
    {
        $this->authorize('delete', $customer);

        try {
            if (!$customer->restore()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao restaurar cliente.');
            }

            return redirect()->back()
                ->with('success', 'Cliente restaurado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao restaurar cliente: ' . $e->getMessage());
        }
    }
}
