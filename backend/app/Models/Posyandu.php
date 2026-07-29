<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Posyandu extends Model
{
    protected $fillable = ['nama_kegiatan', 'tanggal_waktu', 'lokasi', 'keterangan', 'status'];
}
