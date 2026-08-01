<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SdgsScore;
use App\Models\SdgsGoal;

class SdgsController extends Controller
{
    public function update(Request $request, $id)
    {
        $score = SdgsScore::find($id);
        if (!$score) return response()->json(['status' => 'error', 'message' => 'Tidak ditemukan'], 404);

        $request->validate([
            'score' => 'required|numeric|min:0|max:100',
        ]);

        $score->update(['score' => $request->score]);

        return response()->json([
            'status' => 'success',
            'message' => 'Skor SDGs berhasil diperbarui',
            'data' => $score
        ]);
    }
}
