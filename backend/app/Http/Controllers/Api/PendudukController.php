<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Penduduk;

class PendudukController extends Controller
{
    public function index()
    {
        $penduduk = Penduduk::with('keluarga')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $penduduk
        ]);
    }

    public function statistik()
    {
        $total = DB::table('penduduk')->count();
        
        $gender = DB::table('penduduk')
            ->select('jenis_kelamin as label', DB::raw('count(*) as value'))
            ->groupBy('jenis_kelamin')
            ->get();

        $pendidikan = DB::table('penduduk')
            ->select('pendidikan as label', DB::raw('count(*) as value'))
            ->groupBy('pendidikan')
            ->orderBy('value', 'desc')
            ->get();

        $pekerjaan = DB::table('penduduk')
            ->select('pekerjaan as label', DB::raw('count(*) as value'))
            ->groupBy('pekerjaan')
            ->orderBy('value', 'desc')
            ->limit(10) // Top 10 pekerjaan
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total' => $total,
                'jenis_kelamin' => $gender,
                'pendidikan' => $pendidikan,
                'pekerjaan' => $pekerjaan
            ]
        ]);
    }

    public function store(Request $request)
    {
        $penduduk = Penduduk::create($request->all());
        return response()->json([
            'status' => 'success',
            'data' => $penduduk
        ], 201);
    }

    public function import(Request $request)
    {
        $request->validate([
            'data' => 'required|array'
        ]);

        $imported = 0;
        foreach ($request->data as $row) {
            // Find keluarga by no_kk if provided
            $keluargaId = null;
            if (!empty($row['no_kk'])) {
                $kel = \App\Models\Keluarga::where('no_kk', $row['no_kk'])->first();
                if ($kel) {
                    $keluargaId = $kel->id;
                }
            }

            Penduduk::updateOrCreate(
                ['nik' => $row['nik']],
                [
                    'keluarga_id' => $keluargaId,
                    'nama_lengkap' => $row['nama_lengkap'],
                    'tempat_lahir' => $row['tempat_lahir'] ?? '-',
                    'tanggal_lahir' => $row['tanggal_lahir'] ?? '2000-01-01',
                    'jenis_kelamin' => $row['jenis_kelamin'] ?? 'Laki-laki',
                    'agama' => $row['agama'] ?? 'Islam',
                    'pendidikan' => $row['pendidikan'] ?? 'Tidak/Belum Sekolah',
                    'pekerjaan' => $row['pekerjaan'] ?? 'Belum/Tidak Bekerja',
                    'status_perkawinan' => $row['status_perkawinan'] ?? 'Belum Kawin',
                    'status_hubungan_dalam_keluarga' => $row['status_hubungan_dalam_keluarga'] ?? 'Lainnya',
                    'kewarganegaraan' => $row['kewarganegaraan'] ?? 'WNI',
                    'golongan_darah' => $row['golongan_darah'] ?? null,
                ]
            );
            $imported++;
        }

        return response()->json([
            'status' => 'success',
            'message' => "$imported data penduduk berhasil diimpor/diupdate."
        ]);
    }

    public function update(Request $request, $id)
    {
        $penduduk = Penduduk::find($id);
        if (!$penduduk) return response()->json(['status' => 'error'], 404);

        $penduduk->update($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $penduduk
        ]);
    }

    public function destroy($id)
    {
        $penduduk = Penduduk::find($id);
        if ($penduduk) $penduduk->delete();

        return response()->json(['status' => 'success']);
    }
}
