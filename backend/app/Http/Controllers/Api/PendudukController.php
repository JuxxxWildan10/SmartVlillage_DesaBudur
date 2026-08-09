<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Penduduk;
use App\Models\User;

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
        $request->validate([
            'nik'                             => 'required|string|min:16|max:16|regex:/^[0-9]+$/|unique:penduduk,nik',
            'nama_lengkap'                    => 'required|string|max:255',
            'tempat_lahir'                    => 'required|string|max:100',
            'tanggal_lahir'                   => 'required|date',
            'jenis_kelamin'                   => 'required|in:Laki-laki,Perempuan',
            'agama'                           => 'required|in:Islam,Kristen,Katolik,Hindu,Budha,Konghucu,Lainnya',
            'pendidikan'                      => 'required|string|max:100',
            'pekerjaan'                       => 'required|string|max:100',
            'status_perkawinan'               => 'required|in:Belum Kawin,Kawin,Cerai Hidup,Cerai Mati',
            'status_hubungan_dalam_keluarga'  => 'required|string|max:50',
            'kewarganegaraan'                 => 'required|in:WNI,WNA',
            'golongan_darah'                  => 'nullable|in:A,B,AB,O,A+,A-,B+,B-,AB+,AB-,O+,O-',
            'keluarga_id'                     => 'nullable|exists:keluarga,id',
        ], [
            'nik.min'    => 'NIK harus 16 digit.',
            'nik.max'    => 'NIK harus 16 digit.',
            'nik.regex'  => 'NIK hanya boleh berisi angka.',
            'nik.unique' => 'NIK sudah terdaftar.',
        ]);

        $penduduk = Penduduk::create([
            'nik'                             => strip_tags($request->nik),
            'nama_lengkap'                    => strip_tags($request->nama_lengkap),
            'tempat_lahir'                    => strip_tags($request->tempat_lahir),
            'tanggal_lahir'                   => $request->tanggal_lahir,
            'jenis_kelamin'                   => $request->jenis_kelamin,
            'agama'                           => $request->agama,
            'pendidikan'                      => strip_tags($request->pendidikan),
            'pekerjaan'                       => strip_tags($request->pekerjaan),
            'status_perkawinan'               => $request->status_perkawinan,
            'status_hubungan_dalam_keluarga'  => strip_tags($request->status_hubungan_dalam_keluarga),
            'kewarganegaraan'                 => $request->kewarganegaraan,
            'golongan_darah'                  => $request->golongan_darah,
            'keluarga_id'                     => $request->keluarga_id,
        ]);

        return response()->json([
            'status' => 'success',
            'data'   => $penduduk,
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
        if (!$penduduk) return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan'], 404);

        $request->validate([
            'nik'           => 'sometimes|string|min:16|max:16|regex:/^[0-9]+$/|unique:penduduk,nik,'.$id,
            'nama_lengkap'  => 'sometimes|string|max:255',
            'tanggal_lahir' => 'sometimes|date',
            'jenis_kelamin' => 'sometimes|in:Laki-laki,Perempuan',
            'agama'         => 'sometimes|in:Islam,Kristen,Katolik,Hindu,Budha,Konghucu,Lainnya',
            'status_perkawinan' => 'sometimes|in:Belum Kawin,Kawin,Cerai Hidup,Cerai Mati',
            'kewarganegaraan'   => 'sometimes|in:WNI,WNA',
            'golongan_darah'    => 'nullable|in:A,B,AB,O,A+,A-,B+,B-,AB+,AB-,O+,O-',
            'keluarga_id'       => 'nullable|exists:keluarga,id',
        ]);

        $allowed = [
            'nik', 'keluarga_id', 'nama_lengkap', 'tempat_lahir',
            'tanggal_lahir', 'jenis_kelamin', 'agama', 'pendidikan',
            'pekerjaan', 'status_perkawinan', 'status_hubungan_dalam_keluarga',
            'kewarganegaraan', 'golongan_darah',
        ];

        $data = array_intersect_key($request->all(), array_flip($allowed));

        // Sanitasi field teks bebas
        foreach (['nik', 'nama_lengkap', 'tempat_lahir', 'pendidikan', 'pekerjaan', 'status_hubungan_dalam_keluarga'] as $field) {
            if (isset($data[$field])) {
                $data[$field] = strip_tags($data[$field]);
            }
        }

        $penduduk->update($data);

        return response()->json([
            'status' => 'success',
            'data'   => $penduduk,
        ]);
    }

    public function destroy($id)
    {
        $penduduk = Penduduk::find($id);
        if ($penduduk) $penduduk->delete();

        return response()->json(['status' => 'success']);
    }

    public function resetPassword($id)
    {
        $penduduk = Penduduk::find($id);
        if (!$penduduk) {
            return response()->json(['status' => 'error', 'message' => 'Data penduduk tidak ditemukan'], 404);
        }

        // Cari user yang emailnya = NIK penduduk ini
        $user = User::where('email', $penduduk->nik)->first();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Warga ini belum memiliki akun yang terdaftar'], 404);
        }

        // Default password format for reset (e.g., Budur[NIK_akhir]) atau static `DesaBudur123!`
        $newPassword = 'DesaBudur123!';
        
        $user->update([
            'password' => Hash::make($newPassword)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil direset menjadi: ' . $newPassword,
            'data' => [
                'new_password' => $newPassword
            ]
        ]);
    }
}
