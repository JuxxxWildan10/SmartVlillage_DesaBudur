<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Keluarga;

class KeluargaController extends Controller
{
    public function index()
    {
        // Ambil semua data keluarga beserta jumlah anggota (opsional tapi bagus untuk admin)
        $keluarga = Keluarga::withCount('anggota')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $keluarga
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_kk' => 'required|unique:keluarga|max:16',
            'kepala_keluarga' => 'required|string|max:255',
            'alamat' => 'required|string',
            'rt' => 'required|string|max:3',
            'rw' => 'required|string|max:3',
            'dusun' => 'required|string|max:255',
            'kode_pos' => 'nullable|string|max:5',
        ]);

        $keluarga = Keluarga::create($validated);
        return response()->json([
            'status' => 'success',
            'data' => $keluarga
        ], 201);
    }

    public function import(Request $request)
    {
        $request->validate([
            'data' => 'required|array'
        ]);

        $imported = 0;
        foreach ($request->data as $row) {
            if (isset($row['no_kk']) && isset($row['kepala_keluarga'])) {
                Keluarga::updateOrCreate(
                    ['no_kk' => $row['no_kk']],
                    [
                        'kepala_keluarga' => $row['kepala_keluarga'],
                        'alamat' => $row['alamat'] ?? '-',
                        'rt' => $row['rt'] ?? '000',
                        'rw' => $row['rw'] ?? '000',
                        'dusun' => $row['dusun'] ?? 'Dusun I',
                        'kode_pos' => $row['kode_pos'] ?? '45167'
                    ]
                );
                $imported++;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => "$imported data KK berhasil diimpor"
        ]);
    }

    public function show($id)
    {
        $keluarga = Keluarga::with('anggota')->find($id);
        if (!$keluarga) return response()->json(['status' => 'error', 'message' => 'Not found'], 404);

        return response()->json([
            'status' => 'success',
            'data' => $keluarga
        ]);
    }

    public function update(Request $request, $id)
    {
        $keluarga = Keluarga::find($id);
        if (!$keluarga) return response()->json(['status' => 'error', 'message' => 'Not found'], 404);

        $validated = $request->validate([
            'no_kk' => 'sometimes|required|max:16|unique:keluarga,no_kk,'.$id,
            'kepala_keluarga' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|required|string',
            'rt' => 'sometimes|required|string|max:3',
            'rw' => 'sometimes|required|string|max:3',
            'dusun' => 'sometimes|required|string|max:255',
            'kode_pos' => 'nullable|string|max:5',
        ]);

        $keluarga->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $keluarga
        ]);
    }

    public function destroy($id)
    {
        $keluarga = Keluarga::find($id);
        if ($keluarga) {
            $keluarga->delete();
            return response()->json(['status' => 'success']);
        }
        
        return response()->json(['status' => 'error', 'message' => 'Not found'], 404);
    }
}
