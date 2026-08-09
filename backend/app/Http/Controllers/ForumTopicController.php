<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ForumTopic;

class ForumTopicController extends Controller
{
    public function index()
    {
        $topics = ForumTopic::withCount('replies')->orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $topics]);
    }

    public function show($id)
    {
        $topic = ForumTopic::with('replies')->find($id);
        if ($topic) {
            $topic->increment('views');
            return response()->json(['status' => 'success', 'data' => $topic]);
        }
        return response()->json(['status' => 'error'], 404);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:200',
            'isi'   => 'required|string|max:5000',
        ]);
        
        $topic = ForumTopic::create([
            'user_nik' => $request->user()->email,
            'judul'    => strip_tags($request->judul),
            'isi'      => strip_tags($request->isi),
        ]);
        return response()->json(['status' => 'success', 'data' => $topic], 201);
    }

    public function update(Request $request, $id)
    {
        $topic = ForumTopic::find($id);
        if (!$topic) {
            return response()->json(['status' => 'error', 'message' => 'Topik tidak ditemukan'], 404);
        }

        $request->validate([
            'judul'  => 'sometimes|string|max:200',
            'isi'    => 'sometimes|string|max:5000',
            'status' => 'sometimes|in:Open,Closed',
        ]);

        $updateData = [];
        if ($request->has('judul'))  $updateData['judul']  = strip_tags($request->judul);
        if ($request->has('isi'))    $updateData['isi']    = strip_tags($request->isi);
        if ($request->has('status')) $updateData['status'] = $request->status;

        $topic->update($updateData);
        return response()->json(['status' => 'success', 'data' => $topic]);
    }

    public function destroy($id)
    {
        $topic = ForumTopic::find($id);
        if ($topic) $topic->delete();
        return response()->json(['status' => 'success']);
    }
}
