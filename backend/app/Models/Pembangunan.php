<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembangunan extends Model
{
    use HasFactory;
    protected $table = 'pembangunan_desa';
    protected $fillable = ['nama_proyek', 'lokasi', 'anggaran', 'realisasi', 'sumber_dana', 'tahun', 'persentase_progres', 'status', 'foto', 'keterangan'];
}
