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
        Schema::table('umkm_products', function (Blueprint $table) {
            // Drop strict foreign key for residents to allow manual entry
            $table->dropForeign(['penduduk_id']);
            $table->dropColumn('penduduk_id');
            
            $table->string('pemilik')->after('nama_produk')->nullable();
            $table->string('kategori')->after('pemilik')->default('Makanan');
            $table->string('lokasi')->after('kategori')->nullable();
            $table->string('status')->after('is_active')->default('Aktif');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umkm_products', function (Blueprint $table) {
            $table->dropColumn(['pemilik', 'kategori', 'lokasi', 'status']);
            $table->foreignId('penduduk_id')->constrained('penduduk')->cascadeOnDelete();
        });
    }
};
