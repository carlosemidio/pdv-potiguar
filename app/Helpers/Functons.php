<?php

use App\Services\UnitService;
use Illuminate\Http\UploadedFile;
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
     * @param UploadedFile $file
     * @param string $path
     * @param string|null $fileName
     * @return string
     * @throws \Exception
     */
    function upload_file(UploadedFile $file, string $path, ?string $fileName = null): string
    {
        // Define nome único para o arquivo
        $fileName = $fileName ?? time() . '_' . $file->getClientOriginalName();

        // Verifica se o disk 'spaces' está configurado
        $useSpaces = config('filesystems.disks.spaces.key') &&
            config('filesystems.disks.spaces.secret') &&
            config('filesystems.disks.spaces.bucket') &&
            config('filesystems.disks.spaces.folder');

        if ($useSpaces) {
            $folder = rtrim(config('filesystems.disks.spaces.folder'), '/');
            $filePath = Storage::disk('spaces')->putFileAs($folder . '/' . trim($path, '/'), $file, $fileName);
            
            if (!$filePath) {
                throw new \Exception('Erro ao enviar o arquivo para o bucket Spaces.');
            }

            return Storage::disk('spaces')->url($filePath); // URL completa
        }

        // Upload para storage local
        $filePath = Storage::disk('public')->putFileAs(trim($path, '/'), $file, $fileName);

        if (!$filePath) {
            throw new \Exception('Erro ao enviar o arquivo para o storage local.');
        }

        return Storage::disk('public')->url($filePath); // URL completa
    }
}
