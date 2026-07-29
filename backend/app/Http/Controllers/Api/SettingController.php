<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Berita;
use App\Models\Posyandu;
use Carbon\Carbon;

class SettingController extends Controller
{
    public function getRunningText()
    {
        // Get Admin Custom Text
        $adminText = Setting::where('key', 'running_text')->first();
        $textParts = [];
        
        if ($adminText && !empty($adminText->value)) {
            $textParts[] = $adminText->value;
        }

        // Get Latest Berita
        $latestBerita = Berita::orderBy('created_at', 'desc')->first();
        if ($latestBerita) {
            $textParts[] = "Berita Terbaru: " . $latestBerita->judul;
        }

        // Get Nearest Posyandu
        $nearestPosyandu = Posyandu::where('tanggal_waktu', '>=', Carbon::now())
                            ->orderBy('tanggal_waktu', 'asc')
                            ->first();
        if ($nearestPosyandu) {
            $tanggal = Carbon::parse($nearestPosyandu->tanggal_waktu)->translatedFormat('d F Y H:i');
            $textParts[] = "Jadwal Posyandu Terdekat: {$nearestPosyandu->nama_kegiatan} pada {$tanggal} di {$nearestPosyandu->lokasi}";
        }

        if (empty($textParts)) {
            $textParts[] = "Selamat Datang di Sistem Smart Village Desa Budur.";
        }

        // Join parts with separator
        $runningText = implode(" | ", $textParts);

        return response()->json([
            'status' => 'success',
            'data' => [
                'text' => $runningText,
                'raw_admin' => $adminText ? $adminText->value : ''
            ]
        ]);
    }

    public function updateRunningText(Request $request)
    {
        $request->validate([
            'text' => 'nullable|string'
        ]);

        Setting::updateOrCreate(
            ['key' => 'running_text'],
            ['value' => $request->text]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Info Desa berhasil diperbarui'
        ]);
    }
}
