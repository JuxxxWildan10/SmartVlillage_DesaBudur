<?php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;

Config::set('database.connections.supabase', [
    'driver' => 'pgsql',
    'host' => 'aws-0-ap-northeast-1.pooler.supabase.com',
    'port' => '5432',
    'database' => 'postgres',
    'username' => 'postgres.lyqbyflyevvwzlhmdapk',
    'password' => 'DesaBudur2026',
    'charset' => 'utf8',
    'prefix' => '',
    'schema' => 'public',
    'sslmode' => 'prefer',
]);

$tables = DB::connection('supabase')->select("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");

// Disable foreign key constraints on SQLite
Schema::connection('sqlite')->disableForeignKeyConstraints();

foreach($tables as $t) {
    $table = $t->tablename;
    
    // Skip migrations table
    if ($table === 'migrations') continue;

    $count = DB::connection('supabase')->table($table)->count();
    echo "Table {$table}: {$count} rows. ";

    if ($count > 0) {
        $data = DB::connection('supabase')->table($table)->get()->map(function($item) {
            return (array) $item;
        })->toArray();

        // Clear existing data in SQLite
        DB::connection('sqlite')->table($table)->truncate();
        
        // Chunk insert to avoid too many parameters error in sqlite
        foreach (array_chunk($data, 100) as $chunk) {
            DB::connection('sqlite')->table($table)->insert($chunk);
        }
        echo "Copied {$count} rows to SQLite.";
    }
    echo "\n";
}

Schema::connection('sqlite')->enableForeignKeyConstraints();
echo "Migration complete.\n";
