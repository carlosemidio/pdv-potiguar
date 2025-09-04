<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'zipcode' => $this->faker->postcode,
            'uf' => $this->faker->stateAbbr,
            'city' => $this->faker->city,
            'neighborhood' => $this->faker->streetName,
            'street' => $this->faker->streetName,
            'number' => $this->faker->buildingNumber,
            'complement' => $this->faker->secondaryAddress,
        ];
    }
}
