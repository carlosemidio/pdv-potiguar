<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProductVariantFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = User::find(Auth::id());
        // Tentar obter o ID da variante a partir dos parâmetros de rota
        $variantId = $this->route('variantes_produto')
            ?? $this->route('product_variant')
            ?? $this->route('product-variant')
            ?? $this->route('id')
            ?? $this->input('id');

        return [
            'product_id' => 'required|exists:products,id',
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('product_variants', 'sku')
                    ->ignore($variantId)
                    ->where(function ($query) use ($user) {
                        return $query->where('tenant_id', $user->tenant_id);
                    }),
            ],
            'attributes' => 'array|min:1',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'O produto é obrigatório.',
            'product_id.exists' => 'O produto selecionado não é válido.',
            'sku.unique' => 'Já existe uma variante com este SKU na loja.',
            'sku.max' => 'O SKU não pode ter mais de 100 caracteres.',
            'attributes.array' => 'Os atributos devem ser um array.',
            'attributes.min' => 'É necessário selecionar pelo menos um atributo.',
        ];
    }
}
