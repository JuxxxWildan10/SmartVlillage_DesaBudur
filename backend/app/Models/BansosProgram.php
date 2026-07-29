<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BansosProgram extends Model
{
    protected $table = 'bansos_program';
    protected $fillable = ['nama_program', 'deskripsi', 'penyelenggara', 'tahun', 'status'];

    public function penerima()
    {
        return $this->hasMany(BansosPenerima::class, 'program_id');
    }
}
