<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SuratController;
use App\Http\Controllers\Api\PengaduanController;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\SettingController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/dashboard', [DashboardController::class, 'index']);

use App\Http\Controllers\Api\AuthController;

// Authentication with Rate Limiting (10 requests per minute)
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Protected Layanan Warga with Rate Limiting (5 requests per minute)
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/surat', [SuratController::class, 'store']);
        Route::post('/pengaduan', [PengaduanController::class, 'store']);
    });
    Route::put('/surat/{id}', [SuratController::class, 'update']);
    Route::put('/pengaduan/{id}', [PengaduanController::class, 'update']);

    // Protected Admin Data (UMKM, Bansos, Berita, Posyandu)
    Route::post('/posyandu', [\App\Http\Controllers\PosyanduController::class, 'store']);
    Route::put('/posyandu/{id}', [\App\Http\Controllers\PosyanduController::class, 'update']);
    Route::delete('/posyandu/{id}', [\App\Http\Controllers\PosyanduController::class, 'destroy']);
    
    // Protected Forum Warga
    Route::post('/forum', [\App\Http\Controllers\ForumTopicController::class, 'store']);
    Route::put('/forum/{id}', [\App\Http\Controllers\ForumTopicController::class, 'update']);
    Route::delete('/forum/{id}', [\App\Http\Controllers\ForumTopicController::class, 'destroy']);
    Route::post('/forum/{topicId}/reply', [\App\Http\Controllers\ForumReplyController::class, 'store']);
    Route::delete('/forum/reply/{id}', [\App\Http\Controllers\ForumReplyController::class, 'destroy']);

    Route::post('/umkm', [\App\Http\Controllers\Api\UmkmController::class, 'store']);
    Route::put('/umkm/{id}', [\App\Http\Controllers\Api\UmkmController::class, 'update']);
    Route::delete('/umkm/{id}', [\App\Http\Controllers\Api\UmkmController::class, 'destroy']);
    
    Route::post('/bansos', [\App\Http\Controllers\Api\BansosController::class, 'store']);
    Route::put('/bansos/{id}', [\App\Http\Controllers\Api\BansosController::class, 'update']);
    Route::delete('/bansos/{id}', [\App\Http\Controllers\Api\BansosController::class, 'destroy']);
    Route::get('/bansos/{program_id}/penerima', [\App\Http\Controllers\Api\BansosController::class, 'getPenerima']);
    Route::post('/bansos/{program_id}/penerima', [\App\Http\Controllers\Api\BansosController::class, 'addPenerima']);
    Route::put('/bansos/penerima/{penerima_id}', [\App\Http\Controllers\Api\BansosController::class, 'updatePenerima']);
    Route::delete('/bansos/penerima/{penerima_id}', [\App\Http\Controllers\Api\BansosController::class, 'removePenerima']);
    
    Route::post('/berita', [\App\Http\Controllers\Api\BeritaController::class, 'store']);
    Route::put('/berita/{id}', [\App\Http\Controllers\Api\BeritaController::class, 'update']);
    Route::delete('/berita/{id}', [\App\Http\Controllers\Api\BeritaController::class, 'destroy']);
    
    Route::post('/penduduk', [\App\Http\Controllers\Api\PendudukController::class, 'store']);
    Route::put('/penduduk/{id}', [\App\Http\Controllers\Api\PendudukController::class, 'update']);
    Route::delete('/penduduk/{id}', [\App\Http\Controllers\Api\PendudukController::class, 'destroy']);
    
    Route::post('/keluarga/import', [\App\Http\Controllers\Api\KeluargaController::class, 'import']);
    Route::post('/keluarga', [\App\Http\Controllers\Api\KeluargaController::class, 'store']);
    Route::put('/keluarga/{id}', [\App\Http\Controllers\Api\KeluargaController::class, 'update']);
    Route::delete('/keluarga/{id}', [\App\Http\Controllers\Api\KeluargaController::class, 'destroy']);
    
    Route::post('/settings/running-text', [SettingController::class, 'updateRunningText']);
});

// Public GET routes
Route::get('/umkm/image/{filename}', function ($filename) {
    $path = storage_path('app/public/umkm/' . $filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'image/jpeg';
    return response(file_get_contents($path), 200)->header('Content-Type', $mime);
});
Route::get('/berita/image/{filename}', function ($filename) {
    $path = storage_path('app/public/berita/' . $filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'image/jpeg';
    return response(file_get_contents($path), 200)->header('Content-Type', $mime);
});
Route::get('/pengaduan/image/{filename}', function ($filename) {
    $path = storage_path('app/public/pengaduan/' . $filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'image/jpeg';
    return response(file_get_contents($path), 200)->header('Content-Type', $mime);
});

Route::get('/surat', [SuratController::class, 'index']);
Route::get('/surat/track/{code}', [SuratController::class, 'track']);
Route::get('/surat/{identifier}/pdf', [SuratController::class, 'generatePdf']);
Route::get('/pengaduan', [PengaduanController::class, 'index']);
Route::get('/umkm', [\App\Http\Controllers\Api\UmkmController::class, 'index']);
Route::get('/bansos', [\App\Http\Controllers\Api\BansosController::class, 'index']);
Route::post('/bansos/cek', [\App\Http\Controllers\Api\BansosController::class, 'cekPenerima']);
Route::get('/penduduk', [\App\Http\Controllers\Api\PendudukController::class, 'index']);
Route::get('/statistik', [\App\Http\Controllers\Api\PendudukController::class, 'statistik']);
Route::get('/keluarga', [\App\Http\Controllers\Api\KeluargaController::class, 'index']);
Route::get('/keluarga/{id}', [\App\Http\Controllers\Api\KeluargaController::class, 'show']);
Route::get('/posyandu', [\App\Http\Controllers\PosyanduController::class, 'index']);
Route::get('/forum', [\App\Http\Controllers\ForumTopicController::class, 'index']);
Route::get('/forum/{id}', [\App\Http\Controllers\ForumTopicController::class, 'show']);
Route::get('/berita', [\App\Http\Controllers\Api\BeritaController::class, 'index']);
Route::get('/running-text', [SettingController::class, 'getRunningText']);
