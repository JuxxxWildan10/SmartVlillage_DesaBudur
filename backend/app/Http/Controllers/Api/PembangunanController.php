<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pembangunan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PembangunanController extends Controller
{
    public function index(Request $request)
    {
        $query = Pembangunan::query();
        
        if ($request->has('tahun')) {
            $query->where('tahun', $request->tahun);
        }
        
        $pembangunan = $query->orderBy('tahun', 'desc')->orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $pembangunan]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_proyek' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'anggaran' => 'required|numeric',
            'realisasi' => 'nullable|numeric',
            'sumber_dana' => 'required|string|max:255',
            'tahun' => 'required|integer',
            'persentase_progres' => 'nullable|integer|min:0|max:100',
            'status' => 'required|in:Direncanakan,Proses,Selesai',
            'keterangan' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 400);
        }

        $data = $request->except('foto');
        
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $file->getClientOriginalName());
            $file->storeAs('public/pembangunan', $filename);
            $data['foto'] = $filename;
        }

        $pembangunan = Pembangunan::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Proyek pembangunan berhasil ditambahkan.',
            'data' => $pembangunan
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pembangunan = Pembangunan::find($id);
        if (!$pembangunan) {
            return response()->json(['status' => 'error', 'message' => 'Proyek tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_proyek' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'anggaran' => 'required|numeric',
            'realisasi' => 'nullable|numeric',
            'sumber_dana' => 'required|string|max:255',
            'tahun' => 'required|integer',
            'persentase_progres' => 'nullable|integer|min:0|max:100',
            'status' => 'required|in:Direncanakan,Proses,Selesai',
            'keterangan' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 400);
        }

        $data = $request->except('foto');

        if ($request->hasFile('foto')) {
            if ($pembangunan->foto && Storage::exists('public/pembangunan/' . $pembangunan->foto)) {
                Storage::delete('public/pembangunan/' . $pembangunan->foto);
            }
            $file = $request->file('foto');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $file->getClientOriginalName());
            $file->storeAs('public/pembangunan', $filename);
            $data['foto'] = $filename;
        }

        $pembangunan->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Proyek berhasil diperbarui.',
            'data' => $pembangunan
        ]);
    }

    public function destroy($id)
    {
        $pembangunan = Pembangunan::find($id);
        if (!$pembangunan) {
            return response()->json(['status' => 'error', 'message' => 'Proyek tidak ditemukan'], 404);
        }

        if ($pembangunan->foto && Storage::exists('public/pembangunan/' . $pembangunan->foto)) {
            Storage::delete('public/pembangunan/' . $pembangunan->foto);
        }

        $pembangunan->delete();

        return response()->json(['status' => 'success', 'message' => 'Proyek berhasil dihapus.']);
    }
}
