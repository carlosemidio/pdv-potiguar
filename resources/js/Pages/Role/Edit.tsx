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
import { FormEventHandler, useState } from "react";
import { ArrowLeft, Shield, Key, Users, Save, Plus, Crown, Globe, User, ChevronDown, ChevronRight } from "lucide-react";

export default function Edit({
    auth,
    role,
    permissions
}: PageProps<{
    role: { data: Role };
    permissions: { data: Permission[] };
}>) {
    const isEdit = !!role;

    // Estado para controlar quais grupos estão expandidos
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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

    // Função para expandir/contrair grupos
    const toggleGroup = (groupName: string) => {
        const newExpandedGroups = new Set(expandedGroups);
        if (newExpandedGroups.has(groupName)) {
            newExpandedGroups.delete(groupName);
        } else {
            newExpandedGroups.add(groupName);
        }
        setExpandedGroups(newExpandedGroups);
    };

    // Função para marcar/desmarcar todas as permissões
    const toggleAllPermissions = (checked: boolean) => {
        if (checked) {
            setData(
                "permissions",
                permissions.data.map((permission) => ({
                    id: permission.id,
                    total_access: 0, // Default: apenas próprios itens
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
                total_access: 0, // Default: apenas próprios itens
            })
        );
        if (checked) {
            // Adiciona novas permissões sem duplicar
            const newPermissions = [...data.permissions];
            groupPermissionIds.forEach(groupPerm => {
                if (!newPermissions.find(p => p.id === groupPerm.id)) {
                    newPermissions.push(groupPerm);
                }
            });
            setData("permissions", newPermissions);
        } else {
            setData(
                "permissions",
                data.permissions.filter(
                    (permission) => !groupPermissionIds.some(groupPerm => groupPerm.id === permission.id)
                )
            );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {isEdit ? 'Editar Função' : 'Nova Função'}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {isEdit ? `Modificar dados da função "${role.data.display_name}"` : 'Criar uma nova função no sistema'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={isEdit ? "Editar Função" : "Criar Função"} />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Botão Voltar */}
                <div className="flex justify-start">
                    <Link href={route("role.index")}>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para Lista
                        </button>
                    </Link>
                </div>

                {/* Formulário */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 px-6 sm:px-8 py-6 border-b border-indigo-100 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                                {isEdit ? <Crown className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> : <Plus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {isEdit ? 'Editar Função' : 'Criar Nova Função'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {isEdit ? 'Modifique os dados e permissões da função' : 'Preencha os dados e defina permissões'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-8">
                            {/* Campos Básicos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Campo Código */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        <InputLabel htmlFor="name" value="Código da Função" className="text-base font-semibold" />
                                    </div>
                                    
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full pl-4 pr-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="name"
                                        placeholder="ex: admin, manager, user"
                                    />

                                    <InputError className="mt-2 text-sm" message={errors.name} />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Use snake_case (ex: super_admin, store_manager)
                                    </p>
                                </div>

                                {/* Campo Nome de Exibição */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <InputLabel htmlFor="display_name" value="Nome de Exibição" className="text-base font-semibold" />
                                    </div>
                                    
                                    <TextInput
                                        id="display_name"
                                        className="mt-1 block w-full pl-4 pr-4 py-3 text-base rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400"
                                        value={data.display_name}
                                        onChange={(e) => setData("display_name", e.target.value)}
                                        required
                                        autoComplete="display_name"
                                        placeholder="ex: Administrador, Gerente, Usuário"
                                    />

                                    <InputError className="mt-2 text-sm" message={errors.display_name} />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Nome amigável que será exibido na interface
                                    </p>
                                </div>
                            </div>

                            {/* Seção de Permissões */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Atribuir Permissões
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Selecione as permissões que esta função terá acesso
                                        </p>
                                    </div>
                                </div>

                                {/* Controle Selecionar Todos */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="select-all-permissions"
                                            name="select-all-permissions"
                                            checked={data.permissions.length === permissions.data.length}
                                            onChange={(e) => toggleAllPermissions(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                        <InputLabel
                                            htmlFor="select-all-permissions"
                                            value="Selecionar todas as permissões"
                                            className="text-base font-semibold cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Grupos de Permissões */}
                                <div className="space-y-4">
                                    {Object.keys(groupedPermissions).map((prefix) => {
                                        const isExpanded = expandedGroups.has(prefix);
                                        const groupPermissions = groupedPermissions[prefix];
                                        const selectedCount = groupPermissions.filter(permission =>
                                            data.permissions.map(p => p.id).includes(permission.id)
                                        ).length;

                                        return (
                                            <div
                                                key={prefix}
                                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
                                            >
                                                {/* Header do Grupo - Clicável */}
                                                <div 
                                                    className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:from-gray-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-colors duration-200"
                                                    onClick={() => toggleGroup(prefix)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                id={`select-all-${prefix}`}
                                                                name={`select-all-${prefix}`}
                                                                checked={groupPermissions.every((permission) =>
                                                                    data.permissions
                                                                        .map((dataPermission) => dataPermission.id)
                                                                        .includes(permission.id)
                                                                )}
                                                                onChange={(e) => {
                                                                    e.stopPropagation(); // Evita que o click expanda/contraia o acordeon
                                                                    toggleGroupPermissions(prefix, e.target.checked);
                                                                }}
                                                                className="w-5 h-5"
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                                <h5 className="text-base font-bold text-gray-900 dark:text-white capitalize">
                                                                    {prefix}
                                                                </h5>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                                                                    {groupPermissions.length} permissões
                                                                </span>
                                                                {selectedCount > 0 && (
                                                                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                                                                        {selectedCount} selecionadas
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {isExpanded ? (
                                                                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                                                            ) : (
                                                                <ChevronRight className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Lista de Permissões do Grupo - Accordion Content */}
                                                {isExpanded && (
                                                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                                                        <div className="space-y-4">
                                                    {groupedPermissions[prefix].map((permission) => {
                                                        const isChecked = data.permissions
                                                            .map((dataPermission) => dataPermission.id)
                                                            .includes(permission.id);
                                                        
                                                        const currentPermission = data.permissions.find(
                                                            (dataPermission) => dataPermission.id === permission.id
                                                        );

                                                        return (
                                                            <div
                                                                key={permission.id}
                                                                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                                            >
                                                                {/* Checkbox principal da permissão */}
                                                                <div className="flex items-start gap-3">
                                                                    <Checkbox
                                                                        id={`permission-${permission.id}`}
                                                                        name={`permission-${permission.id}`}
                                                                        checked={isChecked}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setData("permissions", [
                                                                                    ...data.permissions,
                                                                                    {
                                                                                        id: permission.id,
                                                                                        total_access: 0, // Default: apenas próprios itens
                                                                                    },
                                                                                ]);
                                                                            } else {
                                                                                setData(
                                                                                    "permissions",
                                                                                    data.permissions.filter(
                                                                                        (dataPermission) =>
                                                                                            dataPermission.id !== permission.id
                                                                                    )
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="w-4 h-4 mt-1"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <InputLabel
                                                                            htmlFor={`permission-${permission.id}`}
                                                                            value={permission.display_name}
                                                                            className="text-sm font-medium cursor-pointer text-gray-900 dark:text-white"
                                                                        />
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                            {permission.name}
                                                                        </p>
                                                                        
                                                                        {/* Controles de Acesso Total - só aparecem se a permissão estiver marcada E não for de criação */}
                                                                        {isChecked && !permission.name.includes('_create') && (
                                                                            <div className="mt-3 space-y-2">
                                                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                                    Nível de Acesso:
                                                                                </p>
                                                                                <div className="flex flex-col gap-2">
                                                                                    {/* Acesso apenas aos próprios itens */}
                                                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`access-${permission.id}`}
                                                                                            value="0"
                                                                                            checked={currentPermission?.total_access === 0}
                                                                                            onChange={() => {
                                                                                                setData("permissions", 
                                                                                                    data.permissions.map(p => 
                                                                                                        p.id === permission.id 
                                                                                                            ? { ...p, total_access: 0 }
                                                                                                            : p
                                                                                                    )
                                                                                                );
                                                                                            }}
                                                                                            className="w-3 h-3 text-blue-600"
                                                                                        />
                                                                                        <User className="w-3 h-3 text-blue-600" />
                                                                                        <span className="text-xs text-gray-700 dark:text-gray-300">
                                                                                            Apenas próprios itens
                                                                                        </span>
                                                                                    </label>
                                                                                    
                                                                                    {/* Acesso total aos itens do tenant */}
                                                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`access-${permission.id}`}
                                                                                            value="1"
                                                                                            checked={currentPermission?.total_access === 1}
                                                                                            onChange={() => {
                                                                                                setData("permissions", 
                                                                                                    data.permissions.map(p => 
                                                                                                        p.id === permission.id 
                                                                                                            ? { ...p, total_access: 1 }
                                                                                                            : p
                                                                                                    )
                                                                                                );
                                                                                            }}
                                                                                            className="w-3 h-3 text-green-600"
                                                                                        />
                                                                                        <Globe className="w-3 h-3 text-green-600" />
                                                                                        <span className="text-xs text-gray-700 dark:text-gray-300">
                                                                                            Todos os itens do tenant
                                                                                        </span>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {/* Indicador para permissões de criação */}
                                                                        {isChecked && permission.name.includes('_create') && (
                                                                            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Plus className="w-3 h-3 text-blue-600" />
                                                                                    <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                                                                        Permissão de criação - novos itens sempre pertencem ao usuário
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
                                <Link href={route("role.index")}>
                                    <SecondaryButton className="w-full sm:w-auto">
                                        Cancelar
                                    </SecondaryButton>
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {isEdit ? 'Salvando...' : 'Criando...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {isEdit ? 'Salvar Alterações' : 'Criar Função'}
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Mensagem de Sucesso */}
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0 transform translate-y-2"
                                enterTo="opacity-100 transform translate-y-0"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0 transform translate-y-2"
                            >
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                    <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        {isEdit ? 'Função editada com sucesso!' : 'Função criada com sucesso!'}
                                    </p>
                                </div>
                            </Transition>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}