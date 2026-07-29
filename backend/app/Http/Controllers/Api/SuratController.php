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
    // Fetch riwayat surat (for currently logged-in user in real app, here we mock it)
    public function index()
    {
        $surat = Surat::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $surat
        ]);
    }

    // Submit new e-Surat
    public function store(Request $request)
    {
        $request->validate([
            'jenis_surat' => 'required|string',
            'keperluan' => 'required|string',
            'nomor_wa' => 'required|string|max:20'
        ]);

        // Mengambil NIK (disimpan di field email pada table users) secara aman dari Token Sanctum
        $nik = $request->user()->email;
        $penduduk = Penduduk::where('nik', $nik)->first();

        if (!$penduduk) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data penduduk tidak ditemukan untuk NIK ini.'
            ], 404);
        }

        $trackingCode = 'TRK-' . strtoupper(Str::random(6));

        $surat = Surat::create([
            'penduduk_id' => $penduduk->id, 
            'jenis_surat' => $request->jenis_surat,
            'keperluan' => $request->keperluan,
            'nomor_wa' => $request->nomor_wa,
            'status' => 'Menunggu',
            'tracking_code' => $trackingCode
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Surat berhasil diajukan',
            'data' => $surat
        ], 201);
    }

    // Update status (For Admin)
    public function update(Request $request, $id)
    {
        $surat = Surat::find($id);
        if (!$surat) {
            return response()->json(['status' => 'error', 'message' => 'Not found'], 404);
        }

        $updateData = ['status' => $request->status];

        // Jika status diubah menjadi Selesai dan belum punya nomor surat, generate otomatis
        if ($request->status === 'Selesai' && empty($surat->nomor_surat)) {
            $tahun = date('Y');
            // Format: 470 / [ID] / BDR / [Tahun]
            $updateData['nomor_surat'] = "470 / {$surat->id} / BDR / {$tahun}";
        }

        $surat->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Status surat diperbarui',
            'data' => $surat
        ]);
    }

    // Lacak Surat Public API
    public function track($code)
    {
        $surat = Surat::where('tracking_code', $code)->first();

        if (!$surat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode tracking tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'tracking_code' => $surat->tracking_code,
                'jenis_surat' => $surat->jenis_surat,
                'status' => $surat->status,
                'tanggal_pengajuan' => $surat->created_at->format('Y-m-d H:i:s'),
                'terakhir_diperbarui' => $surat->updated_at->format('Y-m-d H:i:s'),
            ]
        ]);
    }

    // Generate PDF (Bisa diakses public via tracking code, atau oleh Admin via ID)
    public function generatePdf($identifier)
    {
        // Cari berdasarkan ID atau Tracking Code
        $surat = Surat::with('penduduk')->where('id', $identifier)
            ->orWhere('tracking_code', $identifier)
            ->first();

        if (!$surat) {
            return response()->json(['status' => 'error', 'message' => 'Surat tidak ditemukan'], 404);
        }

        if ($surat->status !== 'Selesai') {
            return response()->json(['status' => 'error', 'message' => 'Surat belum selesai diproses'], 400);
        }

        // Generate URL QR Code
        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=" . urlencode(url("/layanan?track=" . $surat->tracking_code));

        $data = [
            'surat' => $surat,
            'penduduk' => $surat->penduduk,
            'qrCodeUrl' => $qrCodeUrl
        ];

        // Pilih template berdasarkan jenis surat
        $template = 'surat.sk_domisili'; // default
        $jenis = strtolower($surat->jenis_surat);
        if (str_contains($jenis, 'usaha') || str_contains($jenis, 'sku')) {
            $template = 'surat.sku';
        } elseif (str_contains($jenis, 'tidak mampu') || str_contains($jenis, 'sktm')) {
            $template = 'surat.sktm';
        }
        
        $pdf = Pdf::loadView($template, $data);
        $pdf->setPaper('A4', 'portrait');
        
        // Return PDF inline or as download
        return $pdf->stream("Surat_{$surat->jenis_surat}_{$surat->tracking_code}.pdf");
    }
}
