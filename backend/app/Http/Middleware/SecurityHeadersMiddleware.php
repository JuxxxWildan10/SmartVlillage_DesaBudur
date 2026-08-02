<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * SecurityHeadersMiddleware
 *
 * Menambahkan HTTP Security Headers pada setiap response API.
 * Headers ini melindungi dari XSS, Clickjacking, MIME sniffing, dll.
 */
class SecurityHeadersMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Mencegah MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Mencegah Clickjacking — halaman tidak bisa di-embed di iframe
        $response->headers->set('X-Frame-Options', 'DENY');

        // Paksa HTTPS di browser (aktif setelah deploy dengan SSL)
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // Nonaktifkan fitur browser yang tidak perlu
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // Referrer Policy — jangan kirim referrer ke domain lain
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy — API only (no HTML content served)
        // Frontend SPA mengurus CSP-nya sendiri
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Hapus header yang mengekspos teknologi server
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }
}
