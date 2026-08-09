<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Surat;
use App\Models\Penduduk;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class SuratController extends Controller
{
    /**
     * Fetch surat list.
     * - Admin: semua surat (dengan nama penduduk)
     * - Warga: hanya surat milik user yang login
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('Admin') || $user->hasRole('Super Admin') || $user->hasRole('Perangkat Desa')) {
            // Admin sees all with penduduk name
            $surat = Surat::with('penduduk:id,nama_lengkap,nik')
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // Warga only sees their own surat
            $nik = $user->email; // NIK stored in email column
            $penduduk = Penduduk::where('nik', $nik)->first();

            if (!$penduduk) {
                return response()->json([
                    'status' => 'success',
                    'data' => [],
                    'message' => 'Data penduduk tidak ditemukan.'
                ]);
            }

            $surat = Surat::with('penduduk:id,nama_lengkap,nik')
                ->where('penduduk_id', $penduduk->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $surat
        ]);
    }

    /**
     * Submit new e-Surat (Warga)
     */
    public function store(Request $request)
    {
        $request->validate([
            'jenis_surat' => 'required|string|max:255',
            'keperluan'   => 'required|string|max:500',
            'nomor_wa'    => 'required|string|regex:/^[0-9+]{8,15}$/|max:15',
        ], [
            'nomor_wa.regex' => 'Format nomor WhatsApp tidak valid. Gunakan format: 628xxxxxxxx',
        ]);

        // NIK disimpan di field email pada tabel users
        $nik = $request->user()->email;
        $penduduk = Penduduk::where('nik', $nik)->first();

        if (!$penduduk) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data penduduk tidak ditemukan untuk NIK ini. Pastikan NIK Anda sudah terdaftar di sistem desa.'
            ], 404);
        }

        $trackingCode = 'TRK-' . strtoupper(Str::random(6));

        $surat = Surat::create([
            'penduduk_id'   => $penduduk->id,
            'jenis_surat'   => strip_tags($request->jenis_surat),
            'keperluan'     => strip_tags($request->keperluan),
            'nomor_wa'      => preg_replace('/[^0-9+]/', '', $request->nomor_wa),
            'status'        => 'Menunggu',
            'tracking_code' => $trackingCode
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Surat berhasil diajukan',
            'data' => $surat
        ], 201);
    }

    /**
     * Update surat status (Admin only — enforced via route middleware)
     */
    public function update(Request $request, $id)
    {
        $surat = Surat::find($id);
        if (!$surat) {
            return response()->json(['status' => 'error', 'message' => 'Surat tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:Menunggu,Diproses,Selesai,Ditolak'
        ]);

        $updateData = ['status' => $validated['status']];

        // Generate nomor surat otomatis saat disetujui
        if ($request->status === 'Selesai' && empty($surat->nomor_surat)) {
            $tahun = date('Y');
            $updateData['nomor_surat'] = "470 / {$surat->id} / BDR / {$tahun}";
        }

        $surat->update($updateData);

        // Dispatch realtime event
        event(new \App\Events\SuratStatusUpdated($surat->load('penduduk:id,nama_lengkap,nik')));

        return response()->json([
            'status' => 'success',
            'message' => 'Status surat diperbarui',
            'data' => $surat->load('penduduk:id,nama_lengkap,nik')
        ]);
    }

    /**
     * Hapus surat (Admin only)
     */
    public function destroy($id)
    {
        $surat = Surat::find($id);
        if (!$surat) {
            return response()->json(['status' => 'error', 'message' => 'Surat tidak ditemukan'], 404);
        }

        $surat->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Surat berhasil dihapus'
        ]);
    }

    /**
     * Lacak Surat by tracking code (Public)
     */
    public function track($code)
    {
        $surat = Surat::where('tracking_code', $code)->first();

        if (!$surat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode tracking tidak ditemukan. Pastikan kode yang Anda masukkan benar.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'tracking_code' => $surat->tracking_code,
                'jenis_surat' => $surat->jenis_surat,
                'status' => $surat->status,
                'tanggal_pengajuan' => $surat->created_at->format('d M Y, H:i'),
                'terakhir_diperbarui' => $surat->updated_at->format('d M Y, H:i'),
            ]
        ]);
    }

    /**
     * Generate PDF surat.
     * Keamanan: hanya boleh diakses via TRACKING CODE resmi (bukan ID integer).
     * Mencegah enumeration attack (orang lain nebak ID orang lain).
     */
    public function generatePdf($identifier)
    {
        // Pastikan identifier adalah tracking code (format TRK-XXXXXX), bukan integer ID
        if (!preg_match('/^TRK-[A-Z0-9]{6}$/i', $identifier)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Format kode tidak valid. Gunakan kode tracking yang diberikan saat pengajuan surat.',
            ], 400);
        }

        $surat = Surat::with('penduduk')
            ->where('tracking_code', $identifier)
            ->first();

        if (!$surat) {
            return response()->json(['status' => 'error', 'message' => 'Surat tidak ditemukan'], 404);
        }

        if ($surat->status !== 'Selesai') {
            return response()->json(['status' => 'error', 'message' => 'Surat belum selesai diproses'], 400);
        }

        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=" . urlencode(url("/layanan?track=" . $surat->tracking_code));

        $data = [
            'surat'     => $surat,
            'penduduk'  => $surat->penduduk,
            'qrCodeUrl' => $qrCodeUrl,
        ];

        // Pilih template berdasarkan jenis surat
        $template = 'surat.sk_domisili';
        $jenis = strtolower($surat->jenis_surat);
        if (str_contains($jenis, 'usaha') || str_contains($jenis, 'sku')) {
            $template = 'surat.sku';
        } elseif (str_contains($jenis, 'tidak mampu') || str_contains($jenis, 'sktm')) {
            $template = 'surat.sktm';
        }

        $pdf = Pdf::loadView($template, $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->stream("Surat_{$surat->jenis_surat}_{$surat->tracking_code}.pdf");
    }
}
