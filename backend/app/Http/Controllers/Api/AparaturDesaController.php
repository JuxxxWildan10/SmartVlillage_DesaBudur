<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AparaturDesa;

class AparaturDesaController extends Controller
{
    public function index()
    {
        $aparatur = AparaturDesa::where('status', 'Aktif')->orderBy('id')->get();
        return response()->json(['status' => 'success', 'data' => $aparatur]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string',
            'jabatan' => 'required|string',
        ]);

        $data = $request->except('foto');
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('aparatur', 'public');
            $data['foto'] = '/api/aparatur/image/' . basename($path);
        }

        $aparatur = AparaturDesa::create($data);
        return response()->json(['status' => 'success', 'data' => $aparatur], 201);
    }

    public function update(Request $request, $id)
    {
        $aparatur = AparaturDesa::find($id);
        if (!$aparatur) return response()->json(['status' => 'error', 'message' => 'Tidak ditemukan'], 404);

        $data = $request->except('foto');
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('aparatur', 'public');
            $data['foto'] = '/api/aparatur/image/' . basename($path);
        }

        $aparatur->update($data);
        return response()->json(['status' => 'success', 'data' => $aparatur]);
    }

    public function destroy($id)
    {
        AparaturDesa::find($id)?->delete();
        return response()->json(['status' => 'success']);
    }
}
