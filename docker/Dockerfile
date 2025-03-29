FROM ruby:3.2.2-alpine

# Configurar variáveis de ambiente
ENV RAILS_ROOT /app
ENV RAILS_ENV production
ENV NODE_ENV production
ENV BUNDLE_PATH /usr/local/bundle
ENV PATH /app/bin:${PATH}

# Instalar dependências
RUN apk add --update --no-cache \
    build-base \
    postgresql-dev \
    tzdata \
    nodejs \
    npm \
    yarn \
    git \
    imagemagick \
    curl \
    bash \
    vips-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libheif-dev

# Criar diretório da aplicação
WORKDIR $RAILS_ROOT

# Copiar Gemfile e instalar gems
COPY Gemfile Gemfile.lock ./
RUN bundle config set without 'development test' && \
    bundle install --jobs 20 --retry 5

# Copiar package.json e instalar dependências
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copiar o restante da aplicação
COPY . .

# Precompilar assets
RUN RAILS_ENV=production \
    SECRET_KEY_BASE=precompile_placeholder \
    DATABASE_URL=postgres://postgres:postgres@postgres:5432/chatwoot_production \
    bundle exec rake assets:precompile

# Limpar arquivos desnecessários para reduzir o tamanho da imagem
RUN rm -rf node_modules tmp/cache vendor/bundle test spec

# Expor a porta
EXPOSE 3000

# Configurar entrypoint
COPY docker/entrypoints/rails.sh /usr/bin/
RUN chmod +x /usr/bin/rails.sh
ENTRYPOINT ["rails.sh"]

# Comando padrão
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]