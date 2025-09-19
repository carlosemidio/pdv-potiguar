import Card from "@/Components/Card";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Role } from "@/types/Role";
import { can } from "@/utils/authorization";
import { Head, Link, useForm } from "@inertiajs/react";
import { Edit, Eye, Trash, Plus } from "lucide-react";
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
                <div className="mx-auto lg:px-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">
                        {roles.data.map((role) => (
                            <Card key={role.id} className="p-3 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <p className="font-semibold text-base truncate">{role.display_name}</p>
                                <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="text-gray-600 dark:text-gray-400">Código: </span>
                                    <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">{role.name}</span>
                                </div>
                                {role.created_at && (
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Criada em: {formatCustomDateTime(role.created_at)}
                                    </div>
                                )}

                                <div className="flex gap-1.5 mt-2 justify-end">
                                    {can("roles_delete") && (
                                        <DangerButton size="sm"
                                            onClick={() =>
                                                confirmRoleDeletion(role.id)
                                            }
                                            title="Excluir função"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </DangerButton>
                                    )}

                                    {can("roles_edit") && (
                                        <Link
                                            href={route("role.edit", {
                                                id: role.id,
                                            })}
                                        >
                                            <SecondaryButton size="sm" title="Editar função">
                                                <Edit className="w-4 h-4" />
                                            </SecondaryButton>
                                        </Link>
                                    )}

                                    {can("roles_view") && (
                                        <Link
                                            href={route("role.show", {
                                                id: role.id,
                                            })}
                                        >
                                            <PrimaryButton size="sm" title="Ver função">
                                                <Eye className="w-4 h-4" />
                                            </PrimaryButton>
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {can("roles_create") && (
                <Link href={route("role.create")}>
                    <button
                        aria-label="Nova função"
                        className="fixed bottom-14 right-4 z-40 inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 w-12 md:h-14 md:w-14"
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
