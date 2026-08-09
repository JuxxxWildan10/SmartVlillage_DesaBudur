<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ApbdesAnggaran;

class ApbdesController extends Controller
{
    public function index(Request $request)
    {
        $tahun = $request->get('tahun', date('Y'));
        $data = ApbdesAnggaran::where('tahun', $tahun)->orderBy('jenis')->orderBy('bidang')->get();

        // Group by jenis (Pendapatan / Belanja / Pembiayaan)
        $grouped = $data->groupBy('jenis');

        return response()->json([
            'status' => 'success',
            'data' => $grouped,
            'tahun' => (int)$tahun,
            'tahun_list' => ApbdesAnggaran::distinct()->pluck('tahun')->sortDesc()->values()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun' => 'required|integer',
            'jenis' => 'required|in:Pendapatan,Belanja,Pembiayaan',
            'bidang' => 'required|string|max:255',
            'uraian' => 'required|string|max:255',
            'anggaran' => 'required|numeric|min:0',
            'realisasi' => 'nullable|numeric|min:0',
        ]);

        $item = ApbdesAnggaran::create($validated);
        return response()->json(['status' => 'success', 'data' => $item], 201);
    }

    public function update(Request $request, $id)
    {
        $item = ApbdesAnggaran::find($id);
        if (!$item) return response()->json(['status' => 'error'], 404);

        $validated = $request->validate([
            'tahun' => 'sometimes|required|integer',
            'jenis' => 'sometimes|required|in:Pendapatan,Belanja,Pembiayaan',
            'bidang' => 'sometimes|required|string|max:255',
            'uraian' => 'sometimes|required|string|max:255',
            'anggaran' => 'sometimes|required|numeric|min:0',
            'realisasi' => 'nullable|numeric|min:0',
        ]);

        $item->update($validated);
        return response()->json(['status' => 'success', 'data' => $item]);
    }

    public function destroy($id)
    {
        ApbdesAnggaran::find($id)?->delete();
        return response()->json(['status' => 'success']);
    }
}
