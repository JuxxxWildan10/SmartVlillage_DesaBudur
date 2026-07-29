<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SmartVillageSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions
        $adminRole = Role::create(['name' => 'Super Admin']);
        $kuwuRole = Role::create(['name' => 'Kepala Desa']);
        $wargaRole = Role::create(['name' => 'Warga']);

        $adminUser = User::create([
            'name' => 'Admin Desa Budur',
            'email' => 'admin@budur.desa.id',
            'password' => Hash::make('password123'),
        ]);
        $adminUser->assignRole($adminRole);

        // 2. Kependudukan (Keluarga & Penduduk)
        $keluargaId = DB::table('keluarga')->insertGetId([
            'no_kk' => '3209121234567890',
            'kepala_keluarga' => 'Budi Santoso',
            'alamat' => 'Blok Kliwon, RT 02 RW 01',
            'rt' => '02',
            'rw' => '01',
            'dusun' => 'Kliwon',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('penduduk')->insert([
            [
                'nik' => '3209120101800001',
                'keluarga_id' => $keluargaId,
                'nama_lengkap' => 'Budi Santoso',
                'tempat_lahir' => 'Cirebon',
                'tanggal_lahir' => '1980-01-01',
                'jenis_kelamin' => 'Laki-laki',
                'agama' => 'Islam',
                'pendidikan' => 'SMA Sederajat',
                'pekerjaan' => 'Wiraswasta',
                'status_perkawinan' => 'Kawin',
                'status_hubungan_dalam_keluarga' => 'Kepala Keluarga',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 3. SDGs Goals
        $goals = [
            ['goal_number' => 1, 'title' => 'Desa Tanpa Kemiskinan', 'color_hex' => '#E5243B'],
            ['goal_number' => 2, 'title' => 'Desa Tanpa Kelaparan', 'color_hex' => '#DDA63A'],
            ['goal_number' => 3, 'title' => 'Desa Sehat dan Sejahtera', 'color_hex' => '#4C9F38'],
            ['goal_number' => 4, 'title' => 'Pendidikan Desa Berkualitas', 'color_hex' => '#C5192D'],
            ['goal_number' => 5, 'title' => 'Keterlibatan Perempuan Desa', 'color_hex' => '#FF3A21'],
            ['goal_number' => 6, 'title' => 'Desa Layak Air Bersih dan Sanitasi', 'color_hex' => '#26BDE2'],
            ['goal_number' => 7, 'title' => 'Desa Berenergi Bersih dan Terbarukan', 'color_hex' => '#FCC30B'],
            ['goal_number' => 8, 'title' => 'Pertumbuhan Ekonomi Desa Merata', 'color_hex' => '#A21942'],
            ['goal_number' => 9, 'title' => 'Infrastruktur dan Inovasi Desa', 'color_hex' => '#FD6925'],
            ['goal_number' => 10, 'title' => 'Desa Tanpa Kesenjangan', 'color_hex' => '#DD1367'],
            ['goal_number' => 11, 'title' => 'Kawasan Pemukiman Desa Aman dan Nyaman', 'color_hex' => '#FD9D24'],
            ['goal_number' => 12, 'title' => 'Konsumsi dan Produksi Desa Sadar Lingkungan', 'color_hex' => '#BF8B2E'],
            ['goal_number' => 13, 'title' => 'Desa Tanggap Perubahan Iklim', 'color_hex' => '#3F7E44'],
            ['goal_number' => 14, 'title' => 'Desa Peduli Lingkungan Laut', 'color_hex' => '#0A97D9'],
            ['goal_number' => 15, 'title' => 'Desa Peduli Lingkungan Darat', 'color_hex' => '#56C02B'],
            ['goal_number' => 16, 'title' => 'Desa Damai Berkeadilan', 'color_hex' => '#00689D'],
            ['goal_number' => 17, 'title' => 'Kemitraan untuk Pembangunan Desa', 'color_hex' => '#19486A'],
            ['goal_number' => 18, 'title' => 'Kelembagaan Desa Dinamis dan Budaya Desa Adaptif', 'color_hex' => '#000000'],
        ];

        foreach ($goals as $goal) {
            $goalId = DB::table('sdgs_goals')->insertGetId(array_merge($goal, ['created_at' => now(), 'updated_at' => now()]));
            
            // Random score for year 2026
            DB::table('sdgs_scores')->insert([
                'goal_id' => $goalId,
                'year' => 2026,
                'score' => rand(4000, 9500) / 100, // 40.00 to 95.00
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 4. GIS Data (Realistic polygon for Budur, Ciwaringin)
        DB::table('gis_features')->insert([
            'name' => 'Batas Desa Budur',
            'type' => 'Batas Desa',
            'geojson_data' => '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[108.347,-6.670],[108.355,-6.668],[108.365,-6.670],[108.368,-6.675],[108.366,-6.685],[108.355,-6.688],[108.345,-6.682],[108.342,-6.675],[108.347,-6.670]]]},"properties":{}}',
            'color' => '#1B5E20',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
