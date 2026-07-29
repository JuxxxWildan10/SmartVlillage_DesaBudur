<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$products = App\Models\UmkmProduct::where('foto', 'like', '%/storage/umkm/%')->get();
foreach ($products as $p) {
    $p->foto = str_replace('/storage/umkm/', '/api/umkm/image/', $p->foto);
    $p->save();
}
echo "Done";
