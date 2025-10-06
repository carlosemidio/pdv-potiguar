const orderItemStatuses = {
  'pending': 'Pendente',
  'in_progress': 'Preparando',
  'ready': 'Pronto',
  'served': 'Servido',
  'canceled': 'Cancelado',
};

const orderItemStatusesColor = {
  'pending': 'bg-orange-500 text-white dark:bg-orange-600',
  'in_progress': 'bg-amber-200 text-amber-900 dark:bg-amber-300 dark:text-amber-900',
  'ready': 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900',
  'served': 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
  'canceled': 'bg-gray-200 text-gray-800 dark:bg-gray-300 dark:text-gray-900',
};

export { orderItemStatuses, orderItemStatusesColor };