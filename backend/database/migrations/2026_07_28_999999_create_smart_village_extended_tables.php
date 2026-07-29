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
        // 9. Mutasi Kependudukan (Kelahiran)
        Schema::create('penduduk_lahir', function (Blueprint $table) {
            $table->id();
            $table->foreignId('keluarga_id')->constrained('keluarga')->cascadeOnDelete();
            $table->string('nama_bayi');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('nama_ayah');
            $table->string('nama_ibu');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 10. Mutasi Kependudukan (Kematian)
        Schema::create('penduduk_meninggal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penduduk_id')->constrained('penduduk')->cascadeOnDelete();
            $table->date('tanggal_meninggal');
            $table->string('tempat_meninggal');
            $table->string('sebab_meninggal');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 11. Mutasi Kependudukan (Pindah)
        Schema::create('penduduk_pindah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penduduk_id')->constrained('penduduk')->cascadeOnDelete();
            $table->date('tanggal_pindah');
            $table->text('alamat_tujuan');
            $table->string('alasan_pindah');
            $table->timestamps();
        });

        // 12. Pemerintahan (Aparatur Desa)
        Schema::create('aparatur_desa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penduduk_id')->nullable()->constrained('penduduk')->nullOnDelete();
            $table->string('nama_lengkap');
            $table->string('jabatan'); // ex: Kepala Desa, Sekretaris, Kasi Pemerintahan
            $table->string('niap')->nullable(); // Nomor Induk Aparatur Pemdes
            $table->string('foto')->nullable();
            $table->enum('status', ['Aktif', 'Non-Aktif'])->default('Aktif');
            $table->timestamps();
        });

        // 13. Pemerintahan (Dokumen RPJMDes & APBDes)
        Schema::create('dokumen_desa', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->enum('kategori', ['RPJMDes', 'RKPDes', 'APBDes', 'Perdes', 'SK Kuwu', 'Lainnya']);
            $table->integer('tahun');
            $table->string('file_pdf');
            $table->text('deskripsi')->nullable();
            $table->boolean('is_public')->default(true); // bisa diakses publik untuk transparansi
            $table->timestamps();
        });

        // 14. Transparansi APBDes (Anggaran)
        Schema::create('apbdes_anggaran', function (Blueprint $table) {
            $table->id();
            $table->integer('tahun');
            $table->enum('jenis', ['Pendapatan', 'Belanja', 'Pembiayaan']);
            $table->string('bidang');
            $table->string('uraian');
            $table->decimal('anggaran', 15, 2);
            $table->decimal('realisasi', 15, 2)->default(0);
            $table->timestamps();
        });

        // 15. Bantuan Sosial (Program)
        Schema::create('bansos_program', function (Blueprint $table) {
            $table->id();
            $table->string('nama_program'); // PKH, BLT Dana Desa, BPNT
            $table->text('deskripsi');
            $table->string('penyelenggara'); // Kemensos, Pemdes
            $table->integer('tahun');
            $table->enum('status', ['Aktif', 'Selesai'])->default('Aktif');
            $table->timestamps();
        });

        // 16. Bantuan Sosial (Penerima)
        Schema::create('bansos_penerima', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('bansos_program')->cascadeOnDelete();
            $table->foreignId('keluarga_id')->constrained('keluarga')->cascadeOnDelete();
            $table->enum('status_penerimaan', ['Layak', 'Tidak Layak', 'Tersalurkan'])->default('Layak');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 17. Master Layanan (Jenis Surat)
        Schema::create('master_jenis_surat', function (Blueprint $table) {
            $table->id();
            $table->string('kode_surat', 10)->unique(); // misal: SKU, SKTM
            $table->string('nama_surat');
            $table->text('template_rtf')->nullable(); // format RTF untuk mail merge
            $table->text('persyaratan')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 18. Master BUMDes (Kategori Usaha)
        Schema::create('bumdes_kategori', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kategori');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        // Add foreign key to umkm_products (modifying existing table from core)
        Schema::table('umkm_products', function (Blueprint $table) {
            $table->foreignId('kategori_id')->nullable()->after('penduduk_id')->constrained('bumdes_kategori')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umkm_products', function (Blueprint $table) {
            $table->dropForeign(['kategori_id']);
            $table->dropColumn('kategori_id');
        });
        
        Schema::dropIfExists('bumdes_kategori');
        Schema::dropIfExists('master_jenis_surat');
        Schema::dropIfExists('bansos_penerima');
        Schema::dropIfExists('bansos_program');
        Schema::dropIfExists('apbdes_anggaran');
        Schema::dropIfExists('dokumen_desa');
        Schema::dropIfExists('aparatur_desa');
        Schema::dropIfExists('penduduk_pindah');
        Schema::dropIfExists('penduduk_meninggal');
        Schema::dropIfExists('penduduk_lahir');
    }
};
