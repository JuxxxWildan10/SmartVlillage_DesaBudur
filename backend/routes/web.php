<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Workaround for Windows php artisan serve symlink issue
Route::get('/storage/{path}', function ($path) {
    $file = storage_path('app/public/' . $path);
    if (!file_exists($file)) abort(404);
    $mime = mime_content_type($file) ?: 'application/octet-stream';
    return response(file_get_contents($file), 200)->header('Content-Type', $mime);
})->where('path', '.*');
