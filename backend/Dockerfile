# استخدم صورة PHP الرسمية
FROM php:8.2-fpm

# تثبيت التبعيات
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libonig-dev \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring zip

# نسخ ملفات المشروع
WORKDIR /var/www/html
COPY . .

# تثبيت Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# تثبيت حزم PHP عبر Composer
RUN composer install --optimize-autoloader --no-dev

# إعداد صلاحيات الملفات
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# المنفذ الافتراضي
EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "-t", "public"]
