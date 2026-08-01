<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterJenisSuratSeeder extends Seeder
{
    public function run(): void
    {
        $jenisSurat = [
            [
                'kode_surat' => 'SKU',
                'nama_surat' => 'Surat Keterangan Usaha (SKU)',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi KK\n3. Surat pernyataan usaha",
                'is_active' => true,
            ],
            [
                'kode_surat' => 'SKTM',
                'nama_surat' => 'Surat Keterangan Tidak Mampu (SKTM)',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi KK\n3. Surat keterangan RT/RW",
                'is_active' => true,
            ],
            [
                'kode_surat' => 'DOMISILI',
                'nama_surat' => 'Surat Keterangan Domisili',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi KK",
                'is_active' => true,
            ],
            [
                'kode_surat' => 'NIKAH',
                'nama_surat' => 'Surat Pengantar Nikah',
                'persyaratan' => "1. Fotokopi KTP\n2. Fotokopi KK\n3. Akta kelahiran\n4. Pas foto 2x3 dan 3x4",
                'is_active' => true,
            ],
            [
                'kode_surat' => 'KEMATIAN',
                'nama_surat' => 'Surat Keterangan Kematian',
                'persyaratan' => "1. Fotokopi KTP almarhum/ah\n2. Fotokopi KK\n3. Surat keterangan dari dokter/bidan (jika ada)",
                'is_active' => true,
            ],
            [
                'kode_surat' => 'KELAHIRAN',
                'nama_surat' => 'Surat Keterangan Kelahiran',
                'persyaratan' => "1. Fotokopi KTP orang tua\n2. Fotokopi KK\n3. Surat keterangan lahir dari bidan/RS",
                'is_active' => true,
            ],
        ];

        foreach ($jenisSurat as $item) {
            DB::table('master_jenis_surat')->updateOrInsert(
                ['kode_surat' => $item['kode_surat']],
                array_merge($item, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
