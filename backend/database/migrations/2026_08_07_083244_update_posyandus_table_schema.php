<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posyandus', function (Blueprint $table) {
            // Drop old columns
            $table->dropColumn(['nama_kegiatan', 'tanggal_waktu', 'keterangan', 'status']);
            
            // Add new columns
            $table->string('nama')->after('id');
            $table->string('jadwal')->after('lokasi')->nullable();
            $table->string('ketua_kader')->after('jadwal')->nullable();
            $table->integer('jumlah_balita')->after('ketua_kader')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('posyandus', function (Blueprint $table) {
            $table->dropColumn(['nama', 'jadwal', 'ketua_kader', 'jumlah_balita']);
            $table->string('nama_kegiatan');
            $table->dateTime('tanggal_waktu');
            $table->text('keterangan')->nullable();
            $table->string('status')->default('Terjadwal');
        });
    }
};
