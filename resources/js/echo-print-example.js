// Exemplo de como ouvir o evento PrintOrder no frontend
// Adicione isso em uma página React/TypeScript

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configurar Echo
const echo = new Echo({
    broadcaster: 'pusher',
    key: 'swown8hcwchwf0ajrdws',
    wsHost: 'localhost',
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
});

// Ouvir o evento PrintOrder
echo.private('print-orders')
    .listen('.print.order', (event) => {
        console.log('🖨️ Evento PrintOrder recebido:', event);
        console.log('📄 Pedido:', event.order);
        console.log('🖨️ Impressora:', event.printer);
        console.log('⏰ Timestamp:', event.timestamp);

        // Aqui você pode implementar a lógica de impressão
        // Por exemplo, enviar para uma API local de impressão
        handlePrint(event.order, event.printer);
    });

function handlePrint(order, printer) {
    // Exemplo de como processar o evento de impressão
    console.log(`Imprimindo pedido ${order.id} na impressora ${printer.name}`);
    
    // Enviar para serviço local de impressão
    fetch('http://localhost:4000/print', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order: order,
            printer: printer,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Impressão enviada:', data);
    })
    .catch(error => {
        console.error('❌ Erro na impressão:', error);
    });
}

// Para testar a conexão
echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ Conectado ao Reverb WebSocket');
});

echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('❌ Desconectado do Reverb WebSocket');
});

export { echo };