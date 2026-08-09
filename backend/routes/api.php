<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SuratController;
use App\Http\Controllers\Api\PengaduanController;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\BansosController;
use App\Http\Controllers\Api\PendudukController;
use App\Http\Controllers\Api\KeluargaController;
use App\Http\Controllers\Api\DokumenDesaController;
use App\Http\Controllers\Api\PembangunanController;

// ===================================================================
// PUBLIC GET ROUTES (No Auth Required)
// ===================================================================

Route::middleware('throttle:60,1')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/running-text', [SettingController::class, 'getRunningText']);

    // Public Data Reads
    Route::get('/umkm', [UmkmController::class, 'index']);
    Route::get('/bansos', [BansosController::class, 'index']);
    Route::post('/bansos/cek', [BansosController::class, 'cekPenerima']);
    Route::get('/statistik', [PendudukController::class, 'statistik']);
    Route::get('/posyandu', [\App\Http\Controllers\PosyanduController::class, 'index']);
    Route::get('/forum', [\App\Http\Controllers\ForumTopicController::class, 'index']);
    Route::get('/forum/{id}', [\App\Http\Controllers\ForumTopicController::class, 'show']);
    Route::get('/berita', [BeritaController::class, 'index']);
    Route::get('/berita/{id}', [BeritaController::class, 'show']);

    // Public Surat Tracking (no auth needed for tracking)
    Route::get('/surat/track/{code}', [SuratController::class, 'track']);
    Route::get('/surat/{identifier}/pdf', [SuratController::class, 'generatePdf']);

    // Master Jenis Surat (public read)
    Route::get('/master-surat', [\App\Http\Controllers\Api\MasterJenisSuratController::class, 'index']);

    // Public APBDes & Aparatur & SDGs
    Route::get('/apbdes', [\App\Http\Controllers\Api\ApbdesController::class, 'index']);
    Route::get('/sdgs', [\App\Http\Controllers\Api\SdgsController::class, 'index']);
    Route::get('/aparatur', [\App\Http\Controllers\Api\AparaturDesaController::class, 'index']);
    Route::get('/dokumen', [DokumenDesaController::class, 'index']);
    Route::get('/pembangunan', [PembangunanController::class, 'index']);
});

// Public Media Serving — dengan proteksi path traversal
Route::get('/umkm/image/{filename}', function ($filename) {
    // Validasi: hanya karakter aman yang diizinkan (tidak ada ../ atau path lain)
    if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename) || str_contains($filename, '..')) {
        abort(400, 'Nama file tidak valid.');
    }
    $path = storage_path('app/public/umkm/' . $filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'image/jpeg';
    // Pastikan hanya file gambar yang bisa diakses
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])) abort(403);
    return response(file_get_contents($path), 200)->header('Content-Type', $mime);
});
Route::get('/berita/image/{filename}', function ($filename) {
    if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename) || str_contains($filename, '..')) {
        abort(400, 'Nama file tidak valid.');
    }
    $path = storage_path('app/public/berita/' . $filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'image/jpeg';
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])) abort(403);
    return response(file_get_contents($path), 200)->header('Content-Type', $mime);
});
Route::get('/pengaduan/image/{filename}', function ($filename) {
    if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename) || str_contains($filename, '..')) {
        abort(400, 'Nama file tidak valid.');
    }
    $path = storage_path('app/public/pengaduan/' . $filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'image/jpeg';
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])) abort(403);
    return response(file_get_contents($path), 200)->header('Content-Type', $mime);
});
Route::get('/aparatur/image/{filename}', function ($filename) {
    if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename) || str_contains($filename, '..')) {
        abort(400, 'Nama file tidak valid.');
    }
    $path = storage_path('app/public/aparatur/' . $filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'image/jpeg';
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])) abort(403);
    return response(file_get_contents($path), 200)->header('Content-Type', $mime);
});
Route::get('/pembangunan/image/{filename}', function ($filename) {
    if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename) || str_contains($filename, '..')) {
        abort(400, 'Nama file tidak valid.');
    }
    $path = storage_path('app/public/pembangunan/' . $filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'image/jpeg';
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])) abort(403);
    return response(file_get_contents($path), 200)->header('Content-Type', $mime);
});


// ===================================================================
// AUTHENTICATION (Rate Limited)
// ===================================================================

Route::middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// ===================================================================
// AUTHENTICATED ROUTES (Warga & Admin)
// ===================================================================

Route::middleware('auth:sanctum')->group(function () {
    // Auth utilities
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ---------------------------------------------------------------
    // WARGA LAYANAN (Rate Limited — max 5 req/menit)
    // ---------------------------------------------------------------
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/surat', [SuratController::class, 'store']);
        Route::post('/pengaduan', [PengaduanController::class, 'store']);
    });

    // Warga: baca data milik sendiri
    Route::get('/surat', [SuratController::class, 'index']);
    Route::get('/pengaduan', [PengaduanController::class, 'index']);

    // Forum Warga (create topic & reply — authenticated users only)
    Route::post('/forum', [\App\Http\Controllers\ForumTopicController::class, 'store']);
    Route::post('/forum/{topicId}/reply', [\App\Http\Controllers\ForumReplyController::class, 'store']);

    // ---------------------------------------------------------------
    // ADMIN ONLY ROUTES
    // ---------------------------------------------------------------
    // ---------------------------------------------------------------
    // KEPALA DESA & ADMIN (Potensi & Statistik)
    // ---------------------------------------------------------------
    Route::middleware(['role:Admin|Super Admin|Kepala Desa', 'throttle:60,1'])->group(function () {
        // UMKM, APBDes, SDGs, dll (Melihat grafik & potensi)
        Route::post('/umkm', [UmkmController::class, 'store']);
        Route::put('/umkm/{id}', [UmkmController::class, 'update']);
        Route::delete('/umkm/{id}', [UmkmController::class, 'destroy']);

        Route::post('/apbdes', [\App\Http\Controllers\Api\ApbdesController::class, 'store']);
        Route::put('/apbdes/{id}', [\App\Http\Controllers\Api\ApbdesController::class, 'update']);
        Route::delete('/apbdes/{id}', [\App\Http\Controllers\Api\ApbdesController::class, 'destroy']);

        Route::post('/dokumen', [DokumenDesaController::class, 'store']);
        Route::put('/dokumen/{id}', [DokumenDesaController::class, 'update']);
        Route::delete('/dokumen/{id}', [DokumenDesaController::class, 'destroy']);

        Route::post('/pembangunan', [PembangunanController::class, 'store']);
        Route::put('/pembangunan/{id}', [PembangunanController::class, 'update']);
        Route::delete('/pembangunan/{id}', [PembangunanController::class, 'destroy']);

        Route::put('/sdgs/{id}', [\App\Http\Controllers\Api\SdgsController::class, 'update']);
    });

    // ---------------------------------------------------------------
    // STAFF PELAYANAN & ADMIN (Pelayanan Surat & Aduan)
    // ---------------------------------------------------------------
    Route::middleware(['role:Admin|Super Admin|Perangkat Desa|Staff', 'throttle:60,1'])->group(function () {
        // Kelola Surat
        Route::put('/surat/{id}', [SuratController::class, 'update']);
        Route::delete('/surat/{id}', [SuratController::class, 'destroy']);

        // Kelola Pengaduan
        Route::put('/pengaduan/{id}', [PengaduanController::class, 'update']);
        Route::delete('/pengaduan/{id}', [PengaduanController::class, 'destroy']);
    });

    // ---------------------------------------------------------------
    // ADMIN ONLY ROUTES (Manajemen Sistem, Master Data, Kependudukan Utama)
    // ---------------------------------------------------------------
    Route::middleware(['role:Admin|Super Admin', 'throttle:60,1'])->group(function () {
        // Kelola Forum (admin moderation)
        Route::put('/forum/{id}', [\App\Http\Controllers\ForumTopicController::class, 'update']);
        Route::delete('/forum/{id}', [\App\Http\Controllers\ForumTopicController::class, 'destroy']);
        Route::delete('/forum/reply/{id}', [\App\Http\Controllers\ForumReplyController::class, 'destroy']);

        // Kelola Bansos
        Route::post('/bansos', [BansosController::class, 'store']);
        Route::put('/bansos/{id}', [BansosController::class, 'update']);
        Route::delete('/bansos/{id}', [BansosController::class, 'destroy']);
        Route::get('/bansos/{program_id}/penerima', [BansosController::class, 'getPenerima']);
        Route::post('/bansos/{program_id}/penerima', [BansosController::class, 'addPenerima']);
        Route::put('/bansos/penerima/{penerima_id}', [BansosController::class, 'updatePenerima']);
        Route::delete('/bansos/penerima/{penerima_id}', [BansosController::class, 'removePenerima']);

        // Kelola Berita
        Route::post('/berita', [BeritaController::class, 'store']);
        Route::put('/berita/{id}', [BeritaController::class, 'update']);
        Route::delete('/berita/{id}', [BeritaController::class, 'destroy']);

        // Kelola Penduduk
        Route::get('/penduduk', [PendudukController::class, 'index']);
        Route::post('/penduduk', [PendudukController::class, 'store']);
        Route::put('/penduduk/{id}', [PendudukController::class, 'update']);
        Route::delete('/penduduk/{id}', [PendudukController::class, 'destroy']);

        // Kelola Keluarga
        Route::get('/keluarga', [KeluargaController::class, 'index']);
        Route::get('/keluarga/{id}', [KeluargaController::class, 'show']);
        Route::post('/keluarga/import', [KeluargaController::class, 'import']);
        Route::post('/keluarga', [KeluargaController::class, 'store']);
        Route::put('/keluarga/{id}', [KeluargaController::class, 'update']);
        Route::delete('/keluarga/{id}', [KeluargaController::class, 'destroy']);

        // Kelola Posyandu
        Route::post('/posyandu', [\App\Http\Controllers\PosyanduController::class, 'store']);
        Route::put('/posyandu/{id}', [\App\Http\Controllers\PosyanduController::class, 'update']);
        Route::delete('/posyandu/{id}', [\App\Http\Controllers\PosyanduController::class, 'destroy']);

        // Kelola Settings
        Route::post('/settings/running-text', [SettingController::class, 'updateRunningText']);

        // Kelola Master Jenis Surat
        Route::post('/master-surat', [\App\Http\Controllers\Api\MasterJenisSuratController::class, 'store']);
        Route::put('/master-surat/{id}', [\App\Http\Controllers\Api\MasterJenisSuratController::class, 'update']);
        Route::delete('/master-surat/{id}', [\App\Http\Controllers\Api\MasterJenisSuratController::class, 'destroy']);

        // Kelola Aparatur Desa
        Route::post('/aparatur', [\App\Http\Controllers\Api\AparaturDesaController::class, 'store']);
        Route::put('/aparatur/{id}', [\App\Http\Controllers\Api\AparaturDesaController::class, 'update']);
        Route::delete('/aparatur/{id}', [\App\Http\Controllers\Api\AparaturDesaController::class, 'destroy']);
    });
});
