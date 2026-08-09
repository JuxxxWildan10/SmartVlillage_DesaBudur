<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DokumenDesa;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DokumenDesaController extends Controller
{
    public function index(Request $request)
    {
        $query = DokumenDesa::query();
        
        if ($request->has('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Default to showing only public docs unless requested by admin
        if (!$request->has('all') || $request->all !== 'true') {
            $query->where('is_public', true);
        }
        
        $dokumen = $query->orderBy('tahun', 'desc')->orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $dokumen]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'kategori' => 'required|in:RPJMDes,RKPDes,APBDes,Perdes,SK Kuwu,Lainnya',
            'tahun' => 'required|integer',
            'deskripsi' => 'nullable|string',
            'is_public' => 'boolean',
            'file' => 'required|file|mimes:pdf|max:10240', // max 10MB
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 400);
        }

        $data = $request->except('file');
        
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $file->getClientOriginalName());
            $file->storeAs('public/dokumen', $filename);
            $data['file_pdf'] = $filename;
        }

        if (!isset($data['is_public'])) {
            $data['is_public'] = true;
        }

        $dokumen = DokumenDesa::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Dokumen berhasil ditambahkan.',
            'data' => $dokumen
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $dokumen = DokumenDesa::find($id);
        if (!$dokumen) {
            return response()->json(['status' => 'error', 'message' => 'Dokumen tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'kategori' => 'required|in:RPJMDes,RKPDes,APBDes,Perdes,SK Kuwu,Lainnya',
            'tahun' => 'required|integer',
            'deskripsi' => 'nullable|string',
            'is_public' => 'boolean',
            'file' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 400);
        }

        $data = $request->except('file');

        if ($request->hasFile('file')) {
            if ($dokumen->file_pdf && Storage::exists('public/dokumen/' . $dokumen->file_pdf)) {
                Storage::delete('public/dokumen/' . $dokumen->file_pdf);
            }
            $file = $request->file('file');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $file->getClientOriginalName());
            $file->storeAs('public/dokumen', $filename);
            $data['file_pdf'] = $filename;
        }

        $dokumen->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Dokumen berhasil diperbarui.',
            'data' => $dokumen
        ]);
    }

    public function destroy($id)
    {
        $dokumen = DokumenDesa::find($id);
        if (!$dokumen) {
            return response()->json(['status' => 'error', 'message' => 'Dokumen tidak ditemukan'], 404);
        }

        if ($dokumen->file_pdf && Storage::exists('public/dokumen/' . $dokumen->file_pdf)) {
            Storage::delete('public/dokumen/' . $dokumen->file_pdf);
        }

        $dokumen->delete();

        return response()->json(['status' => 'success', 'message' => 'Dokumen berhasil dihapus.']);
    }
}
