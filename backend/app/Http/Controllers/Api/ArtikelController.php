<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Artikel;

class ArtikelController extends Controller
{
    public function index()
    {
        $artikel = Artikel::orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $artikel]);
    }

    public function show($id)
    {
        $artikel = Artikel::find($id);
        if (!$artikel) {
            return response()->json(['status' => 'error', 'message' => 'Artikel tidak ditemukan'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $artikel]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul'       => 'required|string|max:255',
            'kategori'    => 'required|string|in:Edukasi,Kesehatan,Pertanian,Hukum,Teknologi,Lainnya',
            'isi_artikel' => 'required|string',
            'penulis'     => 'nullable|string|max:100',
            'status'      => 'nullable|string|in:Published,Draft',
            'gambar_url'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = [
            'judul'       => strip_tags($request->judul),
            'kategori'    => $request->kategori,
            'isi_artikel' => strip_tags($request->isi_artikel),
            'penulis'     => strip_tags($request->penulis ?? 'Admin Desa Budur'),
            'status'      => $request->status ?? 'Published',
        ];

        if ($request->hasFile('gambar_url')) {
            $path = $request->file('gambar_url')->store('artikel', 'public');
            $data['gambar_url'] = '/api/artikel/image/' . basename($path);
        }

        $artikel = Artikel::create($data);

        return response()->json(['status' => 'success', 'data' => $artikel], 201);
    }

    public function update(Request $request, $id)
    {
        $artikel = Artikel::find($id);
        if (!$artikel) return response()->json(['status' => 'error', 'message' => 'Tidak ditemukan'], 404);

        $request->validate([
            'judul'       => 'sometimes|required|string|max:255',
            'kategori'    => 'sometimes|string|in:Edukasi,Kesehatan,Pertanian,Hukum,Teknologi,Lainnya',
            'isi_artikel' => 'sometimes|required|string',
            'penulis'     => 'nullable|string|max:100',
            'status'      => 'nullable|string|in:Published,Draft',
            'gambar_url'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = array_filter([
            'judul'       => isset($request->judul)       ? strip_tags($request->judul) : null,
            'kategori'    => $request->kategori,
            'isi_artikel' => isset($request->isi_artikel) ? strip_tags($request->isi_artikel) : null,
            'penulis'     => isset($request->penulis)     ? strip_tags($request->penulis) : null,
            'status'      => $request->status,
        ], fn($v) => $v !== null);

        if ($request->hasFile('gambar_url')) {
            $path = $request->file('gambar_url')->store('artikel', 'public');
            $data['gambar_url'] = '/api/artikel/image/' . basename($path);
        }

        $artikel->update($data);

        return response()->json(['status' => 'success', 'data' => $artikel]);
    }

    public function destroy($id)
    {
        $artikel = Artikel::find($id);
        if ($artikel) $artikel->delete();
        return response()->json(['status' => 'success']);
    }
}
