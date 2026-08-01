<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengaduan extends Model
{
    protected $table = 'pengaduan';
    protected $guarded = [];

    public function penduduk()
    {
        return $this->belongsTo(Penduduk::class, 'penduduk_id');
    }
}
