pnpm i
pnpm -C packages/shared build
pnpm -C packages/app build:server
pnpm -C packages/app build:client
pnpm -C ./packages/view openapi
pnpm -C packages/view build
