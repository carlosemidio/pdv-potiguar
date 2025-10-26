<?php

use App\Services\UnitService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
     * Upload de arquivos para storage local ou DigitalOcean Spaces
     *
     * @param UploadedFile $file
     * @param string $path Caminho relativo dentro do storage ou bucket
     * @param bool $public Define se o arquivo será público (default false)
     * @return string Retorna o caminho relativo do arquivo
     * @throws \Exception
     */
    function upload_file(UploadedFile $file, string $path, bool $public = false): string
    {
        $fileName = Str::random(12) . '_' . $file->getClientOriginalName();
        $fileName = preg_replace('/\s+/', '_', $fileName); // remove espaços

        $useSpaces = config('filesystems.disks.spaces.key')
                  && config('filesystems.disks.spaces.secret')
                  && config('filesystems.disks.spaces.bucket')
                  && config('filesystems.disks.spaces.endpoint');

        if ($useSpaces) {
            $disk = Storage::disk('spaces');
            $folder = trim(config('filesystems.disks.spaces.folder', ''), '/');
            $fullPath = trim($path, '/');
            $targetPath = $folder ? "$folder/$fullPath" : $fullPath;

            // Aqui usamos put() para manter comportamento privado ou público
            $storedPath = $disk->put("$targetPath/$fileName", file_get_contents($file),
                $public ? 'public' : 'private'
            );

            if (!$storedPath) {
                throw new \Exception('Erro ao salvar arquivo no bucket Spaces.');
            }

            return "$targetPath/$fileName"; // retorna caminho relativo
        }

        // Caso local
        $disk = Storage::disk('public');
        $storedPath = $disk->put("$path/$fileName", file_get_contents($file));

        if (!$storedPath) {
            throw new \Exception('Erro ao salvar arquivo no storage local.');
        }

        return "$path/$fileName"; // retorna caminho relativo
    }
}

