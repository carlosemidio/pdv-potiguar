<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuDay;
use Illuminate\Http\Request;

class MenuDaysController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'weekday' => 'required|integer|min:0|max:6',
            'opens_at' => 'required|date_format:H:i',
            'closes_at' => 'required|date_format:H:i|after:opens_at',
        ]);

        $data = $request->only(['menu_id', 'weekday', 'opens_at', 'closes_at']);
        $menu = Menu::find($data['menu_id']);
        $this->authorize('update', $menu);

        try {
            // Verificar se o horário já está associado ao menu
            $existingDay = MenuDay::where('menu_id', $data['menu_id'])
                ->where('weekday', $data['weekday'])
                ->first();

            if ($existingDay) {
                $existingDay->opens_at = $data['opens_at'];
                $existingDay->closes_at = $data['closes_at'];
                $existingDay->save();

                return redirect()->back()
                    ->with('success', 'Dia e horário atualizados com sucesso!');
            }

            $menuDay = MenuDay::create([
                'menu_id' => $data['menu_id'],
                'weekday' => $data['weekday'],
                'opens_at' => $data['opens_at'],
                'closes_at' => $data['closes_at'],
            ]);

            if (!$menuDay) {
                return redirect()->back()
                    ->with('fail', 'Erro ao adicionar dia e horário ao menu.');
            }

            return redirect()->back()
                ->with('success', 'Dia e horário criados com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar dia e horário: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $menuDay = MenuDay::with('menu')->findOrFail($id);
        $this->authorize('update', $menuDay->menu);

        try {
            if (!$menuDay->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover dia e horário do menu.');
            }

            return redirect()->back()
                ->with('success', 'Dia e horário removidos com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover dia e horário: ' . $e->getMessage());
        }
    }
}
