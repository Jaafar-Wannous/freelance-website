FROM php:8.3-fpm
# تثبيت التبعيات المطلوبة
RUN apt-get update && apt-get install -y \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    curl \
    zip \
    git && \
    docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd
# ضبط متغير Composer
ENV COMPOSER_ALLOW_SUPERUSER=1
# تثبيت Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# نسخ ملفات المشروع
COPY . /var/www/html
# تعيين الدليل الحالي
WORKDIR /var/www/html
# تثبيت حزم PHP عبر Composer
RUN composer install --optimize-autoloader --no-dev
# إعداد صلاحيات الملفات
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache
# فتح المنفذ الافتراضي
EXPOSE 80
