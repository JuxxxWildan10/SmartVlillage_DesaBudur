<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Kependudukan (Keluarga)
        Schema::create('keluarga', function (Blueprint $table) {
            $table->id();
            $table->string('no_kk', 16)->unique();
            $table->string('kepala_keluarga');
            $table->text('alamat');
            $table->string('rt', 3);
            $table->string('rw', 3);
            $table->string('dusun');
            $table->string('kode_pos', 5)->default('45167');
            $table->timestamps();
        });

        // 2. Kependudukan (Penduduk)
        Schema::create('penduduk', function (Blueprint $table) {
            $table->id();
            $table->string('nik', 16)->unique();
            $table->foreignId('keluarga_id')->nullable()->constrained('keluarga')->nullOnDelete();
            $table->string('nama_lengkap');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->enum('agama', ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']);
            $table->string('pendidikan');
            $table->string('pekerjaan');
            $table->enum('status_perkawinan', ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']);
            $table->enum('status_hubungan_dalam_keluarga', ['Kepala Keluarga', 'Suami', 'Istri', 'Anak', 'Menantu', 'Cucu', 'Orang Tua', 'Mertua', 'Famili Lain', 'Pembantu', 'Lainnya']);
            $table->enum('kewarganegaraan', ['WNI', 'WNA'])->default('WNI');
            $table->string('golongan_darah', 2)->nullable();
            $table->timestamps();
        });

        // 3. SDGs Desa (Goals)
        Schema::create('sdgs_goals', function (Blueprint $table) {
            $table->id();
            $table->integer('goal_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('color_hex', 7)->nullable();
            $table->timestamps();
        });

        // 4. SDGs Desa (Capaian)
        Schema::create('sdgs_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('goal_id')->constrained('sdgs_goals')->cascadeOnDelete();
            $table->integer('year');
            $table->decimal('score', 5, 2); // e.g. 85.50
            $table->timestamps();
        });

        // 5. e-Surat (Pengajuan Surat)
        Schema::create('surat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penduduk_id')->constrained('penduduk')->cascadeOnDelete();
            $table->string('jenis_surat');
            $table->string('nomor_surat')->nullable();
            $table->text('keperluan');
            $table->enum('status', ['Menunggu', 'Diproses', 'Selesai', 'Ditolak'])->default('Menunggu');
            $table->string('file_pdf')->nullable();
            $table->timestamps();
        });

        // 6. GIS (Wilayah RT/RW/Infrastruktur)
        Schema::create('gis_features', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['Batas Desa', 'Batas RW', 'Batas RT', 'Infrastruktur', 'Fasilitas Umum']);
            $table->text('geojson_data'); // Storing Coordinates
            $table->string('color', 7)->default('#1B5E20');
            $table->timestamps();
        });

        // 7. Pengaduan Warga
        Schema::create('pengaduan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penduduk_id')->constrained('penduduk')->cascadeOnDelete();
            $table->string('judul');
            $table->text('isi_laporan');
            $table->string('foto')->nullable();
            $table->enum('status', ['Menunggu', 'Diterima', 'Diproses', 'Selesai'])->default('Menunggu');
            $table->timestamps();
        });

        // 8. BUMDes / UMKM
        Schema::create('umkm_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penduduk_id')->constrained('penduduk')->cascadeOnDelete();
            $table->string('nama_produk');
            $table->text('deskripsi');
            $table->decimal('harga', 15, 2);
            $table->string('foto')->nullable();
            $table->integer('stok')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm_products');
        Schema::dropIfExists('pengaduan');
        Schema::dropIfExists('gis_features');
        Schema::dropIfExists('surat');
        Schema::dropIfExists('sdgs_scores');
        Schema::dropIfExists('sdgs_goals');
        Schema::dropIfExists('penduduk');
        Schema::dropIfExists('keluarga');
    }
};
