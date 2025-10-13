import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { PropsWithChildren } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}: PropsWithChildren<{
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
    closeable?: boolean;
    onClose: CallableFunction;
}>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',     // 384px - Para formulários muito simples
        md: 'sm:max-w-md',     // 448px - Para formulários pequenos
        lg: 'sm:max-w-lg',     // 512px - Para formulários padrão
        xl: 'sm:max-w-xl',     // 576px - Para formulários com mais campos
        '2xl': 'sm:max-w-2xl', // 672px - Para formulários complexos
        '3xl': 'sm:max-w-3xl', // 768px - Para formulários avançados
        '4xl': 'sm:max-w-4xl', // 896px - Para formulários extensos
        '5xl': 'sm:max-w-5xl', // 1024px - Para formulários muito extensos
        '6xl': 'sm:max-w-6xl', // 1152px - Para conteúdo amplo
        '7xl': 'sm:max-w-7xl', // 1280px - Para conteúdo máximo
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center justify-center overflow-y-auto p-4 transition-all"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all w-full ${maxWidthClass} dark:bg-gray-800`}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
