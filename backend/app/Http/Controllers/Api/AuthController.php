<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Penduduk;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register Warga Baru — dengan validasi NIK Matching.
     *
     * Alur:
     * 1. Validasi format input (NIK 16 digit, password kuat, dst).
     * 2. Cek NIK ke tabel `penduduk` → tolak jika tidak ditemukan.
     * 3. Cek NIK ke tabel `users` → tolak jika sudah punya akun.
     * 4. Buat akun baru, hubungkan ke data penduduk, assign role 'Warga'.
     */
    public function register(Request $request)
    {
        // Validasi format input
        $request->validate([
            'name'     => 'required|string|max:255',
            'nik'      => 'required|string|min:16|max:16|regex:/^[0-9]+$/',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/',
            ],
        ], [
            'nik.min'        => 'NIK harus 16 digit.',
            'nik.max'        => 'NIK harus 16 digit.',
            'nik.regex'      => 'NIK hanya boleh berisi angka.',
            'password.min'   => 'Password minimal 8 karakter.',
            'password.regex' => 'Password harus mengandung minimal 1 huruf dan 1 angka.',
        ]);

        $nik = $request->nik;

        // Langkah 1: Cek NIK di master data penduduk
        $penduduk = Penduduk::where('nik', $nik)->first();
        if (!$penduduk) {
            return response()->json([
                'status'  => 'error',
                'message' => 'NIK tidak terdaftar sebagai warga Desa Budur. Pastikan NIK Anda sudah tercatat di kantor desa.',
            ], 422);
        }

        // Langkah 2: Cek NIK di tabel users (sudah punya akun?)
        $existingUser = User::where('email', $nik)->first();
        if ($existingUser) {
            return response()->json([
                'status'  => 'error',
                'message' => 'NIK ini sudah memiliki akun. Silakan login menggunakan NIK dan password Anda.',
            ], 409);
        }

        // Langkah 3: Buat akun baru dan hubungkan ke data penduduk
        // Gunakan nama dari data penduduk jika ada, atau nama yang di-input
        $namaFinal = $penduduk->nama_lengkap ?? strip_tags($request->name);

        $user = User::create([
            'name'     => $namaFinal,
            'email'    => $nik,          // NIK disimpan di kolom email
            'password' => Hash::make($request->password),
            'rt'       => strip_tags($request->rt ?? $penduduk->rt ?? ''),
            'rw'       => strip_tags($request->rw ?? $penduduk->rw ?? ''),
        ]);

        $user->assignRole('Warga');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Registrasi berhasil. Selamat datang, ' . $namaFinal . '!',
            'data'    => [
                'user' => [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'nik'         => $nik,
                    'nama_lengkap'=> $penduduk->nama_lengkap,
                    'rt'          => $user->rt,
                    'rw'          => $user->rw,
                ],
                'role'  => 'Warga',
                'token' => $token,
            ],
        ], 201);
    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $credentials = [
            'email' => $request->email,
            'password' => $request->password
        ];

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
            
            // Get user role
            $role = $user->roles->first()->name ?? 'Warga';

            return response()->json([
                'status'  => 'success',
                'message' => 'Login successful',
                'data'    => [
                    'user'  => [
                        'id'   => $user->id,
                        'name' => $user->name,
                        'email' => $user->email, // NIK tersimpan di kolom email
                        'rt'   => $user->rt,
                        'rw'   => $user->rw,
                    ],
                    'role'  => $role,
                    'token' => $token,
                ],
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'NIK atau Password salah'
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Ganti password user yang sedang login.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed', // requires new_password_confirmation field
                'regex:/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/', // minimal 1 huruf 1 angka
            ],
        ], [
            'new_password.min' => 'Password baru minimal 8 karakter.',
            'new_password.confirmed' => 'Konfirmasi password baru tidak cocok.',
            'new_password.regex' => 'Password baru harus mengandung minimal 1 huruf dan 1 angka.',
        ]);

        $user = Auth::user();

        // Validasi password lama
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password saat ini salah.'
            ], 400);
        }

        // Update password baru
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil diubah. Pastikan Anda mengingat password baru Anda.'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'status' => 'success',
            'data'   => [
                'user' => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'rt'    => $user->rt,
                    'rw'    => $user->rw,
                ],
                'role' => $user->roles->first()->name ?? 'Warga',
            ],
        ]);
    }
}
