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
import { Select, Switch, Transition } from '@headlessui/react';
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
                <h2 className="">
                    {isEdit ? `Editar loja: ${store.data.name}` : 'Criar Loja'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Editar loja' : 'Criar Loja'} />
            
            <section className='py-2 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto">
                    <div className="mb-1">
                        <Link href={route('store.index')}>
                            <SecondaryButton>Voltar</SecondaryButton>
                        </Link>
                    </div>

                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className='w-full'>
                                <InputLabel htmlFor="user" value="Usuário" />

                                <SearchableUsersSelect
                                    setUser={(user) => {
                                        setUser(user);
                                        setData('user_id', user ? user.id : '');
                                    }}
                                    selectedUser={user}
                                    isDisabled={processing}
                                />

                                <InputError className="mt-2" message={errors.user_id} />
                            </div>

                            <div className='w-full'>
                                <InputLabel htmlFor="name" value="Name" />

                                <TextInput
                                    id="name"
                                    className="mt-1 w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="name"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className='w-full'>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                />

                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div className='w-full'>
                                <InputLabel htmlFor="phone" value="Telefone" />

                                <TextInput
                                    id="phone"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    value={data.phone}
                                    onChange={(e) => {
                                        // Simple phone mask: (99) 99999-9999
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length > 11) value = value.slice(0, 11);
                                        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                                        setData('phone', value);
                                    }}
                                    required
                                    autoComplete="tel"
                                    maxLength={15}
                                />

                                <InputError className="mt-2" message={errors.phone} />
                            </div>

                            <div className='w-full'>
                                <InputLabel htmlFor="domain" value="Domínio" />

                                <TextInput
                                    id="domain"
                                    className="mt-1 block w-full"
                                    value={data.domain}
                                    onChange={(e) => setData('domain', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="name"
                                />

                                <InputError className="mt-2" message={errors.domain} />
                            </div>

                            <div className='w-full'>
                                <InputLabel htmlFor="city_id" value="Cidade" />

                                <SearchableCitiesSelect setCity={handleCityChange} selectedCity={city} />

                                <InputError className="mt-2" message={errors.city_id} />
                            </div>

                            <div className="w-full">
                                <InputLabel htmlFor="status" value="Status" />

                                <Switch
                                    checked={data.status === 1}
                                    onChange={(checked) => setData('status', checked ? 1 : 0)}
                                    className="mt-2 group inline-flex h-6 w-11 items-center rounded-full bg-gray-100 dark:bg-gray-600 transition data-[checked]:bg-green-600">
                                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                                </Switch>
                                <InputError className="mt-2" message={errors.status} />
                            </div>


                            <div className='col-span-1 md:col-span-2 lg:col-span-3'>
                                <InputLabel htmlFor="description" value="Descrição" />

                                <textarea
                                    id="description"
                                    className="mt-1 block w-full rounded border-gray-300 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-200"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                    autoComplete="description"
                                    rows={4}
                                    maxLength={255}
                                />

                                <div className="text-xs text-gray-500 dark:text-gray-400 text-left">
                                    {data.description.length}/255
                                </div>

                                <InputError className="mt-2" message={errors.description} />
                            </div>

                            <div className="w-full col-span-1 md:col-span-2 lg:col-span-3 min-h-[200px]">
                                <label htmlFor="largeText" className="block font-medium text-sm text-gray-700">
                                    Conteúdo
                                </label>
                                <ReactQuill
                                    theme="snow"
                                    defaultValue={data.content}
                                    onChange={(value) => setData('content', value)}
                                    modules={modules}
                                    style={{ height: "auto" }}
                                    className="bg-white break-all text-black shadow-md rounded-md"
                                />
                            </div>

                            <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                <label className="block font-medium text-xl text-gray-700 mt-10">Imagem principal (Card da listagem)</label>
                                <div className="flex flex-wrap gap-2">
                                    {store?.data?.image && (
                                        <div className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                                            <img src={store?.data?.image?.file_url} alt={store?.data?.image?.name} className="h-24 w-full object-cover rounded-lg" />
                                            <span
                                                onClick={() => {
                                                    if (store?.data?.image?.id !== undefined) {
                                                        handleDeleteFile(store.data.image.id);
                                                    }
                                                }}
                                                className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 right-0">
                                                <MdDelete />
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <label className="block font-medium text-xl text-gray-700 mt-10">Galeria</label>
                                <div className="flex flex-wrap gap-2 mb-10">
                                    {store?.data?.images && store?.data?.images.map((file, index) => (
                                        <div key={index} className="w-1/4 h-24 bg-gray-200 rounded-lg flex justify-center items-center relative mr-2">
                                            <img src={file?.file_url} alt={file?.name} className="h-24 w-full object-cover rounded-lg" />
                                            <span
                                                onClick={() => handleDeleteFile(file?.id)}
                                                className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 right-0">
                                                <MdDelete />
                                            </span>

                                            <span className="w-9 h-9 transition-all duration-200 flex justify-center items-center rounded-bl-2xl hover:text-red-600 text-gray-800 bg-slate-300/50 absolute top-0 left-0"
                                                onClick={() => handleSetFileAsDefault(file?.id)}>
                                                <MdCheckBox />
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <FilePond
                                    files={files}
                                    onupdatefiles={(fileItems: FilePondFile[]) => {
                                        setFiles(fileItems.map(fileItem => fileItem.file) as File[]);
                                    }}
                                    allowMultiple={true}
                                    maxFiles={10}
                                    labelIdle='Arraste e solte arquivos ou <span class="filepond--label-action">Selecione</span>'
                                />
                            </div>

                            <div className="w-full">
                                <InputLabel htmlFor="layout" value="Layout" />

                                <Select
                                    id="layout"
                                    value={data.layout}
                                    onChange={(e) => setData('layout', e.target.value)}
                                    required
                                >
                                    {storeLayouts.map((layout) => (
                                        <option key={layout} value={layout}>
                                            {layout}
                                        </option>
                                    ))}
                                </Select>

                                <InputError className="mt-2" message={errors.layout} />
                            </div>

                            <div className="w-full col-span-1 md:col-span-2 lg:col-span-3">
                                <PrimaryButton
                                    type="button"
                                    id="get-location"
                                    onClick={getLocation}
                                    className="mt-1"
                                >
                                    Obter localização
                                </PrimaryButton>
                            </div>

                            <div className="w-full">
                                <InputLabel htmlFor="latitude" value="Latitude" />

                                <TextInput
                                    id="latitude"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    required
                                    autoComplete="latitude"
                                />

                                <InputError className="mt-2" message={errors.latitude} />
                            </div>

                            <div className="w-full">
                                <InputLabel htmlFor="longitude" value="Longitude" />

                                <TextInput
                                    id="longitude"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    required
                                    autoComplete="longitude"
                                />

                                <InputError className="mt-2" message={errors.longitude} />
                            </div>

                            <div className='flex justify-start col-span-1 md:col-span-2 lg:col-span-3'>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {isEdit ? 'Salvar' : 'Criar loja'}
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
                                    {isEdit ? 'Loja atualizada' : 'Loja criada'}
                                </p>
                            </Transition>

                        </form>
                    </div>

                </div>
            </section>

        </AuthenticatedLayout>
    )
}