<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class RoleStaffAndKuwuSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan role Kepala Desa dan Staff tersedia
        $kuwuRole = Role::firstOrCreate(['name' => 'Kepala Desa']);
        $staffRole = Role::firstOrCreate(['name' => 'Staff']);

        // Akun Kepala Desa
        $kuwuUser = User::firstOrCreate(
            ['email' => 'kepala_desa@budur.desa.id'],
            [
                'name' => 'Bapak Kepala Desa',
                'password' => Hash::make('password123'),
            ]
        );
        // Pastikan tidak duplicate roles
        if (!$kuwuUser->hasRole('Kepala Desa')) {
            $kuwuUser->assignRole($kuwuRole);
        }

        // Akun Staff
        $staffUser = User::firstOrCreate(
            ['email' => 'staff@budur.desa.id'],
            [
                'name' => 'Staff Pelayanan',
                'password' => Hash::make('password123'),
            ]
        );
        if (!$staffUser->hasRole('Staff')) {
            $staffUser->assignRole($staffRole);
        }
    }
}
