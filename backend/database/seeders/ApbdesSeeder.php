<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApbdesSeeder extends Seeder
{
    public function run(): void
    {
        $tahun = 2026;

        // Clear existing data for this year
        DB::table('apbdes_anggaran')->where('tahun', $tahun)->delete();

        $data = [
            // PENDAPATAN
            ['tahun' => $tahun, 'jenis' => 'Pendapatan', 'bidang' => 'PADes', 'uraian' => 'Pendapatan Asli Desa (PADes)', 'anggaran' => 150000000, 'realisasi' => 0],
            ['tahun' => $tahun, 'jenis' => 'Pendapatan', 'bidang' => 'Dana Desa', 'uraian' => 'Dana Desa (Pemerintah Pusat)', 'anggaran' => 850000000, 'realisasi' => 0],
            ['tahun' => $tahun, 'jenis' => 'Pendapatan', 'bidang' => 'ADD', 'uraian' => 'Alokasi Dana Desa (Kabupaten)', 'anggaran' => 350000000, 'realisasi' => 0],

            // BELANJA
            ['tahun' => $tahun, 'jenis' => 'Belanja', 'bidang' => 'Pemerintahan', 'uraian' => 'Bidang Penyelenggaraan Pemerintahan Desa', 'anggaran' => 400000000, 'realisasi' => 0],
            ['tahun' => $tahun, 'jenis' => 'Belanja', 'bidang' => 'Pembangunan', 'uraian' => 'Bidang Pelaksanaan Pembangunan Desa', 'anggaran' => 600000000, 'realisasi' => 0],
            ['tahun' => $tahun, 'jenis' => 'Belanja', 'bidang' => 'Pembinaan', 'uraian' => 'Bidang Pembinaan Kemasyarakatan', 'anggaran' => 150000000, 'realisasi' => 0],
            ['tahun' => $tahun, 'jenis' => 'Belanja', 'bidang' => 'Pemberdayaan', 'uraian' => 'Bidang Pemberdayaan Masyarakat (UMKM)', 'anggaran' => 200000000, 'realisasi' => 0],
        ];

        foreach ($data as $item) {
            DB::table('apbdes_anggaran')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }
    }
}
