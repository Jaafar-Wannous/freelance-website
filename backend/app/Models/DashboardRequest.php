<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardRequest extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'type', 'status', 'data'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'data' => 'array',
    ];
}
