<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UmkmProduct;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UmkmController extends Controller
{
    public function index()
    {
        $products = DB::table('umkm_products')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'pemilik' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'nomor_wa' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'stok' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'status' => 'nullable|string|max:50',
            'kategori_id' => 'nullable|exists:bumdes_kategori,id'
        ]);

        $data = $request->only([
            'nama_produk', 'pemilik', 'kategori', 'lokasi', 'deskripsi', 
            'harga', 'nomor_wa', 'alamat', 'stok', 'is_active', 'status', 'kategori_id'
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('umkm', 'public');
            $data['foto'] = '/api/umkm/image/' . basename($path);
        }

        $product = UmkmProduct::create($data);
        return response()->json([
            'status' => 'success',
            'data' => $product
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = UmkmProduct::find($id);
        if (!$product) return response()->json(['status' => 'error'], 404);

        $validated = $request->validate([
            'nama_produk' => 'sometimes|required|string|max:255',
            'pemilik' => 'sometimes|required|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'deskripsi' => 'sometimes|required|string',
            'harga' => 'sometimes|required|numeric|min:0',
            'nomor_wa' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'stok' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'status' => 'nullable|string|max:50',
            'kategori_id' => 'nullable|exists:bumdes_kategori,id'
        ]);

        $data = $request->only([
            'nama_produk', 'pemilik', 'kategori', 'lokasi', 'deskripsi', 
            'harga', 'nomor_wa', 'alamat', 'stok', 'is_active', 'status', 'kategori_id'
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('umkm', 'public');
            $data['foto'] = '/api/umkm/image/' . basename($path);
        }

        $product->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    public function destroy($id)
    {
        $product = UmkmProduct::find($id);
        if ($product) $product->delete();

        return response()->json(['status' => 'success']);
    }
}
