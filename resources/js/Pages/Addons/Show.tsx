import AddonIngredientDeleteFormModal from '@/Components/AddonIngredientDeleteFormModal';
import AddonIngredientFormModal from '@/Components/AddonIngredientFormModal';
import Card from '@/Components/Card';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Addon } from '@/types/Addon';
import { Unit } from '@/types/Unit';
import { Head, Link } from '@inertiajs/react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({
    auth,
    addon,
    units
}: PageProps<{ addon: { data: Addon }, units: { data: Unit[] } }>) {
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    const [isIngredientDeleteModalOpen, setIsIngredientDeleteModalOpen] = useState(false);
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {addon?.data?.name || 'N/A'}
                </h2>
            }
        >
            <Head title="Produtos" />
            <section className='px-2 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto">
                    <div className="mb-4">
                        <Link href={route('addons.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <Card key={addon?.data?.id} className="p-3 relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                        <h3 className='text-base font-bold mb-2 text-blue-700 dark:text-blue-300'>Detalhes</h3>
                        <div className="mb-2 text-xs">
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">Nome</span>
                                <span className="font-semibold">{addon?.data?.name || 'N/A'}</span>
                            </div>
                        
                            <div className="flex flex-col gap-0 mt-1">
                                <span className="block text-[10px] text-gray-500 dark:text-gray-400">Criado em</span>
                                <span className="text-xs text-gray-700 dark:text-gray-300">
                                    {addon?.data?.created_at
                                        ? new Date(addon.data.created_at).toLocaleDateString('pt-BR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                        </div>

                        <h3 className='text-base font-bold mb-2 text-blue-700 dark:text-blue-300'>Ingredientes</h3>
                        {addon?.data?.addon_ingredients && addon.data.addon_ingredients.length > 0 ? (
                            <div className='space-y-2 max-h-96 overflow-y-auto pr-1'>
                                {addon.data.addon_ingredients.map((addonIngredient) => (
                                    <div key={addonIngredient.id} className='flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded p-2'>
                                        <div>
                                            <p className='font-semibold text-sm'>{addonIngredient.ingredient?.name || 'N/A'}</p>
                                            <p className='text-xs text-gray-600 dark:text-gray-400'>
                                                {addonIngredient.quantity} ({addonIngredient.unit ? addonIngredient.unit.symbol : ''})
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => setIsIngredientDeleteModalOpen(true)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-sm text-gray-600 dark:text-gray-400'>Nenhum ingrediente adicionado.</p>
                        )}

                        <div className="mt-3 flex justify-start items-center gap-2">
                            <SecondaryButton onClick={() => setIsIngredientDeleteModalOpen(true)}>
                                <Trash2 className="w-4 h-4 mr-1 inline text-red-700 dark:text-red-300" />
                                Remover
                            </SecondaryButton>

                            <SecondaryButton onClick={() => setIsIngredientModalOpen(true)}>
                                <PlusCircle className="w-4 h-4 mr-1 inline text-blue-700 dark:text-blue-300" />
                            </SecondaryButton>
                        </div>

                        <AddonIngredientFormModal
                            isOpen={isIngredientModalOpen}
                            onClose={() => setIsIngredientModalOpen(false)}
                            addon_id={addon?.data?.id ?? 0}
                            units={units.data}
                            addonIngredient={null}
                        />

                        {addon?.data.addon_ingredients && addon.data.addon_ingredients.length > 0 && (
                            <AddonIngredientDeleteFormModal
                                isOpen={isIngredientDeleteModalOpen}
                                onClose={() => setIsIngredientDeleteModalOpen(false)}
                                addonIngredients={addon.data.addon_ingredients}
                            />
                        )}
                    </Card>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}