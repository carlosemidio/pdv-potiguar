<?php

use App\Services\UnitService;
use Illuminate\Support\Facades\Storage;

if (!function_exists('unit_convert')) {
    /**
     * Helper para converter unidades facilmente
     *
     * @param float $value
     * @param string $from
     * @param string $to
     * @return float
     */
    function unit_convert(float $value, string $from, string $to): float
    {
        return UnitService::convert($value, $from, $to);
    }
}

if (!function_exists('upload_file')) {
    /**
     * Helper para upload de arquivos
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $path
     * @return string
     */
    function upload_file($file, string $path): string
    {
        $filePath = '';

        if (env('DO_ACCESS_KEY_ID') && env('DO_SECRET_ACCESS_KEY') && env('DO_DEFAULT_REGION') && env('DO_BUCKET') && env('DO_FOLDER')) {
            $filePath = Storage::disk('spaces')->put(env('DO_FOLDER'), $file);
        } else {
            $filePath = Storage::disk('public')
                ->put($path, $file);
        }

        return $filePath;
    }
}