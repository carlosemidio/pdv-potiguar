<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\User;
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
        $user = User::find($request->user()->id);

        if (!$user->hasPermission('tables_view', true)) {
            $tablesQuery->where('user_id', $user->id);
        }

        if ($user->tenant_id != null) {
            $tablesQuery->where('tenant_id', $user->tenant_id);
        }

        if ($user->store_id != null) {
            $tablesQuery->where('store_id', $user->store_id);
        }

        if ($search != '') {
            $tablesQuery->where('name', 'like', "%$search%");
        }

        $tables = $tablesQuery->where('status', 'available')
            ->orderBy('name')->take(100)->get(['id', 'name']);

        return response()->json($tables);
    }
}
