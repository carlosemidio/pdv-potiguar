<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomersController extends Controller
{
    protected $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function index(Request $request)
    {
        $this->authorize('customers_view');

        $search = $request->search ?? '';
        $customersQuery = $this->customer->query();
        $user = User::find(Auth::user()->id);

        if ($search != '') {
            $customersQuery->where('name', 'like', "%$search%");
        }

        if (!$user->hasPermission('customers_view', true)) {
            // Lojista só vê seus próprios clientes
            $customersQuery->where('user_id', $user->id);
        }

        $customers = $customersQuery->orderBy('name')
            ->paginate(12, ['id', 'name', 'email', 'phone', 'type', 'doc']);

        return Inertia::render('Customers/Index', [
            'customers' => CustomerResource::collection($customers),
            'search' => $search,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Customer::class);

        return Inertia::render('Customers/Form');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Customer::class);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'type' => 'required|string|max:50',
                'doc' => 'nullable|string|max:20',
            ]);

            $user = User::with('store')->find(Auth::user()->id);
            
            if (!$user || !$user->store) {
                return redirect()->back()
                    ->with('fail', 'Usuário não está associado a uma loja válida.');
            }

            $data['user_id'] = $user->id;
            $data['store_id'] = $user->store->id;

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

    public function update(Request $request, $id)
    {
        $customer = $this->customer->findOrFail($id);

        $this->authorize('update', $customer);

        try {
            $data = $request->validate([
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

            return redirect()->route('customers.index')
                ->with('success', 'Cliente removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover cliente: ' . $e->getMessage());
        }
    }
}
