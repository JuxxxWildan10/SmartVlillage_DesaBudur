<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForumTopic extends Model
{
    protected $fillable = ['user_nik', 'judul', 'isi', 'views', 'status'];

    public function replies()
    {
        return $this->hasMany(ForumReply::class, 'topic_id');
    }
}
