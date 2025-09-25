import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import Dropdown from "@/Components/Dropdown";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Role } from "@/types/Role";
import { can } from "@/utils/authorization";
import { Head, Link, useForm } from "@inertiajs/react";
import { Edit, Eye, Trash, Plus, MoreVertical } from "lucide-react";
import { useState } from "react";
import { formatCustomDateTime } from "@/utils/date-format";

export default function Index({
    auth,
    roles,
}: PageProps<{ roles: { data: Role[] } }>) {
    const [confirmingRoleDeletion, setConfirmingRoleDeletion] = useState(false);
    const [roleIdToDelete, setRoleIdToDelete] = useState<number | null>(null);

    const { delete: destroy, processing, reset, clearErrors } = useForm();

    const confirmRoleDeletion = (id: number) => {
        setRoleIdToDelete(id);
        setConfirmingRoleDeletion(true);
    };

    const deleteUser = () => {
        destroy(route("role.destroy", { id: roleIdToDelete }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingRoleDeletion(false);
        setRoleIdToDelete(null);
        clearErrors();
        reset();
    };

    const roleToDelete = roles.data.find((role) => role.id === roleIdToDelete);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Funções
                </h2>
            }
        >
            <Head title="Funções" />

            <section className="px-3 text-gray-800 dark:text-gray-200">
                <div className="max-w-5xl">
                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-6'>
                        {roles.data.map((role) => (
                            <li key={role.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="flex items-center justify-between gap-2 relative p-2 pr-10">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className='min-w-0 flex-1'>
                                            <div className="flex items-center gap-2">
                                                <p className='font-semibold text-sm truncate'>{role.display_name}</p>
                                            </div>
                                            <div className='mt-1 flex flex-wrap items-end gap-1.5 text-[11px] text-gray-700 dark:text-gray-300'>
                                                <span className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]'>
                                                    {role.name}
                                                </span>
                                                {role.created_at && (
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">
                                                        {formatCustomDateTime(role.created_at)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 absolute top-1 right-1'>
                                        {(can('roles_view') || can('roles_edit') || can('roles_delete')) && (
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <SecondaryButton size='sm' className='!px-2 !py-1' title='Ações'>
                                                        <MoreVertical className='w-4 h-4' />
                                                    </SecondaryButton>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align='right' width='48'>
                                                    {can('roles_view') && (
                                                        <Dropdown.Link href={route('role.show', { id: role.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Eye className='w-4 h-4' /> Ver detalhes
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {can('roles_edit') && (
                                                        <Dropdown.Link href={route('role.edit', { id: role.id })}>
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Edit className='w-4 h-4' /> Editar
                                                            </span>
                                                        </Dropdown.Link>
                                                    )}
                                                    {can('roles_delete') && (
                                                        <button
                                                            type='button'
                                                            onClick={() => confirmRoleDeletion(role.id)}
                                                            className='block w-full px-4 py-2 text-start text-sm leading-5 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 focus:outline-none'
                                                        >
                                                            <span className='inline-flex items-center gap-2'>
                                                                <Trash className='w-4 h-4' /> Excluir
                                                            </span>
                                                        </button>
                                                    )}
                                                </Dropdown.Content>
                                            </Dropdown>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {can("roles_create") && (
                <Link href={route("role.create")}>
                    <button
                        aria-label="Nova função"
                        className="fixed bottom-16 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </Link>
            )}

            {roleToDelete && (
                <Modal show={confirmingRoleDeletion} onClose={closeModal}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            deleteUser();
                        }}
                        className="p-6"
                    >
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Tem certeza que deseja deletar a função{" "}
                            {roleToDelete.display_name}?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Uma vez que a função é deletada, todos os seus
                            recursos e dados serão permanentemente deletados.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton
                                className="ms-3"
                                disabled={processing}
                            >
                                Deletar Função
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
