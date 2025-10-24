<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuSchedule;
use Illuminate\Http\Request;

class MenuSchedulesController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
        ]);

        $data = $request->only(['menu_id', 'start_at', 'end_at']);
        $menu = Menu::find($data['menu_id']);
        $this->authorize('update', $menu);

        try {
            // Verificar se o ingrediente já está associado ao complemento
            $existingSchedule = MenuSchedule::where('menu_id', $data['menu_id'])
                ->where('start_at', $data['start_at'])
                ->where('end_at', $data['end_at'])
                ->first();

            if ($existingSchedule instanceof MenuSchedule) {
                return redirect()->back()
                    ->with('fail', 'Este horário já está associado a este menu!');
            }

            $menuSchedule = MenuSchedule::updateOrCreate([
                'menu_id' => $data['menu_id'],
                'start_at' => $data['start_at'],
                'end_at' => $data['end_at'],
            ]);

            if (!$menuSchedule) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar horário ao menu.');
            }

            return redirect()->back()
                ->with('success', 'Ingrediente criado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar ingrediente: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $menuSchedule = MenuSchedule::with('menu')->findOrFail($id);
        $this->authorize('update', $menuSchedule->menu);

        try {
            if (!$menuSchedule->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover horário do menu.');
            }

            return redirect()->back()
                ->with('success', 'Horário removido com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover horário: ' . $e->getMessage());
        }
    }
}
