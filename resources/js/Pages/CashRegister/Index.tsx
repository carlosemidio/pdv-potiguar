import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import CashRegister from '@/types/CashRegister';
import CashRegisterList from '@/Components/CashRegisterList';
import { TbCash } from 'react-icons/tb';
import { useState } from 'react';
import CashRegisterFormModal from '@/Components/CashRegisterFormModal';
import Pagination from '@/Components/Pagination/Pagination';

export default function Index({
    auth,
    cashRegisters,
    openedCashRegister,
}: PageProps<{ cashRegisters: PaginatedData<CashRegister>; openedCashRegister: { data: CashRegister } | null }>) {
    const {
        meta: { links },
    } = cashRegisters;

    const [openCashRegisterModal, setOpenCashRegisterModal] = useState(false);
    const [closeCashRegisterModal, setCloseCashRegisterModal] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                            <TbCash className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Caixa
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Acompanhe as aberturas e fechamentos de caixa do seu estabelecimento.
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Marcas" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container px-4 max-w-7xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TbCash className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Histórico de abertura e fechamento de caixas
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {openedCashRegister && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                                <CashRegisterFormModal
                                    isOpen={closeCashRegisterModal}
                                    onClose={() => setCloseCashRegisterModal(false)}
                                    registerId={openedCashRegister.data.id}
                                />
                                
                                <div className="p-4 md:p-6 flex justify-end">
                                    {openedCashRegister && (
                                        <button
                                            onClick={() => setCloseCashRegisterModal(true)}
                                            className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                        >
                                            Fechar Caixa
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {!openedCashRegister && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                                <CashRegisterFormModal
                                    isOpen={openCashRegisterModal}
                                    onClose={() => setOpenCashRegisterModal(false)}
                                />
                                
                                <div className="p-4 md:p-6 flex justify-end">
                                    {!openedCashRegister && (
                                        <button
                                            onClick={() => setOpenCashRegisterModal(true)}
                                            className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        >
                                            Abrir Caixa
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="p-6">
                            {cashRegisters?.data?.length > 0 ? (
                                <div className="w-full gap-6">
                                    <CashRegisterList
                                        registers={cashRegisters.data}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Award className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                Nenhum caixa registrado
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Ainda não há caixas registrados no sistema.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Pagination links={links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
