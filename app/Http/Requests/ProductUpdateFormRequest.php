<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductUpdateFormRequest extends FormRequest
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
        $productId = $this->route('produto') ?? $this->get('produto');
        $product = Product::findOrFail($productId);

        return [
            'category_id' => 'sometimes|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'name' => [
                'required',
                'string',
                Rule::unique('products')
                ->where(fn ($query) =>
                $query->where('store_id', $product->store_id)
                )
                ->ignore($product->id),
            ],
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'short_description' => 'nullable|string|max:500',
            'sku' => 'nullable|string|unique:products,sku,' . $productId,
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
            'name.string' => 'O nome do produto deve ser uma string.',
            'name.max' => 'O nome do produto não pode exceder 255 caracteres.',
            'slug.required' => 'O slug do produto é obrigatório.',
            'slug.string' => 'O slug do produto deve ser uma string.',
            'category_id.exists' => 'A categoria selecionada não existe.',
            'brand_id.exists' => 'A marca selecionada não existe.',
            'sku.required' => 'O SKU do produto é obrigatório.',
            'sku.unique' => 'O SKU do produto já está em uso.',
            'price.required' => 'O preço do produto é obrigatório.',
            'price.numeric' => 'O preço do produto deve ser um número.',
            'stock_quantity.integer' => 'A quantidade em estoque deve ser um número inteiro.',
            'stock_quantity.min' => 'A quantidade em estoque não pode ser negativa.',
            'status.boolean' => 'O status do produto deve ser verdadeiro ou falso.',
            'featured.boolean' => 'O campo destacado deve ser verdadeiro ou falso.',
            'meta_title.max' => 'O título meta não pode ter mais de 255 caracteres.',
            'meta_description.string' => 'A descrição meta deve ser uma string.',
            'meta_keywords.string' => 'As palavras-chave meta devem ser uma string.'
        ];
    }
}
