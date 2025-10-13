import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Permission } from "@/types/Permission";
import { Role } from "@/types/Role";
import { Transition } from "@headlessui/react";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Edit({
    auth,
    role,
    permissions
}: PageProps<{
    role: { data: Role };
    permissions: { data: Permission[] };
}>) {
    const isEdit = !!role;

    const {
        data,
        setData,
        patch,
        post,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        name: role ? role.data.name : "",
        display_name: role ? role.data.display_name : "",
        permissions: role
            ? role.data.permissions.map((permission) => ({
                  id: permission.id,
                  total_access: permission.total_access,
              }))
            : ([] as Array<{ id: number; total_access: number }>),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            patch(route("role.update", role.data.id));
        } else {
            post(route("role.store"));
        }
    };

    // Função para agrupar permissões por prefixo
    const groupPermissions = (permissions: Permission[]) => {
        return permissions.reduce((groups, permission) => {
            const displayName = permission.display_name ?? '';
            const prefix = displayName.split("-")[0]; // Obtém o prefixo antes do primeiro '-'

            if (!groups[prefix]) {
                groups[prefix] = [];
            }

            groups[prefix].push(permission);

            return groups;
        }, {} as { [key: string]: Permission[] });
    };

    const groupedPermissions = groupPermissions(permissions.data);

    // Função para marcar/desmarcar todas as permissões
    const toggleAllPermissions = (checked: boolean) => {
        if (checked) {
            setData(
                "permissions",
                permissions.data.map((permission) => ({
                    id: permission.id,
                    total_access: permission.total_access,
                }))
            );
        } else {
            setData("permissions", []);
        }
    };

    // Função para marcar/desmarcar todas as permissões de um grupo
    const toggleGroupPermissions = (prefix: string, checked: boolean) => {
        const groupPermissionIds = groupedPermissions[prefix].map(
            (permission) => ({
                id: permission.id,
                total_access: permission.total_access,
            })
        );
        if (checked) {
            setData("permissions", [
                ...new Set([...data.permissions, ...groupPermissionIds]),
            ]);
        } else {
            setData(
                "permissions",
                data.permissions.filter(
                    (id) => !groupPermissionIds.includes(id)
                )
            );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {isEdit
                        ? `Editar Função`
                        : "Nova Função"}
                </h2>
            }
        >
            <Head title={isEdit ? "Editar Função" : "Criar Função"} />

            <section className="px-4 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="mb-4">
                        <Link href={route("role.index")}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                        <form onSubmit={submit} className=" space-y-6">
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Código da Função"
                                />

                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    isFocused
                                    autoComplete="name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Atribuir Permissões
                                </h2>

                                {Object.keys(groupedPermissions).map(
                                    (prefix) => (
                                        <div
                                            key={prefix}
                                            className="mt-4 border p-3 rounded dark:border-gray-600"
                                        >
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">
                                                    {prefix}
                                                </h3>
                                                <Checkbox
                                                    id={`select-all-${prefix}`}
                                                    name={`select-all-${prefix}`}
                                                    checked={groupedPermissions[
                                                        prefix
                                                    ].every((permission) =>
                                                        data.permissions
                                                            .map(
                                                                (
                                                                    dataPermission
                                                                ) =>
                                                                    dataPermission.id
                                                            )
                                                            .includes(
                                                                permission.id
                                                            )
                                                    )}
                                                    onChange={(e) => {
                                                        console.log(
                                                            e.target.checked
                                                        );
                                                        toggleGroupPermissions(
                                                            prefix,
                                                            e.target.checked
                                                        );
                                                    }}
                                                />
                                                <InputLabel
                                                    htmlFor={`select-all-${prefix}`}
                                                    value=""
                                                />
                                            </div>
                                            <div className="flex gap-4 mt-3">
                                                {groupedPermissions[prefix].map(
                                                    (permission) => (
                                                        <>
                                                            <div className="flex flex-col bg-gray-100/70 p-2 rounded">
                                                                <div
                                                                    key={permission.id}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <Checkbox
                                                                        id={`permission-${permission.id}`}
                                                                        name={`permission-${permission.id}`}
                                                                        value={permission.id}
                                                                        checked={data.permissions
                                                                            ?.map((dataPermission) => dataPermission.id)
                                                                            .includes(permission.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setData("permissions", [
                                                                                    ...data.permissions,
                                                                                    {
                                                                                        id: permission.id,
                                                                                        total_access: permission.total_access,
                                                                                    },
                                                                                ]);
                                                                            } else {
                                                                                setData("permissions", data.permissions.filter((p) => p.id !== permission.id));
                                                                            }
                                                                        }}
                                                                    ></Checkbox>
                                                                    <InputLabel
                                                                        htmlFor={`permission-${permission.id}`}
                                                                        value={
                                                                            (permission.display_name ?? '').split("-")[1] ?? ''
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {permission.name
                                                                        .split(
                                                                            "_"
                                                                        )
                                                                        .lastIndexOf(
                                                                            "create"
                                                                        ) ===
                                                                        -1 && (
                                                                        <>
                                                                            <Checkbox
                                                                                id={`permission-${permission.id}-total_access`}
                                                                                name={`permission-${permission.id}-total_access`}
                                                                                value={
                                                                                    permission.total_access
                                                                                }
                                                                                checked={
                                                                                    data.permissions?.find(
                                                                                        (
                                                                                            dataPermission
                                                                                        ) =>
                                                                                            dataPermission.id ===
                                                                                            permission.id
                                                                                    )
                                                                                        ?.total_access ===
                                                                                    1
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    if (
                                                                                        e
                                                                                            .target
                                                                                            .checked
                                                                                    ) {
                                                                                        setData(
                                                                                            "permissions",
                                                                                            data.permissions.map(
                                                                                                (
                                                                                                    p
                                                                                                ) =>
                                                                                                    p.id ===
                                                                                                    permission.id
                                                                                                        ? {
                                                                                                              id: permission.id,
                                                                                                              total_access: 1,
                                                                                                          }
                                                                                                        : p
                                                                                            )
                                                                                        );
                                                                                    } else {
                                                                                        setData(
                                                                                            "permissions",
                                                                                            data.permissions.map(
                                                                                                (
                                                                                                    p
                                                                                                ) =>
                                                                                                    p.id ===
                                                                                                    permission.id
                                                                                                        ? {
                                                                                                              id: permission.id,
                                                                                                              total_access: 0,
                                                                                                          }
                                                                                                        : p
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            ></Checkbox>
                                                                            <InputLabel
                                                                                htmlFor={`permission-${permission.id}-total_access`}
                                                                                value="Todos"
                                                                            />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex justify-end">
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                >
                                    {isEdit ? "Salvar" : "Criar"}
                                </PrimaryButton>
                            </div>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isEdit
                                        ? "Alteração salva com sucesso."
                                        : "Função criada com sucesso."}
                                </p>
                            </Transition>
                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
