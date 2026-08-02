<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pengaduan;
use App\Models\Penduduk;

class PengaduanController extends Controller
{
    /**
     * Fetch pengaduan list.
     * - Admin: semua pengaduan (dengan nama penduduk)
     * - Warga: hanya pengaduan milik user yang login
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('Admin') || $user->hasRole('Super Admin') || $user->hasRole('Perangkat Desa')) {
            $pengaduan = Pengaduan::with('penduduk:id,nama_lengkap,nik')
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $nik = $user->email;
            $penduduk = Penduduk::where('nik', $nik)->first();

            if (!$penduduk) {
                return response()->json([
                    'status' => 'success',
                    'data' => [],
                ]);
            }

            $pengaduan = Pengaduan::with('penduduk:id,nama_lengkap,nik')
                ->where('penduduk_id', $penduduk->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $pengaduan
        ]);
    }

    /**
     * Submit pengaduan baru (Warga)
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'isi_laporan' => 'required|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $nik = $request->user()->email;
        $penduduk = Penduduk::where('nik', $nik)->first();

        if (!$penduduk) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data penduduk tidak ditemukan untuk NIK ini.'
            ], 404);
        }

        $data = [
            'penduduk_id' => $penduduk->id,
            'judul'       => strip_tags($request->judul),
            'isi_laporan' => strip_tags($request->isi_laporan),
            'status'      => 'Menunggu',
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

    /**
     * Update status pengaduan + tanggapan admin (Admin only)
     */
    public function update(Request $request, $id)
    {
        $pengaduan = Pengaduan::find($id);
        if (!$pengaduan) {
            return response()->json(['status' => 'error', 'message' => 'Pengaduan tidak ditemukan'], 404);
        }

        $updateData = [];

        if ($request->has('status')) {
            $allowedStatuses = ['Menunggu', 'Diproses', 'Selesai', 'Ditolak'];
            if (in_array($request->status, $allowedStatuses)) {
                $updateData['status'] = $request->status;
            }
        }

        if ($request->has('tanggapan_admin') && !empty($request->tanggapan_admin)) {
            $updateData['tanggapan_admin'] = strip_tags($request->tanggapan_admin);
            $updateData['tanggapan_at']    = now();
        }

        $pengaduan->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaduan diperbarui',
            'data' => $pengaduan->load('penduduk:id,nama_lengkap,nik')
        ]);
    }

    /**
     * Hapus pengaduan (Admin only)
     */
    public function destroy($id)
    {
        $pengaduan = Pengaduan::find($id);
        if (!$pengaduan) {
            return response()->json(['status' => 'error', 'message' => 'Pengaduan tidak ditemukan'], 404);
        }

        $pengaduan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaduan berhasil dihapus'
        ]);
    }
}
