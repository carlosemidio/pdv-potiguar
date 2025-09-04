<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProductCreateFormRequest extends FormRequest
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
        $user = User::with('store')->find(Auth::id());

        return [
            'name' => [
                'required',
                'string',
                Rule::unique('products')->where(fn ($query) =>
                    $query->where('store_id', $user->store->id)
                ),
            ],
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'sku' => 'nullable|string|unique:products,sku',
            'price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'status' => 'boolean',
            'featured' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
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
            'name.required' => 'O nome do produto é obrigatório.',
            'name.unique' => 'Já existe um produto com este nome na loja.',
            'category_id.required' => 'A categoria do produto é obrigatória.',
            'category_id.exists' => 'A categoria selecionada não é válida.',
            'brand_id.exists' => 'A marca selecionada não é válida.',
            'description.required' => 'A descrição do produto é obrigatória.',
            'short_description.max' => 'A descrição curta não pode ter mais de 500 caracteres.',
            'sku.required' => 'O SKU do produto é obrigatório.',
            'sku.unique' => 'Já existe um produto com este SKU.',
            'price.required' => 'O preço do produto é obrigatório.',
            'price.numeric' => 'O preço deve ser um número válido.',
            'price.min' => 'O preço deve ser pelo menos 0.',
            'discount_price.numeric' => 'O preço com desconto deve ser um número válido.',
            'discount_price.min' => 'O preço com desconto deve ser pelo menos 0.',
            'discount_price.lt' => 'O preço com desconto deve ser menor que o preço normal.',
            'stock_quantity.required' => 'A quantidade em estoque é obrigatória.',
            'stock_quantity.integer' => 'A quantidade em estoque deve ser um número inteiro.',
            'stock_quantity.min' => 'A quantidade em estoque não pode ser negativa.',
            'status.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
            'featured.boolean' => 'O campo destacado deve ser verdadeiro ou falso.',
            'meta_title.max' => 'O título meta não pode ter mais de 255 caracteres.',
            'meta_description.string' => 'A descrição meta deve ser uma string.',
            'meta_keywords.string' => 'As palavras-chave meta devem ser uma string.'
        ];
    }
}
