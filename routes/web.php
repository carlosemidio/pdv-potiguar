<?php

use App\Http\Controllers\AddonsController;
use App\Http\Controllers\Ajax\AddonsListController;
use App\Http\Controllers\Ajax\BrandListController;
use App\Http\Controllers\AttibuteController;
use App\Http\Controllers\Ajax\CategoryListController;
use App\Http\Controllers\Ajax\CustomersListController;
use App\Http\Controllers\Ajax\ProductListController;
use App\Http\Controllers\Ajax\ProductVariantListController;
use App\Http\Controllers\Ajax\TableListController;
use App\Http\Controllers\BrandsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderPaymentsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
    return redirect('/login');
})->name('home');


Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::resource('/profile', ProfileController::class)->only(['update', 'destroy']);

    Route::resource('/funcoes', RoleController::class)->names('role');
    Route::resource('/permissoes', PermissionController::class)->names('permission');
    Route::resource('/usuarios', UserController::class)->only(['index', 'create', 'store', 'update'])->names('user');
    
    Route::get('/usuarios/{uuid}/edit', [UserController::class, 'edit'])->name('user.edit');
    Route::get('/usuarios/{uuid}/show', [UserController::class, 'show'])->name('user.show');
    Route::patch('usuarios/{uuid}/status', [
        UserController::class,
        'status'
    ])->name('user.status');

    Route::post('/usuarios/{uuid}/loginAs', [UserController::class, 'loginAs'])
        ->name('user.loginAs');

    Route::get('/usuarios/{uuid}/resetPassword', [UserController::class, 'resetPassword'])
        ->name('user.resetPassword');

    Route::get('/usuarios/{uuid}/changePassword', [UserController::class, 'changePassword'])
        ->name('user.changePassword');

    Route::resource('/lojas', StoreController::class)->names('store');
    Route::patch('/lojas/{id}/status', [StoreController::class, 'status'])->name('store.status');
    Route::get('/lojas/{id}/select', [StoreController::class, 'setDefault'])
        ->name('store.select');
        
    Route::resource('/produtos', ProductController::class)
        ->names('product');

    Route::resource('/complementos', AddonsController::class)
        ->names('addons');

    Route::resource('/categorias', CategoriesController::class)
        ->names('categories');

    Route::resource('/marcas', BrandsController::class)
        ->names('brands');

    Route::resource('/mesas', App\Http\Controllers\TablesController::class)
        ->names('tables');

    Route::resource('/clientes', CustomersController::class)
        ->names('customers');

    Route::resource('/pedidos', OrdersController::class)
        ->except(['destroy'])
        ->names('orders');

    Route::patch('/pedidos/{id}/cancelar', [OrdersController::class, 'cancel'])
        ->name('orders.cancel');

    Route::patch('/pedidos/{id}/finish', [OrdersController::class, 'finish'])
        ->name('orders.finish');

    Route::resource('/itens-pedido', App\Http\Controllers\OrderItemsController::class)
        ->only(['store', 'destroy'])
        ->names('orders.items');

    Route::post('/pagamentos', [OrderPaymentsController::class, 'store'])
        ->name('payments.store');

    Route::delete('/pagamentos/{id}', [OrderPaymentsController::class, 'destroy'])
        ->name('payments.destroy');

    // rota usada no componente select de cidades
    Route::get('search-cities-select', [CityController::class, 'index'])
        ->name('cities-select.search');

    // rota usada no componente select de categorias
    Route::get('search-categories-select', [CategoryListController::class, 'index'])
        ->name('categories-select.search');

    // rota usada no componente select de marcas
    Route::get('search-brands-select', [BrandListController::class, 'index'])
        ->name('brands-select.search');

    Route::get('search-attributes-select', [AttibuteController::class, 'index'])
        ->name('attributes-select.search');

    Route::get('search-tables-select', [TableListController::class, 'index'])
        ->name('tables-select.search');

    Route::get('search-products-select', [ProductListController::class, 'index'])
        ->name('products-select.search');

    Route::get('search-addons-select', [AddonsListController::class, 'index'])
        ->name('addons-select.search');

    Route::get('search-customers-select', [CustomersListController::class, 'index'])
        ->name('customers-select.search');

    Route::resource('/notificacoes', NotificationController::class)->names('notification');
    Route::patch('/notificacoes/{id}/ler', [NotificationController::class, 'markAsRead'])->name('notification.markAsRead');

    Route::delete('files/{id}', [FileController::class, 'destroy'])->name('file.destroy');
    Route::post('files/{id}/set-as-default', [FileController::class, 'setAsDefault'])->name('file.setAsDefault');
});

require __DIR__ . '/auth.php';
