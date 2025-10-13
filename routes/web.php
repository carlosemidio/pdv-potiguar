<?php

use App\Http\Controllers\AddonGroupOptionsController;
use App\Http\Controllers\AddonIngredientsController;
use App\Http\Controllers\AddonsController;
use App\Http\Controllers\Ajax\AddonsListController;
use App\Http\Controllers\Ajax\BrandListController;
use App\Http\Controllers\AttibuteController;
use App\Http\Controllers\Ajax\CategoryListController;
use App\Http\Controllers\Ajax\ConnectedPrintersController;
use App\Http\Controllers\Ajax\CustomersListController;
use App\Http\Controllers\Ajax\IngredientsListController;
use App\Http\Controllers\Ajax\PrintersListController;
use App\Http\Controllers\Ajax\ProductListController;
use App\Http\Controllers\Ajax\ProductVariantListController;
use App\Http\Controllers\Ajax\StoreProductVariantListController;
use App\Http\Controllers\Ajax\TableListController;
use App\Http\Controllers\Ajax\TenantListController;
use App\Http\Controllers\Ajax\UserListController;
use App\Http\Controllers\BrandsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\IngredientsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderDiscountController;
use App\Http\Controllers\OrderItemsController;
use App\Http\Controllers\OrderPaymentsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PrintersController;
use App\Http\Controllers\PrintJobsController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StoreProductVariantController;
use App\Http\Controllers\TenantsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VariantAddonGroupsController;
use App\Http\Controllers\VariantAddonsController;
use App\Http\Controllers\VariantIngredientsController;
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

    Route::resource('/empresas', TenantsController::class)->names('tenant');
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

    Route::resource('/categorias', CategoriesController::class)
        ->names('categories');

    Route::resource('/marcas', BrandsController::class)
        ->names('brands');

    Route::resource('/ingredientes', IngredientsController::class)
        ->names('ingredients');

    Route::resource('/complementos', AddonsController::class)
        ->names('addons');

    Route::resource('/complemento-ingredientes', AddonIngredientsController::class)
        ->only(['store', 'destroy'])
        ->names('addon-ingredients');
        
    Route::resource('/produtos', ProductController::class)
        ->names('product');

    Route::resource('/variantes-produto', ProductVariantController::class)
        ->names('product-variant');

    Route::resource('/variantes-loja', StoreProductVariantController::class)
        ->names('store-product-variant');

    Route::resource('/variante-ingredientes', VariantIngredientsController::class)
        ->names('variant-ingredients');

    Route::resource('/variante-grupos', VariantAddonGroupsController::class)
        ->only(['store', 'destroy'])
        ->names('variant-addon-groups');

    Route::resource('/grupo-complementos', AddonGroupOptionsController::class)
        ->only(['store', 'destroy'])
        ->names('addon-group-options');

    Route::resource('/variante-complementos', VariantAddonsController::class)
        ->only(['store', 'destroy'])
        ->names('variant-addons');

    Route::resource('/itens-combo', App\Http\Controllers\ComboItemsController::class)
        ->names('combo-items');

    Route::resource('/grupos-opcoes-combo', App\Http\Controllers\ComboOptionGroupsController::class)
        ->names('combo-option-groups');

    Route::resource('/itens-grupos-opcoes-combo', App\Http\Controllers\ComboOptionItemsController::class)
        ->only(['store', 'destroy'])
        ->names('combo-option-items');

    Route::resource('/movimentacoes-estoque', StockMovementController::class)
        ->names('stock-movement');

    Route::resource('/mesas', App\Http\Controllers\TablesController::class)
        ->names('tables');
    
    Route::patch('/mesas/{table}/status', [App\Http\Controllers\TablesController::class, 'updateStatus'])
        ->name('tables.update-status');

    Route::resource('/clientes', CustomersController::class)
        ->names('customers');

    Route::resource('/pedidos', OrdersController::class)
        ->except(['destroy'])
        ->names('orders');

    Route::resource('/impressoras', PrintersController::class)
        ->names('printers');

    Route::post('/print-order/{orderId}/{printerId}', [PrintJobsController::class, 'printOrder'])
        ->name('order.print');

    Route::post('/print-order-items', [PrintJobsController::class, 'printOrderItems'])
        ->name('order.items.print');

    Route::patch('/pedidos/{id}/cancelar', [OrdersController::class, 'cancel'])
        ->name('orders.cancel');

    Route::patch('/pedidos/{id}/rejeitar', [OrdersController::class, 'reject'])
        ->name('orders.reject');

    Route::patch('/pedidos/{id}/enviar', [OrdersController::class, 'ship'])
        ->name('orders.ship');

    Route::patch('/pedidos/{id}/confirmar', [OrdersController::class, 'confirm'])
        ->name('orders.confirm');

    Route::patch('/pedidos/{id}/finish', [OrdersController::class, 'finish'])
        ->name('orders.finish');

    Route::patch('/pedidos/{id}/desconto', [OrderDiscountController::class, 'applyDiscount'])
        ->name('orders.applyDiscount');

    Route::resource('/itens-pedido', OrderItemsController::class)
        ->only(['store', 'destroy'])
        ->names('orders.items');

    Route::patch('/itens-pedido/{id}/status', [OrderItemsController::class, 'nextStatus'])
        ->name('orders.items.nextStatus');

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

    // rota usada no componente select de variantes de produto
    Route::get('search-product-variants-select', [ProductVariantListController::class, 'index'])
        ->name('product-variants-select.search');

    Route::get('search-store-product-variants-select', [StoreProductVariantListController::class, 'index'])
        ->name('store-product-variants-select.search');

    Route::get('search-ingredients-select', [IngredientsListController::class, 'index'])
        ->name('ingredients-select.search');

    Route::get('search-addons-select', [AddonsListController::class, 'index'])
        ->name('addons-select.search');

    Route::get('search-customers-select', [CustomersListController::class, 'index'])
        ->name('customers-select.search');

    Route::get('search-tenants-select', [TenantListController::class, 'index'])
        ->name('tenants-select.search');

    Route::get('search-users-select', [UserListController::class, 'index'])
        ->name('users-select.search');

    // rota para listar impressoras conectadas
    Route::get('search-printers', [PrintersListController::class, 'index'])
        ->name('search-printers');

    Route::resource('/notificacoes', NotificationController::class)->names('notification');
    Route::patch('/notificacoes/{id}/ler', [NotificationController::class, 'markAsRead'])->name('notification.markAsRead');

    Route::delete('files/{id}', [FileController::class, 'destroy'])->name('file.destroy');
    Route::post('files/{id}/set-as-default', [FileController::class, 'setAsDefault'])->name('file.setAsDefault');
});

require __DIR__ . '/auth.php';
