<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pengaduan;

class PengaduanController extends Controller
{
    public function index()
    {
        $pengaduan = Pengaduan::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $pengaduan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'isi_laporan' => 'required|string',
        ]);

        // Mengambil NIK (disimpan di field email) secara aman dari Token Sanctum
        $nik = $request->user()->email;

        $data = [
            'penduduk_id' => $nik, 
            'judul' => $request->judul,
            'isi_laporan' => $request->isi_laporan,
            'status' => 'Menunggu'
        ];

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('pengaduan', 'public');
            $data['foto'] = '/api/pengaduan/image/' . basename($path);
        }

        $pengaduan = Pengaduan::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaduan berhasil dikirim',
            'data' => $pengaduan
        ], 201);
    }

    // Update status (For Admin)
    public function update(Request $request, $id)
    {
        $pengaduan = Pengaduan::find($id);
        if (!$pengaduan) {
            return response()->json(['status' => 'error', 'message' => 'Not found'], 404);
        }

        $pengaduan->update([
            'status' => $request->status
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status pengaduan diperbarui',
            'data' => $pengaduan
        ]);
    }
}
