<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SdgsScore;
use App\Models\SdgsGoal;

class SdgsController extends Controller
{
    public function index()
    {
        $scores = \Illuminate\Support\Facades\DB::table('sdgs_scores')
            ->join('sdgs_goals', 'sdgs_scores.goal_id', '=', 'sdgs_goals.id')
            ->where('sdgs_scores.year', date('Y')) // assume current year or just return all
            ->orWhere('sdgs_scores.year', 2026) // as used in DashboardController
            ->select('sdgs_scores.id', 'sdgs_goals.goal_number', 'sdgs_goals.title', 'sdgs_goals.color_hex', 'sdgs_scores.score', 'sdgs_scores.year')
            ->orderBy('sdgs_goals.goal_number')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $scores
        ]);
    }

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
