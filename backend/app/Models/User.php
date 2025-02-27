<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;



    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'is_admin',
        'role',
        'image',
        'phone_number',
        'is_auth_phone_num',
        'image_pId',
        'is_auth_pId',
        'google_id',
        'about_me',
        'last_seen',
        'job_title',
        'verification_code'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


public function sentMessages()
{
    return $this->hasMany(Chat::class, 'sender_id');
}

public function receivedMessages()
{
    return $this->hasMany(Chat::class, 'receiver_id');
}

    public function notifications() {
        return $this->hasMany(Notifications::class);
    }

    public function services() {
        return $this->hasMany(Service::class);
    }

    public function writer() {
        return $this->hasMany(Review::class, 'writer_id');
    }

    public function recived() {
        return $this->hasMany(Review::class, 'recipient_id');
    }

    public function replies() {
        return $this->hasMany(Reply::class, 'user_id');
    }

    public function seller() {
        return $this->hasMany(Request::class, 'seller_id');
    }

    public function buyer() {
        return $this->hasMany(Request::class, 'buyer_id');
    }

}
