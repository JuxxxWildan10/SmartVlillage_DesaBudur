<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApbdesAnggaran extends Model
{
    protected $table = 'apbdes_anggaran';
    protected $guarded = [];

    protected $casts = [
        'anggaran' => 'float',
        'realisasi' => 'float',
        'tahun' => 'integer',
    ];
}
