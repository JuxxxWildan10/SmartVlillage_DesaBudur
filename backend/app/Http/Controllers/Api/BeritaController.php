<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Berita;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $berita
        ]);
    }

    /**
     * Get detail satu berita by ID (Public)
     */
    public function show($id)
    {
        $berita = Berita::find($id);
        if (!$berita) {
            return response()->json(['status' => 'error', 'message' => 'Berita tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $berita
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'         => 'required|string|max:255',
            'kategori'      => 'required|string|max:255',
            'isi_berita'    => 'required|string',
            'status'        => 'nullable|string|in:Published,Draft',
            'tanggal_acara' => 'nullable|date',
            'lokasi_acara'  => 'nullable|string|max:255',
            'gambar_url'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only(['judul', 'kategori', 'isi_berita', 'status', 'tanggal_acara', 'lokasi_acara']);
        if (isset($data['judul']))        $data['judul']        = strip_tags($data['judul']);
        if (isset($data['kategori']))     $data['kategori']     = strip_tags($data['kategori']);
        if (isset($data['lokasi_acara'])) $data['lokasi_acara'] = strip_tags($data['lokasi_acara']);
        if (!isset($data['status'])) $data['status'] = 'Published';

        if ($request->hasFile('gambar_url')) {
            $path = $request->file('gambar_url')->store('berita', 'public');
            $data['gambar_url'] = '/api/berita/image/' . basename($path);
        }

        $berita = Berita::create($data);

        return response()->json([
            'status' => 'success',
            'data' => $berita
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $berita = Berita::find($id);
        if (!$berita) return response()->json(['status' => 'error'], 404);

        $validated = $request->validate([
            'judul'         => 'sometimes|required|string|max:255',
            'kategori'      => 'sometimes|required|string|max:255',
            'isi_berita'    => 'sometimes|required|string',
            'tanggal_acara' => 'nullable|date',
            'lokasi_acara'  => 'nullable|string|max:255',
            'gambar_url'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only(['judul', 'kategori', 'isi_berita', 'status', 'tanggal_acara', 'lokasi_acara']);
        if (isset($data['judul']))        $data['judul']        = strip_tags($data['judul']);
        if (isset($data['kategori']))     $data['kategori']     = strip_tags($data['kategori']);
        if (isset($data['lokasi_acara'])) $data['lokasi_acara'] = strip_tags($data['lokasi_acara']);

        if ($request->hasFile('gambar_url')) {
            $path = $request->file('gambar_url')->store('berita', 'public');
            $data['gambar_url'] = '/api/berita/image/' . basename($path);
        }

        $berita->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $berita
        ]);
    }

    public function destroy($id)
    {
        $berita = Berita::find($id);
        if ($berita) $berita->delete();

        return response()->json(['status' => 'success']);
    }
}
