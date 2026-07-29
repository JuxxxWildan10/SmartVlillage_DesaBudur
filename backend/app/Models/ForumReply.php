<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForumReply extends Model
{
    protected $fillable = ['topic_id', 'user_nik', 'isi'];

    public function topic()
    {
        return $this->belongsTo(ForumTopic::class, 'topic_id');
    }
}
