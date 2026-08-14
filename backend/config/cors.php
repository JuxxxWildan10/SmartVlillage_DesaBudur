<?php

/**
 * CORS Configuration — Web Desa Budur
 *
 * KEAMANAN: Hanya izinkan request dari domain frontend resmi.
 * Saat deploy ke production, tambahkan domain desa ke CORS_ALLOWED_ORIGINS di .env
 * Contoh: CORS_ALLOWED_ORIGINS=https://desabudur.desa.id,https://www.desabudur.desa.id
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    /*
     * Daftar origin yang diizinkan mengakses API.
     * Saat production WAJIB ganti wildcard dengan domain spesifik.
     * Gunakan env variable CORS_ALLOWED_ORIGINS di server production.
     */
    'allowed_origins' => array_filter(
        explode(',', env('CORS_ALLOWED_ORIGINS', implode(',', [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
        ])))
    ),

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'Origin',
        'X-CSRF-Token',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
     * Credentials harus false untuk API token-based auth (Sanctum Bearer token).
     * Hanya aktifkan jika menggunakan cookie-based auth (SPA session).
     */
    'supports_credentials' => true,

];
