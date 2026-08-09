<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penduduk extends Model
{
    protected $table = 'penduduk';
    protected $guarded = [];

    /**
     * Keluarga yang menaungi penduduk ini.
     */
    public function keluarga()
    {
        return $this->belongsTo(Keluarga::class, 'keluarga_id');
    }

    /**
     * Akun user yang terhubung ke penduduk ini (via NIK = users.email).
     */
    public function user()
    {
        return $this->hasOne(User::class, 'email', 'nik');
    }
}
