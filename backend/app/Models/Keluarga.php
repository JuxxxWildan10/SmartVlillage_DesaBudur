<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keluarga extends Model
{
    protected $table = 'keluarga';
    protected $guarded = [];

    public function anggota()
    {
        return $this->hasMany(Penduduk::class, 'keluarga_id');
    }
}
