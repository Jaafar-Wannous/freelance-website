<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('users');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('image')->nullable();
            $table->boolean('is_admin')->nullable();
            $table->boolean('is_seller')->nullable();
            $table->boolean('is_buyer')->nullable();
            $table->string('phone_number')->nullable();
            $table->boolean('is_auth_phone_num')->nullable();
            $table->string('image_pId')->nullable();
            $table->boolean('is_auth_pId')->nullable();
            $table->string('gender')->nullable();
            $table->date('birthdate')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
