<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MasterJenisSurat;

class MasterJenisSuratController extends Controller
{
    public function index()
    {
        $jenis = MasterJenisSurat::where('is_active', true)->orderBy('nama_surat')->get();
        return response()->json(['status' => 'success', 'data' => $jenis]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_surat' => 'required|string|max:10|unique:master_jenis_surat,kode_surat',
            'nama_surat' => 'required|string',
        ]);

        $jenis = MasterJenisSurat::create($request->except(['id', 'created_at', 'updated_at']));
        return response()->json(['status' => 'success', 'data' => $jenis], 201);
    }

    public function update(Request $request, $id)
    {
        $jenis = MasterJenisSurat::find($id);
        if (!$jenis) return response()->json(['status' => 'error', 'message' => 'Tidak ditemukan'], 404);

        $jenis->update($request->except(['id', 'created_at', 'updated_at']));
        return response()->json(['status' => 'success', 'data' => $jenis]);
    }

    public function destroy($id)
    {
        $jenis = MasterJenisSurat::find($id);
        if ($jenis) $jenis->delete();
        return response()->json(['status' => 'success']);
    }
}
