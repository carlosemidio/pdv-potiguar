<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Company;
use App\Models\Contributor;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CityController extends Controller
{

    protected $city;

    public function __construct( City $city ) {
        $this->city = $city;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $citiesQuery = $this->city->query();

        if ($search != '') {
            $citiesQuery->where('name', 'like', "%$search%")
                ->orWhere('code', 'like', "%$search%");
        }

        $statesCodes = config('statesCodes');

        $cities = $citiesQuery->orderBy('code')->orderBy('name')->take(100)
            ->get(['id', 'name', 'uf'])
            ->map(function ($city) use ($statesCodes) {
                $city->name = $city->name . '/' . $statesCodes[$city->uf] ?? $city->uf;
                return $city;
            });

        return response()->json($cities);
    }
}
