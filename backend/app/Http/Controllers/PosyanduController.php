<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Posyandu;

class PosyanduController extends Controller
{
    public function index()
    {
        $jadwal = Posyandu::orderBy('tanggal_waktu', 'asc')->get();
        return response()->json(['status' => 'success', 'data' => $jadwal]);
    }

    public function store(Request $request)
    {
        $posyandu = Posyandu::create($request->except(['id', 'created_at', 'updated_at']));
        return response()->json(['status' => 'success', 'data' => $posyandu], 201);
    }

    public function update(Request $request, $id)
    {
        $posyandu = Posyandu::find($id);
        if ($posyandu) $posyandu->update($request->except(['id', 'created_at', 'updated_at']));
        return response()->json(['status' => 'success', 'data' => $posyandu]);
    }

    public function destroy($id)
    {
        $posyandu = Posyandu::find($id);
        if ($posyandu) $posyandu->delete();
        return response()->json(['status' => 'success']);
    }
}
