<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dateTime('tanggal_acara')->nullable()->after('isi_berita');
            $table->string('lokasi_acara')->nullable()->after('tanggal_acara');
        });
    }

    public function down(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dropColumn(['tanggal_acara', 'lokasi_acara']);
        });
    }
};
