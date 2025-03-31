FROM ruby:3.3.3-alpine

# Configurar variáveis de ambiente
ENV RAILS_ROOT /app
ENV RAILS_ENV production
ENV NODE_ENV production
ENV BUNDLE_PATH /usr/local/bundle
ENV PATH /app/bin:${PATH}

# Instalar dependências (Node.js 20+ já inclui Corepack)
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
    gcompat \          # Compatibilidade com glibc
    libstdc++          # Dependência para gems nativas


# Configurar Yarn através do npm (sem Corepack)
RUN npm install -g yarn@latest && \
    yarn set version stable

# Criar diretório da aplicação
WORKDIR $RAILS_ROOT

# Copiar Gemfile e instalar gems
COPY Gemfile Gemfile.lock ./
RUN bundle config set without 'development test' && \
    bundle install --jobs 20 --retry 5

# Copiar package.json e lock files
COPY package.json yarn.lock ./

# Atualizar browserslist e instalar dependências
RUN yarn add sass@latest @vuelidate/core@latest @vuelidate/validators@latest && \
    yarn install --frozen-lockfile && \
    npx update-browserslist-db@latest

# Copiar o restante da aplicação
COPY . .

# Precompilar assets
RUN RAILS_ENV=production \
    SECRET_KEY_BASE=precompile_placeholder \
    DATABASE_URL=postgres://postgres:postgres@postgres:5432/chatwoot_production \
    bundle exec rake assets:precompile

# Limpar arquivos desnecessários
RUN rm -rf node_modules tmp/cache vendor/bundle test spec

# Expor a porta
EXPOSE 3000

# Configurar entrypoint
COPY docker/entrypoints/rails.sh /usr/bin/
RUN chmod +x /usr/bin/rails.sh
ENTRYPOINT ["rails.sh"]

# Comando padrão
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]