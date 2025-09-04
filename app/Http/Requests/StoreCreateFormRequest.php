<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCreateFormRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:stores,email,NULL,id,user_id,' . Auth::id()],
            'phone' => ['nullable', 'string', 'max:20'],
            'domain' => ['required', 'string', 'max:255', 'unique:stores,domain'],
            'city_id' => ['required', 'exists:cities,id'],
            'description' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'latitude' => ['nullable', 'string', 'max:20'],
            'longitude' => ['nullable', 'string', 'max:20'],
            'is_default' => ['nullable', 'boolean'],
            'status' => ['required', 'boolean'],
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
            'name.required' => 'O nome é obrigatório.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'O e-mail deve ser um endereço de e-mail válido.',
            'email.unique' => 'O e-mail já está em uso por outro usuário.',
            'phone.max' => 'O telefone não pode ter mais de 20 caracteres.',
            'domain.required' => 'O domínio é obrigatório.',
            'domain.unique' => 'O domínio já está em uso.',
            'city_id.required' => 'A cidade é obrigatória.',
            'city_id.exists' => 'A cidade selecionada não é válida.',
            'description.string' => 'A descrição deve ser uma string.',
            'description.max' => 'A descrição não pode ter mais de 255 caracteres.',
            'content.string' => 'O conteúdo deve ser uma string.',
            'latitude.string' => 'A latitude deve ser uma string.',
            'latitude.max' => 'A latitude não pode ter mais de 20 caracteres.',
            'longitude.string' => 'A longitude deve ser uma string.',
            'longitude.max' => 'A longitude não pode ter mais de 20 caracteres.',
            'is_default.boolean' => 'O campo padrão deve ser verdadeiro ou falso.',
            'status.required' => 'O status é obrigatório.',
            'status.boolean' => 'O status deve ser verdadeiro ou falso.',
        ];
    }
}
