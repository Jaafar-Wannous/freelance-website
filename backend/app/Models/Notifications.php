<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'sender_id',
        'receiver_id',
        'title',
        'data',
        'read'
    ];

    protected $casts = [
        'data' => 'array', // Automatically converts JSON to array
    ];

    public function sender() { 
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver() { 
        return $this->belongsTo(User::class, 'receiver_id');
    }

}
