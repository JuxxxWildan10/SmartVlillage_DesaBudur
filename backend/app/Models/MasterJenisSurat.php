<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterJenisSurat extends Model
{
    protected $table = 'master_jenis_surat';
    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
