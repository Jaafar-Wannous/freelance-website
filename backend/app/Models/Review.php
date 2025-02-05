<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'comment',
        'quality_of_service',
        'speed_of_response',
        'communication',
        'service_id',
        'writer_id',
        'recipient_id'
    ];

    public function service() {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function writer() {
        return $this->belongsTo(User::class, 'writer_id');
    }

    public function recipient() {
        return $this->belongsTo(User::class, 'recipient_id');
    }

}
