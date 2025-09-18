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
        $user = User::find(Auth::id());

        return [
            'name' => 'required|string|max:255|unique:products,name,NULL,id,tenant_id,' . $user->tenant_id,
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
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
        ];
    }
}
