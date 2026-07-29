<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Surat')</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            margin: 0;
            padding: 0;
            line-height: 1.5;
        }
        .container {
            padding: 20px 40px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid black;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header img {
            width: 70px;
            float: left;
        }
        .header h1, .header h2, .header h3 {
            margin: 0;
            padding: 0;
        }
        .header h1 { font-size: 16pt; font-weight: bold; }
        .header h2 { font-size: 14pt; }
        .header p { font-size: 10pt; margin: 2px 0; }
        .content {
            margin-top: 10px;
        }
        .footer {
            margin-top: 50px;
            width: 100%;
        }
        .signature {
            float: right;
            width: 250px;
            text-align: center;
        }
        .signature img {
            width: 80px;
            height: 80px;
            margin: 10px 0;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- KOP SURAT -->
        <div class="header">
            <!-- Asumsi ada logo garuda atau logo daerah -->
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Lambang_Kabupaten_Cirebon.png/250px-Lambang_Kabupaten_Cirebon.png" alt="Logo">
            <h2>PEMERINTAH KABUPATEN CIREBON</h2>
            <h2>KECAMATAN CIWARINGIN</h2>
            <h1>KANTOR KUPU DESA BUDUR</h1>
            <p>Jalan Ki Bagus Rangin No. 1 Kode Pos: 45167</p>
        </div>

        <div class="content">
            @yield('content')
        </div>

        <!-- TANDA TANGAN -->
        <div class="footer">
            <div class="signature">
                Budur, {{ \Carbon\Carbon::parse($surat->updated_at)->translatedFormat('d F Y') }}<br>
                Kepala Desa Budur<br>
                <img src="{{ $qrCodeUrl }}" alt="QR Code"><br>
                <u><strong>NAMA KEPALA DESA</strong></u><br>
                NIP. 123456789
            </div>
            <div class="clear"></div>
        </div>
    </div>
</body>
</html>
