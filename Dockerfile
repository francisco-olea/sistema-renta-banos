FROM node:lts-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json package-lock.json* npm-shrinkwrap.json* ./
RUN npm install --silent

FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3010
COPY package.json package-lock.json* npm-shrinkwrap.json* ./
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.mjs ./next.config.mjs
COPY --from=builder /usr/src/app/node_modules ./node_modules
EXPOSE 3010
RUN chown -R node:node /usr/src/app
USER node
CMD ["npm", "start"]
