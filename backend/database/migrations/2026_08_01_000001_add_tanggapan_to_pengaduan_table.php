<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tambah kolom tanggapan admin ke tabel pengaduan
        Schema::table('pengaduan', function (Blueprint $table) {
            $table->text('tanggapan_admin')->nullable()->after('status');
            $table->timestamp('tanggapan_at')->nullable()->after('tanggapan_admin');
        });
    }

    public function down(): void
    {
        Schema::table('pengaduan', function (Blueprint $table) {
            $table->dropColumn(['tanggapan_admin', 'tanggapan_at']);
        });
    }
};
