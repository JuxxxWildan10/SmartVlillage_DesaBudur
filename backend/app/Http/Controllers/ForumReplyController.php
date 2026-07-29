<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ForumReply;

class ForumReplyController extends Controller
{
    public function store(Request $request, $topicId)
    {
        $request->validate(['isi' => 'required|string']);

        $reply = ForumReply::create([
            'topic_id' => $topicId,
            'user_nik' => $request->user()->email,
            'isi' => $request->isi
        ]);
        return response()->json(['status' => 'success', 'data' => $reply], 201);
    }

    public function destroy($id)
    {
        $reply = ForumReply::find($id);
        if ($reply) $reply->delete();
        return response()->json(['status' => 'success']);
    }
}
