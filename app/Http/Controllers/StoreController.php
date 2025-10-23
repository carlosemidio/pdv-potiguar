<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCreateFormRequest;
use App\Http\Requests\StoreUpdateFormRequest;
use App\Http\Resources\StoreResource;
use App\Models\File;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('stores_view');
        $storesQuery = Store::with(['user', 'city']);

        if (!request()->user()->hasPermission('customers_view', true)) {
            $storesQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $storesQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $storesQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $stores = $storesQuery->orderBy('name')
            ->paginate(10)->withQueryString();

        return Inertia::render('Store/Index', [
            'stores' => StoreResource::collection($stores),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Store::class);
     
        return Inertia::render('Store/Edit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCreateFormRequest $request)
    {
        $this->authorize('create', Store::class);
        $dataForm = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'domain' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => 'required|in:0,1',
            'is_default' => 'sometimes|boolean',
            'layout' => 'nullable|string|max:255',
            'files.*' => 'sometimes|file|mimes:jpg,jpeg,png,gif,pdf,doc,docx|max:2048',
            'address' => 'sometimes|array',
            'address.street' => 'sometimes|string|max:255',
            'address.number' => 'sometimes|string|max:50',
            'address.complement' => 'sometimes|string|max:255',
            'address.neighborhood' => 'sometimes|string|max:255',
            'address.zipcode' => 'sometimes|string|max:20',
            'address.city_id' => 'sometimes|exists:cities,id',
            'address.state' => 'sometimes|string|max:100',
            'address.country' => 'sometimes|string|max:100',
        ], [
            'city_id.required' => 'A cidade é obrigatória.',
            'city_id.exists' => 'A cidade selecionada é inválida.',
            'name.required' => 'O nome da loja é obrigatório.',
            'email.email' => 'O e-mail informado é inválido.',
            'status.in' => 'O status selecionado é inválido.',
            'files.*.mimes' => 'Os arquivos devem ser do tipo: jpg, jpeg, png, gif, pdf, doc, docx.',
            'files.*.max' => 'O tamanho máximo permitido para os arquivos é 2MB.',
        ]);

        $user = User::find($dataForm['user_id']);
        $dataForm['user_id'] = $user->id;
        $dataForm['tenant_id'] = $user->tenant_id;

        try {
            $store = Store::create($dataForm);

            if ($store instanceof Store) {

                if ($dataForm['files']) {
                    foreach ($dataForm['files'] as $file) {
                        $uploadedFilePath = upload_file($file, '/stores/' . $store->slug, true);

                        if ($uploadedFilePath) {
                            $uploadedFile = new File([
                                'user_id' => $request->user()->id,
                                'name' => $file->getClientOriginalName(),
                                'size' => $file->getSize(),
                                'url' => $uploadedFilePath,
                                'extension' => $file->extension(),
                                'public' => false,
                            ]);
                            
                            $store->images()->save($uploadedFile);   
                        }
                    }
                }

                if ($dataForm['address']) {
                    $store->address()->create($dataForm['address']);
                }

                session()->forget('user');
                session()->forget('user_permissions');

                return redirect()->route('store.index')
                    ->with('success', 'Loja criada com sucesso.');
            }

            return redirect()->back()
                ->with('fail', 'Erro ao criar loja.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao criar loja: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $store = Store::where('id', $id)->firstOrFail();
        $this->authorize('view', $store);

        $store->load('user', 'city', 'image', 'images');

        return Inertia::render('Store/Show', [
            'store' => new StoreResource($store),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $store = Store::where('id', $id)->firstOrFail();
        $this->authorize('update', $store);

        $store->load('user', 'city', 'image', 'images', 'address');

        return Inertia::render('Store/Edit', [
            'store' => new StoreResource($store),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUpdateFormRequest $request, $id)
    {
        $store = Store::where('id', $id)->firstOrFail();
        $this->authorize('update', $store);
        $dataForm = $request->all();

        try {
            $store->update($dataForm);

            if ($dataForm['files']) {
                foreach ($dataForm['files'] as $file) {
                    $uploadedFilePath = upload_file($file, '/stores/' . $store->slug, true);

                    if ($uploadedFilePath) {
                        $uploadedFile = new File([
                            'user_id' => $request->user()->id,
                            'name' => $file->getClientOriginalName(),
                            'size' => $file->getSize(),
                            'url' => $uploadedFilePath,
                            'extension' => $file->extension(),
                            'public' => false,
                        ]);
                        
                        $store->images()->save($uploadedFile);   
                    }
                }
            }

            if ($dataForm['address']) {
                if ($store->address) {
                    $store->address->update($dataForm['address']);
                } else {
                    $store->address()->create($dataForm['address']);
                }
            }
        
            return redirect()->route('store.index')
                ->with('success', 'Loja atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar loja: ' . $e->getMessage());
        }
    }

    public function setDefault($id)
    {
        $store = Store::where('id', $id)->firstOrFail();
        $this->authorize('update', $store);

        $updated = DB::transaction(function () use ($store) {
            $store->is_default = true;

            Store::where('user_id', $store->user_id)
                ->where('id', '!=', $store->id)
                ->update(['is_default' => false]);

            session()->forget('user');

            return $store->save();
        });

        if ($updated) {
            return redirect()->back()
                ->with('success', 'Loja definida como padrão com sucesso.');
        } else {
            return redirect()->back()
                ->with('fail', 'Erro ao definir loja como padrão.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $store = Store::where('id', $id)->firstOrFail();
        $this->authorize('delete', $store);

        if ($store->delete()) {
            return redirect()->back()
                ->with('success', 'Loja excluída com sucesso.');
        } else {
            return redirect()->back()
                ->with('fail', 'Erro ao excluir loja.');
        }
    }
}
