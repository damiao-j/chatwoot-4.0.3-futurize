FROM ruby:3.3.3-alpine

# Configurar variáveis de ambiente
ENV RAILS_ROOT /app
ENV RAILS_ENV production
ENV NODE_ENV production
ENV BUNDLE_PATH /usr/local/bundle
ENV PATH /app/bin:${PATH}
ENV VITE_RUBY_PACKAGE_MANAGER=yarn  # Forçar uso do Yarn

# Instalar dependências
RUN apk add --update --no-cache \
    build-base \
    postgresql-dev \
    tzdata \
    nodejs-current \
    npm \
    git \
    imagemagick \
    curl \
    bash \
    vips-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libheif-dev \
    gcompat \
    libstdc++ \
    musl-dev \
    openssl-dev \
    linux-headers \
    xz

# Instalar gerenciadores de pacotes
RUN npm install -g pnpm@10.2.0 yarn@latest && \
    yarn set version stable

WORKDIR $RAILS_ROOT

# Copiar e instalar gems
COPY Gemfile Gemfile.lock ./
RUN bundle config set without 'development test' && \
    bundle install --jobs 20 --retry 5

# Copiar e instalar dependências JS
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && \
    npx update-browserslist-db@latest

# Copiar aplicação
COPY . .

# Pré-compilar assets
RUN RAILS_ENV=production \
    SECRET_KEY_BASE=precompile_placeholder \
    DATABASE_URL=postgres://postgres:postgres@postgres:5432/chatwoot_production \
    bundle exec rake assets:precompile

# Configurar entrypoint
COPY docker/entrypoints/rails.sh /usr/bin/
RUN chmod +x /usr/bin/rails.sh

EXPOSE 3000
ENTRYPOINT ["rails.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]