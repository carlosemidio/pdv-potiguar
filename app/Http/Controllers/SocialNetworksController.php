<?php

namespace App\Http\Controllers;

use App\Models\SocialNetwork;
use App\Models\Table;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SocialNetworksController extends Controller
{
    protected $socialNetwork;

    public function __construct(SocialNetwork $socialNetwork)
    {
        $this->socialNetwork = $socialNetwork;
    }

    public function store(Request $request)
    {
        $user = User::with('store')->find(Auth::user()->id);

        if (!$user || !$user->store) {
            return redirect()->back()
                ->with('fail', 'Usuário ou loja não encontrado.');
        }

        $this->authorize('update', $user->store);
        
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:255'
        ]);

        try {
            $data['user_id'] = $user->id;
            $data['store_id'] = $user->store_id;
            $data['tenant_id'] = $user->tenant_id;

            $socialNetwork = $this->socialNetwork->create($data);

            if (!$socialNetwork) {
                return redirect()->back()
                    ->with('fail', 'Erro ao cadastrar rede social.');
            }

            return redirect()->route('store.show', $user->store_id)
                ->with('success', 'Rede social cadastrada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar rede social: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $socialNetwork = $this->socialNetwork->with('store')->findOrFail($id);

        $this->authorize('update', $socialNetwork->store);

        try {
            if (!$socialNetwork->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover rede social.');
            }

            return redirect()->route('store.show', $socialNetwork->store_id)
                ->with('success', 'Rede social removida com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover rede social: ' . $e->getMessage());
        }
    }
}
