<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CategoryFormRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:categories,name,' . $this->get('id'),
            'parent_id' => 'nullable|exists:categories,id',
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
            'name.required' => 'O nome da categoria é obrigatório.',
            'name.string' => 'O nome da categoria deve ser uma string.',
            'name.max' => 'O nome da categoria não pode exceder 255 caracteres.',
            'name.unique' => 'Já existe uma categoria com este nome.',
            'parent_id.exists' => 'A categoria pai selecionada não existe.'
        ];
    }
}
