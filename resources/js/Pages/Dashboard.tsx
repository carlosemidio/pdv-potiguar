import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { User } from '@/types/User';
import { Head, usePage } from '@inertiajs/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Dashboard({ auth }: PageProps) {
    const {
        viewsToday,
        viewsLast7Days,
        viewsLast30Days,
        totalViews,
        viewsByPeriod,
        totalProducts,
        totalStores,
        stores
    } = usePage<PageProps & {
        auth: { user: User };
        viewsToday: number;
        viewsLast7Days: number;
        viewsLast30Days: number;
        totalViews: number;
        viewsByPeriod: Record<string, number>;
        totalProducts: number;
        totalStores: number;
        stores: { id: number; name: string }[];
    }>().props;

    const user = auth.user;

    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top' as const,
            },
            title: {
            display: true,
            text: 'Visualizações por Período',
            },
        },
    };

    const periodKeys = Object.keys(viewsByPeriod || {});
    const labels = periodKeys.map(date => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d.toLocaleDateString();
    });

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Visualizações',
                data: periodKeys.map((key) => viewsByPeriod[key] || 0),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold">Bem vindo, {user.name}!</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Aqui estão suas estatísticas de visualização de produtos.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h4 className="text-md font-semibold">Visualizações Hoje</h4>
                            <p className="text-2xl">{viewsToday}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h4 className="text-md font-semibold">Visualizações nos últimos 7 Dias</h4>
                            <p className="text-2xl">{viewsLast7Days}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h4 className="text-md font-semibold">Visualizações nos últimos 30 Dias</h4>
                            <p className="text-2xl">{viewsLast30Days}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h4 className="text-md font-semibold">Visualizações Totais (Desde o início)</h4>
                            <p className="text-2xl">{totalViews}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h4 className="text-md font-semibold">Quantidade de produtos</h4>
                            <p className="text-2xl">{totalProducts}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 col-span-1 sm:col-span-2 xl:col-span-3">
                            <h4 className="text-md font-semibold mb-4">Visualizações por Período</h4>
                            <div className="h-64">
                                <Line options={options} data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
