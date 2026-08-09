<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MasterJenisSurat;

class MasterJenisSuratController extends Controller
{
    public function index(Request $request)
    {
        // Query param ?all=true digunakan oleh admin panel untuk melihat semua jenis surat (aktif & non-aktif)
        if ($request->query('all') === 'true') {
            $jenis = MasterJenisSurat::orderBy('nama_surat')->get();
        } else {
            // Default: hanya tampilkan yang aktif (untuk form pengajuan warga)
            $jenis = MasterJenisSurat::where('is_active', true)->orderBy('nama_surat')->get();
        }
        return response()->json(['status' => 'success', 'data' => $jenis]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_surat' => 'required|string|max:10|unique:master_jenis_surat,kode_surat',
            'nama_surat' => 'required|string|max:255',
            'template_rtf' => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'is_active' => 'nullable|boolean'
        ]);

        $jenis = MasterJenisSurat::create($validated);
        return response()->json(['status' => 'success', 'data' => $jenis], 201);
    }

    public function update(Request $request, $id)
    {
        $jenis = MasterJenisSurat::find($id);
        if (!$jenis) return response()->json(['status' => 'error', 'message' => 'Tidak ditemukan'], 404);

        $validated = $request->validate([
            'kode_surat' => 'sometimes|required|string|max:10|unique:master_jenis_surat,kode_surat,'.$id,
            'nama_surat' => 'sometimes|required|string|max:255',
            'template_rtf' => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'is_active' => 'nullable|boolean'
        ]);

        $jenis->update($validated);
        return response()->json(['status' => 'success', 'data' => $jenis]);
    }

    public function destroy($id)
    {
        $jenis = MasterJenisSurat::find($id);
        if ($jenis) $jenis->delete();
        return response()->json(['status' => 'success']);
    }
}
