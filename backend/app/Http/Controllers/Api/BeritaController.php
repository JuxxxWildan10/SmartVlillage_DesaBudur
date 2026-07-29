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

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required',
            'kategori' => 'required',
            'isi_berita' => 'required',
        ]);

        $data = $request->all();
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

        $data = $request->all();
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
