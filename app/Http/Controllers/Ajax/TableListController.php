<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;

class TableListController extends Controller
{
    protected $table;

    public function __construct( Table $table ) {
        $this->table = $table;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $tablesQuery = $this->table->query();

        if ($search != '') {
            $tablesQuery->where('name', 'like', "%$search%");
        }

        $tables = $tablesQuery->where('status', 'available')
            ->orderBy('name')->take(100)->get(['id', 'name']);

        return response()->json($tables);
    }
}
