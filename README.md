# B2B SaaS Demo

- Next.js 13 with App Router
- Clerk
- Stripe

## Running Locally

Default package manager for the repo is `pnpm` but you can use `npm` or `yarn`

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```
- Visit clerk.com, create an application and grap the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` `CLERK_SECRET_KEY`
- Sign up to stripe and create a `STRIPE_API_KEY`
- The `STRIPE_WEBHOOK_SECRET` will be displayed to you in Step 4.

3. Start the development server:

```sh
pnpm dev
```

4. Start the stripe cli:
```sh
pnpm stripe
```
