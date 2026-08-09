<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AparaturDesa;

class AparaturDesaController extends Controller
{
    public function index(Request $request)
    {
        // ?all=true digunakan oleh admin panel untuk melihat semua (aktif & non-aktif)
        if ($request->query('all') === 'true') {
            $aparatur = AparaturDesa::orderBy('id')->get();
        } else {
            // Default: hanya tampilkan aparatur aktif (untuk halaman publik profil desa)
            $aparatur = AparaturDesa::where('status', 'Aktif')->orderBy('id')->get();
        }
        return response()->json(['status' => 'success', 'data' => $aparatur]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'niap' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Aktif,Non-Aktif',
            'penduduk_id' => 'nullable|exists:penduduk,id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only(['nama_lengkap', 'jabatan', 'niap', 'status', 'penduduk_id']);
        
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('aparatur', 'public');
            $data['foto'] = '/api/aparatur/image/' . basename($path);
        }

        $aparatur = AparaturDesa::create($data);
        return response()->json(['status' => 'success', 'data' => $aparatur], 201);
    }

    public function update(Request $request, $id)
    {
        $aparatur = AparaturDesa::find($id);
        if (!$aparatur) return response()->json(['status' => 'error', 'message' => 'Tidak ditemukan'], 404);

        $validated = $request->validate([
            'nama_lengkap' => 'sometimes|required|string|max:255',
            'jabatan' => 'sometimes|required|string|max:255',
            'niap' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Aktif,Non-Aktif',
            'penduduk_id' => 'nullable|exists:penduduk,id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only(['nama_lengkap', 'jabatan', 'niap', 'status', 'penduduk_id']);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('aparatur', 'public');
            $data['foto'] = '/api/aparatur/image/' . basename($path);
        }

        $aparatur->update($data);
        return response()->json(['status' => 'success', 'data' => $aparatur]);
    }

    public function destroy($id)
    {
        AparaturDesa::find($id)?->delete();
        return response()->json(['status' => 'success']);
    }
}
