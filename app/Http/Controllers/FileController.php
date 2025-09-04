<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\File;

class FileController extends Controller
{
    public function destroy(Request $request)
    {
        $file = File::findOrfail($request->id);

        if ($file->delete()) {
            return redirect()->back()->with('success', 'Arquivo excluído com sucesso!');
        } else {
            return redirect()->back()->with('error', 'Erro ao excluir arquivo!');
        }
    }

    public function setAsDefault(Request $request)
    {
        $file = File::findOrfail($request->id);

        File::where('fileable_id', $file->fileable_id)
            ->where('fileable_type', $file->fileable_type)
            ->update(['is_default' => false]);
            
        $file->is_default = true;

        if ($file->save()) {
            session()->forget('user');
            session()->forget('user_permissions');

            return redirect()->back()->with('success', 'Arquivo definido como padrão com sucesso!');
        } else {
            return redirect()->back()->with('error', 'Erro ao definir arquivo como padrão!');
        }
    }
}