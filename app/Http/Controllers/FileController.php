<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\File;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function destroy(Request $request)
    {
        $file = File::findOrfail($request->id);

        if ($file->delete()) {
            // Verificar se o arquivo está armazenado localmente ou na aws s3
            if (Storage::disk('public')->exists($file->url)) {
                Storage::disk('public')->delete($file->url);
            } elseif (Storage::disk('spaces')->exists($file->url)) {
                Storage::disk('spaces')->delete($file->url);
            }

            session()->forget('user');
            session()->forget('user_permissions');

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