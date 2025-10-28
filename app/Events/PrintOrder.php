<?php

namespace App\Events;

use App\Http\Resources\OrderResumeResource;
use App\Models\Printer;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PrintOrder implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;
    public $printer;

    /**
     * Create a new event instance.
     */
    public function __construct($order, Printer $printer)
    {
        $this->order = OrderResumeResource::make($order);
        $this->printer = $printer;
        
        // Log para debug
        Log::info('PrintOrder event created', [
            'order_id' => $order->id,
            'printer_id' => $printer->id,
            'printer_name' => $printer->name
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('print-orders-'.$this->printer->store->uuid),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'print.order';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        Log::info('PrintOrder broadcasting data', [
            'order_id' => $this->order->id ?? 'N/A',
            'printer_id' => $this->printer->id,
            'channel' => 'print-orders'
        ]);

        return [
            'order' => $this->order,
            'printer' => $this->printer,
            'timestamp' => now()->toISOString()
        ];
    }
}
