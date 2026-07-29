@extends('surat.layout')

@section('title', 'Surat Keterangan Usaha (SKU)')

@section('content')
<div style="text-align: center; margin-bottom: 20px;">
    <h3 style="text-decoration: underline; margin: 0;">SURAT KETERANGAN USAHA</h3>
    <p style="margin: 0;">Nomor: {{ $surat->nomor_surat ?? '470 / ' . $surat->id . ' / BDR / ' . date('Y') }}</p>
</div>

<p>Yang bertanda tangan di bawah ini Kepala Desa Budur, Kecamatan Ciwaringin, Kabupaten Cirebon, menerangkan dengan sebenarnya bahwa:</p>

<table style="width: 100%; margin-left: 20px; margin-bottom: 15px;">
    <tr>
        <td style="width: 30%;">Nama Lengkap</td>
        <td style="width: 2%;">:</td>
        <td><strong>{{ $penduduk->nama_lengkap }}</strong></td>
    </tr>
    <tr>
        <td>NIK</td>
        <td>:</td>
        <td>{{ $penduduk->nik }}</td>
    </tr>
    <tr>
        <td>Tempat, Tanggal Lahir</td>
        <td>:</td>
        <td>{{ $penduduk->tempat_lahir }}, {{ \Carbon\Carbon::parse($penduduk->tanggal_lahir)->translatedFormat('d F Y') }}</td>
    </tr>
    <tr>
        <td>Jenis Kelamin</td>
        <td>:</td>
        <td>{{ $penduduk->jenis_kelamin }}</td>
    </tr>
    <tr>
        <td>Pekerjaan</td>
        <td>:</td>
        <td>{{ $penduduk->pekerjaan }}</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Alamat</td>
        <td style="vertical-align: top;">:</td>
        <td>
            @if($penduduk->keluarga)
                {{ $penduduk->keluarga->alamat }} RT {{ $penduduk->keluarga->rt }} / RW {{ $penduduk->keluarga->rw }}, Dusun {{ $penduduk->keluarga->dusun }}
            @else
                Desa Budur, Kec. Ciwaringin
            @endif
        </td>
    </tr>
</table>

<p>Orang tersebut di atas adalah benar-benar penduduk Desa Budur, Kecamatan Ciwaringin, Kabupaten Cirebon, dan menurut sepengetahuan kami hingga saat ini benar mempunyai usaha:</p>
<p style="text-align: center; font-size: 14pt; font-weight: bold; margin: 20px 0;">" {{ $surat->keperluan }} "</p>

<p>Demikian Surat Keterangan Usaha (SKU) ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya oleh yang bersangkutan.</p>
@endsection
