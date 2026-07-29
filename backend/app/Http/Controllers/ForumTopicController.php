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
        $request->validate(['judul' => 'required|string', 'isi' => 'required|string']);
        
        $topic = ForumTopic::create([
            'user_nik' => $request->user()->email,
            'judul' => $request->judul,
            'isi' => $request->isi
        ]);
        return response()->json(['status' => 'success', 'data' => $topic], 201);
    }

    public function update(Request $request, $id)
    {
        $topic = ForumTopic::find($id);
        // Ensure user is the owner or admin
        if ($topic) $topic->update($request->only(['judul', 'isi', 'status']));
        return response()->json(['status' => 'success', 'data' => $topic]);
    }

    public function destroy($id)
    {
        $topic = ForumTopic::find($id);
        if ($topic) $topic->delete();
        return response()->json(['status' => 'success']);
    }
}
