# Stage 1: build the WebAssembly module
FROM rust:1-bookworm AS wasm-builder

RUN cargo install wasm-pack --locked

WORKDIR /build
COPY infectiowasm/ ./infectiowasm/

RUN cd infectiowasm && bash scripts/build.sh

# Stage 2: build the web frontend
FROM node:22-alpine AS web-builder

WORKDIR /build

COPY --from=wasm-builder /build/infectiowasm/pkg ./infectiowasm/pkg

COPY web/package.json web/package-lock.json ./web/
RUN cd web && npm ci

COPY web/ ./web/
RUN cd web && npm run build

# Stage 3: runtime
FROM nginx:alpine AS runtime

LABEL maintainer="Hernán Herrera <hernannh@gmail.com>"
LABEL org.opencontainers.image.title="infectio"
LABEL org.opencontainers.image.description="Modern, offline static malware analysis tool built with WebAssembly — actively maintained fork of filippofinke/infectio"
LABEL org.opencontainers.image.source="https://github.com/hernannh/infectio"
LABEL org.opencontainers.image.licenses="MIT"

COPY --from=web-builder /build/web/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD wget -q --spider http://127.0.0.1/ || exit 1
