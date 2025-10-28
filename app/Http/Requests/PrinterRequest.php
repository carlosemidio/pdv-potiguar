<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class PrinterRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Autoriza todos os usuários autenticados; ajuste se necessário
        return Auth::check();
    }

    public function rules()
    {
        $printerId = $this->route('printer')?->id ?? null;

        return [
            'name' => 'required|string|max:255|unique:printers,name,' . $printerId . ',id,store_id,' . Auth::user()->store_id,
            'type' => 'required|string|in:usb,network',
            'product_name' => 'nullable|string|max:255',

            // USB only
            'vendor_id' => ['nullable', 'required_if:type,usb', 'string', 'max:255', 'unique:printers,vendor_id,' . $printerId . ',id,store_id,' . Auth::user()->store_id],
            'product_id' => ['nullable', 'required_if:type,usb', 'string', 'max:255', 'unique:printers,product_id,' . $printerId . ',id,store_id,' . Auth::user()->store_id],
            'device_path' => ['nullable', 'string', 'max:255'],

            // Network only
            'host' => ['nullable', 'required_if:type,network', 'string', 'max:255'],
            'port' => ['nullable', 'required_if:type,network', 'integer', 'min:1', 'max:65535'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Já existe uma impressora com esse nome nessa loja.',
            'vendor_id.unique' => 'Já existe uma impressora USB com esse Vendor ID nessa loja.',
            'product_id.unique' => 'Já existe uma impressora USB com esse Product ID nessa loja.',
            'device_path.unique' => 'Já existe uma impressora USB com esse Device Path nessa loja.',
            'host.unique' => 'Já existe uma impressora de rede com esse IP/Host nessa loja.',
        ];
    }
}
