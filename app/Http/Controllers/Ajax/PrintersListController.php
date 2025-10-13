<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Printer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrintersListController extends Controller
{
    protected $printer;

    public function __construct(Printer $printer)
    {
        $this->printer = $printer;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $printersQuery = $this->printer->query();

        if (!request()->user()->hasPermission('printers_view', true)) {
            $printersQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $printersQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $printersQuery->where('name', 'like', "%$search%");
        }

        $printers = $printersQuery->orderBy('name')->get();

        return response()->json($printers);
    }
}
