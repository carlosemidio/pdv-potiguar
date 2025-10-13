<?php

namespace App\Events;

use App\Http\Resources\OrderItemResumeResource;
use App\Models\Printer;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PrintOrderItems implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private $order_number;
    private array $orderItemsIds;
    private Printer $printer;
    private $orderItems;

    /**
     * Create a new event instance.
     */
    public function __construct(int $orderNumber, array $orderItemsIds, Printer $printer)
    {
        $orderItems = \App\Models\OrderItem::whereIn('id', $orderItemsIds)
            ->with([
                'storeProductVariant.productVariant',
                'orderItemOptions.addonGroupOption.addonGroup',
                'orderItemOptions.addonGroupOption.addon',
                'orderItemAddons.variantAddon.addon',
                'storeProductVariant.comboItems.itemVariant.productVariant',
                'comboOptionItems.comboOptionItem.storeProductVariant.productVariant'
            ])
        ->get();

        $this->order_number = $orderNumber;
        $this->orderItems = OrderItemResumeResource::collection($orderItems);
        $this->printer = $printer;
        
        Log::info('PrintOrderItems event created', [
            'order_items_count' => count($orderItemsIds),
            'order_items_ids' => $orderItemsIds,
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
        return 'print.order.items';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $data = [
            'order_number' => $this->order_number ?? null,
            'order_items' => $this->orderItems,
            'printer' => $this->printer,
            'timestamp' => now()->toISOString(),
            'event_type' => 'print_order_items'
        ];
        
        Log::info('PrintOrderItems broadcasting data', [
            'order_items_count' => count($this->orderItems),
            'printer_id' => $this->printer->id,
            'channel' => 'print-orders',
            'event_name' => 'print.order.items'
        ]);
        
        return $data;
    }
}
