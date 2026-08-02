<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nik'  => 'required|string|unique:users,email|min:16|max:16|regex:/^[0-9]+$/',
            'rt'   => 'required|string|max:5|regex:/^[0-9]+$/',
            'rw'   => 'required|string|max:5|regex:/^[0-9]+$/',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/', // Minimal 1 huruf + 1 angka
            ],
        ], [
            'nik.min'          => 'NIK harus 16 digit.',
            'nik.max'          => 'NIK harus 16 digit.',
            'nik.regex'        => 'NIK hanya boleh berisi angka.',
            'password.min'     => 'Password minimal 8 karakter.',
            'password.regex'   => 'Password harus mengandung minimal 1 huruf dan 1 angka.',
            'rt.regex'         => 'RT hanya boleh berisi angka.',
            'rw.regex'         => 'RW hanya boleh berisi angka.',
        ]);

        $user = User::create([
            'name'     => strip_tags($request->name),
            'email'    => strip_tags($request->nik), // NIK disimpan di kolom email
            'rt'       => strip_tags($request->rt),
            'rw'       => strip_tags($request->rw),
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('Warga');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Registrasi berhasil',
            'data'    => [
                'user' => $user->only(['id', 'name', 'rt', 'rw', 'created_at']),
                'role' => 'Warga',
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
            'message' => 'Logout successful'
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
