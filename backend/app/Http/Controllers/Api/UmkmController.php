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
        $request->validate([
            'nama_produk' => 'required|string',
            'pemilik' => 'required|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->except('foto');

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

        $request->validate([
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->except('foto');

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
