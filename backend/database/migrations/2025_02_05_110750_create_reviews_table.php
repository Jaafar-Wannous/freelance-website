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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('quality_of_service');
            $table->unsignedTinyInteger('speed_of_response');
            $table->unsignedTinyInteger('communication');
            $table->text('comment');
            $table->foreignId('service_id')->constrained()->references('id')->on('services');
            $table->foreignId('writer_id')->constrained()->references('id')->on('users');
            $table->foreignId('recipient_id')->constrained()->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
