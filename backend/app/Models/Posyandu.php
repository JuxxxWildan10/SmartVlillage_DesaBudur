<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Posyandu extends Model
{
    protected $fillable = ['nama', 'lokasi', 'jadwal', 'ketua_kader', 'jumlah_balita'];
}
