<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AparaturDesaSeeder extends Seeder
{
    public function run(): void
    {
        $aparatur = [
            ['nama_lengkap' => 'Sandar Wiguna, S.E.', 'jabatan' => 'Kuwu (Kepala Desa)', 'status' => 'Aktif'],
            ['nama_lengkap' => 'Budi Santoso', 'jabatan' => 'Sekretaris Desa', 'status' => 'Aktif'],
            ['nama_lengkap' => 'Siti Aminah', 'jabatan' => 'Kaur Keuangan', 'status' => 'Aktif'],
            ['nama_lengkap' => 'Ahmad Yani', 'jabatan' => 'Kaur Perencanaan', 'status' => 'Aktif'],
            ['nama_lengkap' => 'Joko Anwar', 'jabatan' => 'Kasi Pemerintahan', 'status' => 'Aktif'],
            ['nama_lengkap' => 'Rini Wulandari', 'jabatan' => 'Kasi Kesejahteraan', 'status' => 'Aktif'],
            ['nama_lengkap' => 'Sholeh', 'jabatan' => 'Kasi Pelayanan', 'status' => 'Aktif'],
            ['nama_lengkap' => 'Hasanudin', 'jabatan' => 'Kepala Dusun I', 'status' => 'Aktif'],
        ];

        foreach ($aparatur as $item) {
            DB::table('aparatur_desa')->updateOrInsert(
                ['nama_lengkap' => $item['nama_lengkap']],
                array_merge($item, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
