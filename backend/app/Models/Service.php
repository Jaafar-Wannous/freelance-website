<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'images',
        'user_id',
        'category_id',
        'seller_note',
        'duration'
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function review() {
        return $this->hasMany(Review::class, 'service_id');
    }

    public function request() {
        return $this->hasMany(Request::class, 'service_id');
    }

}
