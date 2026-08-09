<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SuratStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $surat;

    public function __construct($surat)
    {
        $this->surat = $surat;
    }

    public function broadcastOn()
    {
        return new Channel('surat-channel');
    }

    public function broadcastAs()
    {
        return 'status-updated';
    }
}
