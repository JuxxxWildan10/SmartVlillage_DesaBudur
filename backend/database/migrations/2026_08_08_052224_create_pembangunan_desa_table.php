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
        Schema::create('pembangunan_desa', function (Blueprint $table) {
            $table->id();
            $table->string('nama_proyek');
            $table->string('lokasi');
            $table->decimal('anggaran', 15, 2);
            $table->decimal('realisasi', 15, 2)->default(0);
            $table->string('sumber_dana'); // e.g., Dana Desa, ADD, dll.
            $table->integer('tahun');
            $table->integer('persentase_progres')->default(0);
            $table->enum('status', ['Direncanakan', 'Proses', 'Selesai'])->default('Direncanakan');
            $table->string('foto')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembangunan_desa');
    }
};
