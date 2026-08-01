<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BansosProgram;
use App\Models\BansosPenerima;
use Illuminate\Support\Facades\DB;

class BansosController extends Controller
{
    public function index()
    {
        $programs = DB::table('bansos_program')
            ->orderBy('tahun', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $programs
        ]);
    }

    public function store(Request $request)
    {
        $program = BansosProgram::create($request->except(['id', 'created_at', 'updated_at']));
        return response()->json([
            'status' => 'success',
            'data' => $program
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $program = BansosProgram::find($id);
        if (!$program) return response()->json(['status' => 'error'], 404);

        $program->update($request->except(['id', 'created_at', 'updated_at']));

        return response()->json([
            'status' => 'success',
            'data' => $program
        ]);
    }

    public function destroy($id)
    {
        $program = BansosProgram::find($id);
        if ($program) $program->delete();

        return response()->json(['status' => 'success']);
    }

    // --- Penerima Bansos Management ---

    public function getPenerima($program_id)
    {
        $penerima = BansosPenerima::with('keluarga')
            ->where('program_id', $program_id)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $penerima
        ]);
    }

    public function addPenerima(Request $request, $program_id)
    {
        $request->validate([
            'keluarga_id' => 'required|exists:keluarga,id',
            'status_penerimaan' => 'required|string',
            'keterangan' => 'nullable|string'
        ]);

        // Check if already exists
        $exists = BansosPenerima::where('program_id', $program_id)
            ->where('keluarga_id', $request->keluarga_id)
            ->first();

        if ($exists) {
            return response()->json(['status' => 'error', 'message' => 'Keluarga sudah terdaftar di program ini.'], 400);
        }

        $penerima = BansosPenerima::create([
            'program_id' => $program_id,
            'keluarga_id' => $request->keluarga_id,
            'status_penerimaan' => $request->status_penerimaan,
            'keterangan' => $request->keterangan
        ]);

        return response()->json(['status' => 'success', 'data' => $penerima], 201);
    }

    public function updatePenerima(Request $request, $penerima_id)
    {
        $penerima = BansosPenerima::find($penerima_id);
        if (!$penerima) return response()->json(['status' => 'error'], 404);

        $penerima->update($request->only(['status_penerimaan', 'keterangan']));

        return response()->json(['status' => 'success', 'data' => $penerima]);
    }

    public function removePenerima($penerima_id)
    {
        $penerima = BansosPenerima::find($penerima_id);
        if ($penerima) $penerima->delete();

        return response()->json(['status' => 'success']);
    }

    // --- Public Endpoint ---

    public function cekPenerima(Request $request)
    {
        $request->validate([
            'nkk' => 'required|string'
        ]);

        $keluarga = \App\Models\Keluarga::where('no_kk', $request->nkk)->first();

        if (!$keluarga) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nomor Kartu Keluarga (NKK) tidak ditemukan.'
            ], 404);
        }

        $penerima = BansosPenerima::with('program')
            ->where('keluarga_id', $keluarga->id)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'kepala_keluarga' => $keluarga->kepala_keluarga,
                'alamat' => $keluarga->alamat,
                'bansos' => $penerima
            ]
        ]);
    }
}
