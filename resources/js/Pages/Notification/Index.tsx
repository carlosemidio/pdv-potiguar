import Card from '@/Components/Card';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, X } from 'lucide-react';
import { can } from '@/utils/authorization';
import { Notification } from '@/types/notification';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({
    auth,
    notifications,
    notifications_read,
}: PageProps<{
    notifications: { data: Notification[]},
    notifications_read: { data: Notification[]}
}>) {
    const [openNotificationModal, setOpenNotificationModal] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        notificationToReadId: 0,
    });

    const markNotificationAsRead = async (notification: Notification) => {
        setData('notificationToReadId', notification.id);
        const response = patch(route('notification.markAsRead', notification.id));
        return data;
    }

    const toggleNotificationModal = (notification: Notification) => {
        if (!openNotificationModal) {
            markNotificationAsRead(notification).then((data) => {
                setOpenNotificationModal(true);
            });
        }
        else {
            setOpenNotificationModal(false);
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Notificações
                </h2>
            }
        >
            <Head title="Funções" />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">

                    <div className='flex justify-end'>
                        {can('notifications_create') && (
                                <Link href={route('notification.create')}>
                                <PrimaryButton>
                                    Emitir Notificação
                                </PrimaryButton>
                            </Link>
                        )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4'>
                        {
                            notifications?.data?.map((notification) => (

                                <div key={'notification_' + notification.id}>
                                    <Card>
                                        <div className='mt-4'>
                                            <p className='text-sm mb-1'>Título</p>
                                            <p className='font-semibold'>{notification.title}</p>
                                        </div>
                                        <div className='mt-2'>
                                            <p className='text-sm mb-1'>Conteúdo</p>
                                            <p className='line-clamp-1'>{notification.content}</p>
                                        </div>
                                        <div className='flex gap-2 mt-2 justify-end'>

                                            {can('notifications_view') && (
                                                <PrimaryButton onClick={() => toggleNotificationModal(notification)}>
                                                        <Eye className='w-5 h-5' />
                                                </PrimaryButton>
                                            )}

                                        </div>
                                    </Card>

                                    <Modal show={openNotificationModal} onClose={toggleNotificationModal}>
                                        <div className='p-4'>
                                            <div className='flex justify-end'>
                                                <X className='w-6 h-6 cursor-pointer' onClick={() => toggleNotificationModal(notification)} />
                                            </div>
                                            <h2 className='font-semibold'>{notification.title}</h2>
                                            <p className='mt-2'>{notification.content}</p>
                                        </div>
                                    </Modal>

                                </div>

                            ))

                        }
                    </div>

                    <div className='mt-4'>
                        <h1 className='font-semibold text-lg'>Notifcações Lidas</h1>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2'>
                            {
                                notifications_read?.data?.map((notification) => (

                                    <div key={'read_' + notification.id}>
                                        <Card>
                                            <div className='mt-4'>
                                                <p className='text-sm mb-1'>Título</p>
                                                <p className='font-semibold'>{notification.title}</p>
                                            </div>
                                            <div className='mt-2'>
                                                <p className='text-sm mb-1'>Conteúdo</p>
                                                <p className='line-clamp-1'>{notification.content}</p>
                                            </div>
                                            <div className='flex gap-2 mt-2 justify-end'>
                                                {can('notifications_view') && (
                                                    <PrimaryButton onClick={() => toggleNotificationModal }>
                                                        <Eye className='w-5 h-5' />
                                                    </PrimaryButton>
                                                )}

                                            </div>
                                        </Card>

                                        <Modal show={openNotificationModal} onClose={toggleNotificationModal}>
                                            <div className='p-4'>
                                                <div className='flex justify-end'>
                                                    <X className='w-6 h-6 cursor-pointer' onClick={() => toggleNotificationModal} />
                                                </div>
                                                <h2 className='font-semibold'>{notification.title}</h2>
                                                <p className='mt-2'>{notification.content}</p>
                                            </div>
                                        </Modal>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}