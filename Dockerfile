# ---------- Base ----------
FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- Build ----------
FROM base AS build

# Accept build arguments for environment variables
# These are NEXT_PUBLIC_* variables that need to be available at build time
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# Set environment variables from build arguments
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---------- Runtime ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# ?? B?T BU?C C�I PNPM L?I
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/next.config.* ./

EXPOSE 3006

CMD ["pnpm", "start"]
