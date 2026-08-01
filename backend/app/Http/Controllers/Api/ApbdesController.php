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
        $request->validate([
            'tahun' => 'required|integer',
            'jenis' => 'required|in:Pendapatan,Belanja,Pembiayaan',
            'bidang' => 'required|string',
            'uraian' => 'required|string',
            'anggaran' => 'required|numeric',
            'realisasi' => 'nullable|numeric',
        ]);

        $item = ApbdesAnggaran::create($request->all());
        return response()->json(['status' => 'success', 'data' => $item], 201);
    }

    public function update(Request $request, $id)
    {
        $item = ApbdesAnggaran::find($id);
        if (!$item) return response()->json(['status' => 'error'], 404);

        $item->update($request->all());
        return response()->json(['status' => 'success', 'data' => $item]);
    }

    public function destroy($id)
    {
        ApbdesAnggaran::find($id)?->delete();
        return response()->json(['status' => 'success']);
    }
}
