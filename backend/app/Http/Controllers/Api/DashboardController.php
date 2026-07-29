<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPenduduk = DB::table('penduduk')->count();
        $totalKK = DB::table('keluarga')->count();
        $totalUMKM = DB::table('umkm_products')->where('is_active', true)->count();
        
        // Target SDGs yang sudah diisi skornya
        $targetSDGs = DB::table('sdgs_goals')->count();

        // GIS Boundaries
        $gisData = DB::table('gis_features')->get()->map(function($feature) {
            $feature->geojson_data = json_decode($feature->geojson_data);
            return $feature;
        });

        // SDGs Scores mapped by Goal
        $sdgsScores = DB::table('sdgs_scores')
            ->join('sdgs_goals', 'sdgs_scores.goal_id', '=', 'sdgs_goals.id')
            ->where('sdgs_scores.year', 2026) // latest year
            ->select('sdgs_goals.goal_number', 'sdgs_goals.title', 'sdgs_goals.color_hex', 'sdgs_scores.score')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'statistics' => [
                    'total_penduduk' => $totalPenduduk,
                    'total_kk' => $totalKK,
                    'total_umkm' => $totalUMKM,
                    'target_sdgs' => $targetSDGs,
                ],
                'gis_features' => $gisData,
                'sdgs_scores' => $sdgsScores
            ]
        ]);
    }
}
