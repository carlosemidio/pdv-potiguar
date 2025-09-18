<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserListController extends Controller
{
    protected $user;

    public function __construct(User $user) {
        $this->user = $user;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $usersQuery = $this->user->query();

        if ($search != '') {
            $usersQuery->where('name', 'like', "%$search%");
        }

        $users = $usersQuery->orderBy('name')->take(100)
            ->get(['id', 'name']);

        return response()->json($users);
    }
}
