<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenDesa extends Model
{
    use HasFactory;
    protected $table = 'dokumen_desa';
    protected $fillable = ['judul', 'kategori', 'tahun', 'file_pdf', 'deskripsi', 'is_public'];
}
