import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Eye, Trash, Search, Eraser, Plus } from 'lucide-react';
import { useState } from 'react';
import { can } from '@/utils/authorization';
import { formatCustomDateTime } from '@/utils/date-format';
import Pagination from '@/Components/Pagination/Pagination';
import { StockMovement } from '@/types/StockMovement'; // Troque para o tipo correto

export default function Index({
    auth,
    stockMovements, // Renomeie para refletir movimentações de estoque
    filters,
}: PageProps<{ stockMovements: PaginatedData<StockMovement>, filters: { search?: string; date_from?: string; date_to?: string } }>) {
    // form para deleção
    const { delete: destroy, processing: processingDelete, reset, clearErrors } = useForm();

    // form para filtros
    const { data: filterData, setData: setFilterData, get: getFilters } = useForm({
        search: filters?.search || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
    });

    const [showModal, setShowModal] = useState(false);
    const [movement, setMovement] = useState<StockMovement | null>(null);

    const handleDeleteClick = (movement: StockMovement) => {
        setMovement(movement);
        setShowModal(true);
    };

    const deleteMovement = () => {
        destroy(route('stock-movement.destroy', { id: movement?.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setMovement(null);
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        clearErrors();
        reset();
    };

    const { data: items, meta } = stockMovements;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Movimentação de Estoque
                </h2>
            }
        >
            <Head title="Movimentação de Estoque" />

            <section className='py-2 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-2">
                    <div className="mb-6">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col md:flex-row md:items-end gap-4 border border-gray-200 dark:border-gray-700">
                            <form className="flex flex-col md:flex-row gap-4 w-full" onSubmit={(e) => { e.preventDefault(); getFilters(route('stock-movement.index'), { preserveState: true }); }}>
                                <div className="flex flex-col min-w-[220px]">
                                    <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Busca (produto)</label>
                                    <input
                                        type="text"
                                        className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                        id="search"
                                        value={filterData.search}
                                        onChange={e => setFilterData('search', e.target.value)}
                                        placeholder="Ex.: Coca-Cola"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex flex-col min-w-[140px]">
                                        <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">Data de</label>
                                        <input
                                            type="date"
                                            className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                            id="date_from"
                                            value={filterData.date_from}
                                            onChange={e => setFilterData('date_from', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-[140px]">
                                        <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">até</label>
                                        <input
                                            type="date"
                                            className="border rounded px-2 py-1 w-full focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                                            id="date_to"
                                            value={filterData.date_to}
                                            onChange={e => setFilterData('date_to', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 items-end">
                                    <PrimaryButton type="submit" className="mt-2 inline-flex items-center gap-2">
                                        <Search className="w-4 h-4" />
                                        Filtrar
                                    </PrimaryButton>
                                    <SecondaryButton type="button" onClick={() => { window.location.href = route('stock-movement.index'); }} className="mt-2 inline-flex items-center gap-2">
                                        <Eraser className="w-4 h-4" />
                                        Limpar
                                    </SecondaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    {can('stock-movements_create') && (
                        <Link href={route('stock-movement.create')} className="fixed bottom-14 right-6 z-10">
                            <PrimaryButton className="rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg">
                                <Plus className="w-6 h-6" />
                            </PrimaryButton>
                        </Link>
                    )}
                    
                    <div className="mt-4">
                        {items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {items.map((item) => (
                                    <div key={item.id} className="relative p-3 pl-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                        <span className={`absolute left-0 top-0 h-full w-1 ${item.type === 'in' ? 'bg-green-500' : 'bg-red-500'}`} />

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {item?.store_product_variant?.product_variant?.name || 'Sem produto'}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                                                    <span className={`px-2 py-0.5 rounded-full font-medium ${item.type === 'in' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                        {item.type === 'in' ? 'Entrada' : 'Saída'}
                                                    </span>
                                                    {item.subtype && (
                                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                            {item.subtype}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatCustomDateTime(item.created_at)}
                                            </p>
                                        </div>

                                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                                            {item.store && (
                                                <p>
                                                    <span className="font-medium">Loja:</span> {item.store.name}
                                                </p>
                                            )}
                                            {item.user && (
                                                <p>
                                                    <span className="font-medium">Usuário:</span> {item.user.name}
                                                </p>
                                            )}
                                            {item.tenant && (
                                                <p>
                                                    <span className="font-medium">Empresa:</span> {item.tenant.name}
                                                </p>
                                            )}
                                            {item.document_number && (
                                                <p>
                                                    <span className="font-medium">Documento:</span> {item.document_number}
                                                </p>
                                            )}
                                            <p>
                                                <span className="font-medium">Preço de custo:</span> R$ {item.cost_price}
                                            </p>
                                            <p>
                                                <span className="font-medium">Quantidade:</span> {item.quantity}
                                            </p>
                                            {item.reason && (
                                                <p className="sm:col-span-2">
                                                    <span className="font-medium">Motivo:</span> {item.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                Nenhuma movimentação cadastrada.
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <Pagination links={meta.links} />
                    </div>
                </div>
            </section>
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={(e) => { e.preventDefault(); deleteMovement(); }} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Tem certeza que deseja deletar esta movimentação?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Uma vez que a movimentação é deletada, todos os seus dados serão permanentemente removidos.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton type="submit" className="ms-3" disabled={processingDelete}>
                            Deletar movimentação
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    )
}
