<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'category_id'
    ];

    public function superCategory() {  //super_id relation
        return $this->belongsTo(Category::class);
    }

    public function categories() { //category relation
        return $this->hasMany(Category::class);
    }

    public function services() {
        return $this->hasMany(Service::class);
    }

}
