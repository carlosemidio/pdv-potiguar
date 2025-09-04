<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreUpdateFormRequest extends FormRequest
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
        $storeId = $this->route('loja') ?? $this->get('loja');
        $userId = Auth::id();

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                "unique:stores,email, {$storeId},id,user_id,{$userId}"
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'domain' => [
                'required',
                'string',
                'max:255',
                "unique:stores,domain,{$storeId},id,city_id,{$storeId}"
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'latitude' => ['required', 'string', 'max:20'],
            'longitude' => ['required', 'string', 'max:20'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'status' => ['boolean'],
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
            'email.unique' => 'O e-mail já está em uso por outra loja.',
            'phone.max' => 'O telefone não pode ter mais de 20 caracteres.',
            'domain.required' => 'O domínio é obrigatório.',
            'domain.unique' => 'O domínio já está em uso por outra loja.',
            'description.max' => 'A descrição não pode ter mais de 255 caracteres.',
            'content.max' => 'O conteúdo não pode ter mais de 65535 caracteres.',
            'latitude.required' => 'A latitude é obrigatória.',
            'latitude.max' => 'A latitude não pode ter mais de 20 caracteres.',
            'longitude.required' => 'A longitude é obrigatória.',
            'longitude.max' => 'A longitude não pode ter mais de 20 caracteres.',
            'city_id.exists' => 'A cidade selecionada não é válida.',
            'status.boolean' => 'O status deve ser verdadeiro ou falso.',
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'O status deve ser verdadeiro ou falso.'
        ];
    }
}
