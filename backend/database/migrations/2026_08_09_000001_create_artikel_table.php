<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artikel', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('kategori')->default('Edukasi'); // Edukasi, Kesehatan, Pertanian, Hukum, Lainnya
            $table->text('isi_artikel');
            $table->string('gambar_url')->nullable();
            $table->string('penulis')->default('Admin Desa Budur');
            $table->enum('status', ['Published', 'Draft'])->default('Published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artikel');
    }
};
