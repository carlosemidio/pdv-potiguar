FROM php:8.2-fpm AS php

# Install system dependencies
RUN apt-get update -y
RUN apt-get install -y \
    git \
    curl \
    libpq-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    fish

# Install Node.js
# RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o /nodesource_setup.sh
# RUN bash /nodesource_setup.sh
# RUN apt-get install -y nodejs
# RUN npm install -g pnpm

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create a new user
ARG user
ARG uid
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user
RUN chown -R $user:$user /home/$user

# Set working directory
WORKDIR /var/www
COPY --chown=$user . /var/www/
COPY . /var/www

# Set permissions for laravel logs
RUN chmod -R 775 /var/www/storage

# Set permissions for laravel to write and cache
RUN chmod -R 775 /var/www/bootstrap

# Set the user for the container
USER $user

# Set the store directory for pnpm
# RUN mkdir -p /home/$user/.local/share/pnpm/store
# RUN pnpm config set store-dir /home/$user/.local/share/pnpm/store

# Expose ports
ARG app_port
EXPOSE $app_port
ARG vite_port
EXPOSE $vite_port
