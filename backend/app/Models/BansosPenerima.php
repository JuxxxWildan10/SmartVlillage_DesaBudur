<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BansosPenerima extends Model
{
    protected $table = 'bansos_penerima';
    protected $fillable = ['program_id', 'keluarga_id', 'status_penerimaan', 'keterangan'];

    public function program()
    {
        return $this->belongsTo(BansosProgram::class, 'program_id');
    }

    public function keluarga()
    {
        return $this->belongsTo(Keluarga::class, 'keluarga_id');
    }
}
