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
import { Edit, Eye, Trash } from "lucide-react";
import { useState } from "react";

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
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Funções
                </h2>
            }
        >
            <Head title="Funções" />

            <section className="py-12 px-4 text-gray-800 dark:text-gray-200">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="flex justify-end">
                        {can("roles_create") && (
                            <Link href={route("role.create")}>
                                <PrimaryButton>Nova Função</PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                        {roles.data.map((role) => (
                            <Card key={role.id}>
                                <p className="font-semibold">
                                    {role.display_name}
                                </p>
                                <div className="mt-3 space-y-2">
                                    <div className="">
                                        <p className="text-sm">Código</p>
                                        <span className="bg-gray-100 rounded-lg p-1 text-sm dark:bg-gray-700">
                                            {role.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-2 justify-end">
                                    {can("roles_delete") && (
                                        <DangerButton
                                            onClick={() =>
                                                confirmRoleDeletion(role.id)
                                            }
                                        >
                                            <Trash className="w-5 h-5" />
                                        </DangerButton>
                                    )}

                                    {can("roles_edit") && (
                                        <Link
                                            href={route("role.edit", {
                                                id: role.id,
                                            })}
                                        >
                                            <SecondaryButton>
                                                <Edit className="w-5 h-5" />
                                            </SecondaryButton>
                                        </Link>
                                    )}

                                    {can("roles_view") && (
                                        <Link
                                            href={route("role.show", {
                                                id: role.id,
                                            })}
                                        >
                                            <PrimaryButton>
                                                <Eye className="w-5 h-5" />
                                            </PrimaryButton>
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

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
