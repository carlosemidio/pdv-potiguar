import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SearchableCitiesSelect from '@/Components/SearchableCitiesSelect';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { City } from '@/types/City';
import { Store } from '@/types/Store';
import { Switch, Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdCheckBox, MdDelete } from "react-icons/md";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { User } from '@/types/User';
import SearchableUsersSelect from '@/Components/SearchableUsersSelect';
import storeLayouts from '@/utils/storeLayouts';
import {
    ArrowLeft,
    Store as StoreIcon,
    User as UserIcon,
    Mail,
    Phone,
    Globe,
    MapPin,
    FileText,
    Image,
    Settings,
    Target
} from 'lucide-react';
import AddressForm from '@/Components/AddressForm';

registerPlugin(FilePondPluginImagePreview);

export default function Edit({
    auth,
    store
}: PageProps<{ store: { data: Store} }>) {
    const isEdit = !!store;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: store ? 'patch' : 'post',
            user_id: store ? store.data.user_id : '',
            name: store ? store.data.name : '',
            email: store ? store.data.email : '',
            phone: store ? store.data.phone : '',
            domain: store ? store.data.domain : '',
            latitude: store ? store.data.latitude : '',
            longitude: store ? store.data.longitude : '',
            city_id: store ? store.data?.city?.id : '',
            description: store ? store.data.description : '',
            content: store ? store.data.content : '',
            status: store ? store.data.status : 1, // Default to active
            layout: store ? store.data.layout : 'default',
            files: Array<File>(),
            address: store ? store.data.address : null,
        });

    const [city, setCity] = useState(store ? store?.data?.city : null);
    const [files, setFiles] = useState<File[]>([]);
    const [user, setUser] = useState<User | null>(store ? store?.data?.user : null);

    const handleCityChange = (selectedCity: City) => {
        setCity(selectedCity);
        setData('city_id', selectedCity.id);
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setData({
                    ...data,
                    longitude: position.coords.longitude.toString(),
                    latitude: position.coords.latitude.toString(),
                });
            }, (error) => {
                console.error('Geolocation error:', error);
                alert('Não foi possível obter a localização. Por favor, insira as coordenadas manualmente.');
            });
        } else {
            alert('Geolocalização não é suportada pelo seu navegador.');
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Validate city selection
        if (!city || !city.id) {
            alert('Por favor, selecione uma cidade válida.');
            return;
        }

        // Set city_id from selected city
        data.city_id = city.id;

        // Prepare files for upload
        data.files = files;

        if (isEdit) {
            post(route('store.update', store.data.id), {
                preserveScroll: true,
                onSuccess: () => setData({
                    _method: store ? 'patch' : 'post',
                    user_id: '',
                    name: '',
                    email: '',
                    phone: '',
                    domain: '',
                    latitude: '',
                    longitude: '',
                    city_id: '',
                    description: '',
                    content: '',
                    status: 1,
                    layout: 'default',
                    files: [],
                    address: null,
                }),
            });
        } else {
            post(route('store.store'));
        }
    };

    const handleDeleteFile = (fileId: number) => {
        data._method = 'delete';
        post(route('file.destroy', fileId));
    }

    const handleSetFileAsDefault = (fileId: number) => {
        data._method = 'post';
        post(route('file.setAsDefault', fileId));
    }

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'size': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ],
    };

    useEffect(() => {
        console.log('Files:', files);
    }, [files]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            pendingOrdersCount={auth.pendingOrdersCount}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {isEdit ? `Editar loja: ${store.data.name}` : 'Nova Loja'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Editar loja' : 'Criar Loja'} />
            
            <div className="py-6 px-4 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="mb-6">
                    <Link href={route('store.index')}>
                        <SecondaryButton className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para Lojas
                        </SecondaryButton>
                    </Link>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="mb-6">
                        <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700" role="alert">
                            <ul className="list-disc list-inside">
                                {Object.entries(errors).map(([field, errorMsg], idx) => (
                                    errorMsg ? <li key={field}>{errorMsg}</li> : null
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Informações Básicas */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <StoreIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
                                    <p className="text-blue-100 text-sm">Dados principais da loja</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-3">
                                <InputLabel htmlFor="user" value="Usuário Responsável" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                    Usuário Responsável
                                </InputLabel>
                                <div className="mt-2">
                                    <SearchableUsersSelect
                                        setUser={(user) => {
                                            setUser(user);
                                            setData('user_id', user ? user.id : '');
                                        }}
                                        selectedUser={user}
                                        isDisabled={processing}
                                    />
                                </div>
                                <InputError className="mt-2" message={errors.user_id} />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Nome da Loja" className="text-gray-700 dark:text-gray-300 font-medium" />
                                <TextInput
                                    id="name"
                                    className="mt-2 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="name"
                                    placeholder="Ex: Pizzaria do João"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </InputLabel>
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-2 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="contato@loja.com"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Telefone" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Telefone
                                </InputLabel>
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    className="mt-2 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.phone}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length > 11) value = value.slice(0, 11);
                                        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                                        setData('phone', value);
                                    }}
                                    required
                                    autoComplete="tel"
                                    maxLength={15}
                                    placeholder="(84) 99999-9999"
                                />
                                <InputError className="mt-2" message={errors.phone} />
                            </div>

                            <div>
                                <InputLabel htmlFor="domain" value="Domínio" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Domínio
                                </InputLabel>
                                <TextInput
                                    id="domain"
                                    className="mt-2 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.domain}
                                    onChange={(e) => setData('domain', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="minha-loja"
                                />
                                <InputError className="mt-2" message={errors.domain} />
                            </div>

                            <div>
                                <InputLabel htmlFor="city_id" value="Cidade" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Cidade
                                </InputLabel>
                                <div className="mt-2">
                                    <SearchableCitiesSelect setCity={handleCityChange} selectedCity={city} />
                                </div>
                                <InputError className="mt-2" message={errors.city_id} />
                            </div>

                            <div className="flex items-center space-x-4">
                                <div>
                                    <InputLabel htmlFor="status" value="Status da Loja" className="text-gray-700 dark:text-gray-300 font-medium" />
                                    <div className="mt-2 flex items-center gap-3">
                                        <Switch
                                            checked={data.status === 1}
                                            onChange={(checked) => setData('status', checked ? 1 : 0)}
                                            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            <span className="size-4 translate-x-1 rounded-full bg-white shadow-lg transition group-data-[checked]:translate-x-6" />
                                        </Switch>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {data.status === 1 ? 'Ativa' : 'Inativa'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                
                    {/* Endereço */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Endereço</h3>
                                    <p className="text-teal-100 text-sm">Detalhes do endereço da loja</p>
                                </div>
                            </div>
                        </div>
                        
                        <AddressForm
                            errors={errors}
                            address={data.address}
                            onAddressChange={(address) => setData('address', address)}
                        />
                    </div>

                    {/* Descrição e Conteúdo */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Conteúdo da Loja</h3>
                                    <p className="text-green-100 text-sm">Descrição e conteúdo detalhado</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="description" value="Descrição Resumida" className="text-gray-700 dark:text-gray-300 font-medium" />
                                <textarea
                                    id="description"
                                    className="mt-2 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 resize-none"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                    autoComplete="description"
                                    rows={4}
                                    maxLength={255}
                                    placeholder="Descreva brevemente sua loja..."
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <InputError message={errors.description} />
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {data.description.length}/255
                                    </div>
                                </div>
                            </div>

                            <div className="min-h-[300px]">
                                <InputLabel htmlFor="content" value="Conteúdo Detalhado" className="text-gray-700 dark:text-gray-300 font-medium mb-2" />
                                <div className="bg-white rounded-lg border border-gray-300 dark:border-gray-600">
                                    <ReactQuill
                                        theme="snow"
                                        defaultValue={data.content}
                                        onChange={(value) => setData('content', value)}
                                        modules={modules}
                                        style={{ height: "250px" }}
                                        className="break-all text-black"
                                        placeholder="Conte mais sobre sua loja, produtos, história..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Imagens */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Image className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Imagens da Loja</h3>
                                    <p className="text-purple-100 text-sm">Logo e galeria de fotos</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Imagem Principal */}
                            {store?.data?.image && (
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Imagem Principal (Logo)</h4>
                                    <div className="relative inline-block">
                                        <img 
                                            src={store?.data?.image?.file_url} 
                                            alt={store?.data?.image?.name} 
                                            className="h-32 w-32 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (store?.data?.image?.id !== undefined) {
                                                    handleDeleteFile(store.data.image.id);
                                                }
                                            }}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                                        >
                                            <MdDelete className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Galeria */}
                            {store?.data?.images && store?.data?.images.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Galeria de Imagens</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {store?.data?.images.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img 
                                                    src={file?.file_url} 
                                                    alt={file?.name} 
                                                    className="h-24 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" 
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetFileAsDefault(file?.id)}
                                                        className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                                                        title="Definir como principal"
                                                    >
                                                        <MdCheckBox className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteFile(file?.id)}
                                                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                                        title="Excluir imagem"
                                                    >
                                                        <MdDelete className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload de novas imagens */}
                            <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Adicionar Novas Imagens</h4>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4">
                                    <FilePond
                                        files={files}
                                        onupdatefiles={(fileItems: FilePondFile[]) => {
                                            setFiles(fileItems.map(fileItem => fileItem.file) as File[]);
                                        }}
                                        allowMultiple={true}
                                        maxFiles={10}
                                        labelIdle='Arraste e solte imagens ou <span class="filepond--label-action">Selecione Arquivos</span>'
                                        acceptedFileTypes={['image/*']}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configurações e Localização */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Configurações</h3>
                                    <p className="text-amber-100 text-sm">Layout e localização</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <InputLabel htmlFor="layout" value="Layout da Loja" className="text-gray-700 dark:text-gray-300 font-medium" />
                                <select
                                    id="layout"
                                    value={data.layout}
                                    onChange={(e) => setData('layout', e.target.value)}
                                    className="mt-2 block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    required
                                >
                                    {storeLayouts.map((layout) => (
                                        <option key={layout} value={layout}>
                                            {layout.charAt(0).toUpperCase() + layout.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.layout} />
                            </div>

                            <div className="lg:col-span-3">
                                <div className="flex items-center gap-3 mb-4">
                                    <Target className="w-5 h-5 text-amber-600" />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Localização</span>
                                </div>
                                <PrimaryButton
                                    type="button"
                                    onClick={getLocation}
                                    className="mb-4 bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Obter Localização Atual
                                </PrimaryButton>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="latitude" value="Latitude" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <TextInput
                                            id="latitude"
                                            type="text"
                                            className="mt-2 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                            value={data.latitude}
                                            onChange={(e) => setData('latitude', e.target.value)}
                                            required
                                            autoComplete="latitude"
                                            placeholder="-5.7945"
                                        />
                                        <InputError className="mt-2" message={errors.latitude} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="longitude" value="Longitude" className="text-gray-700 dark:text-gray-300 font-medium" />
                                        <TextInput
                                            id="longitude"
                                            type="text"
                                            className="mt-2 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                            value={data.longitude}
                                            onChange={(e) => setData('longitude', e.target.value)}
                                            required
                                            autoComplete="longitude"
                                            placeholder="-35.2108"
                                        />
                                        <InputError className="mt-2" message={errors.longitude} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <PrimaryButton 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3"
                                >
                                    {processing ? 'Salvando...' : (isEdit ? 'Atualizar Loja' : 'Criar Loja')}
                                </PrimaryButton>
                                
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {isEdit ? 'Loja atualizada com sucesso!' : 'Loja criada com sucesso!'}
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}