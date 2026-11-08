# Application architecture and operations

Buddy Wheels is a package-based Stacks application created with `./buddy new /Users/chris/Code/Apps/buddy-wheels --no-provision`. It uses Bun, STX, ts-css, native Stacks components and native commerce/database/actions. No React, Next.js, Shopify, external cart service or alternative CSS framework is used.

## Local setup

```sh
bun install --frozen-lockfile
cp .env.example .env
./buddy key:generate
./buddy migrate --no-generate
./buddy seed-catalog
./buddy dev --browser
```

Default local web URL is `http://localhost:3460`; the native API runs at 3008 during development. Production uses an independent loopback web/API port pair on the shared server. See config/cloud.ts for the chosen production ports. The database is SQLite. No new schema was invented for the basket: the native Product, Cart and CartItem models/migrations supply it.

`seed-catalog` is idempotent and writes only the five known development configurations through the native database query builder. `is_available` means available to the preview basket; zero physical inventory and the unconditional order gate prevent that flag being mistaken for sellable stock. Do not expose generated public product writes. `security.api.models` remains `own` and `STACKS_DEFAULT_ROUTES=none` prevents mounting unrelated default endpoints.

## Request and rendering boundaries

- STX renders the marketing, story, care, policies, product, fit, basket and checkout pages.
- Native ProductCard, QuantitySelector, Button, OrderSummary and CheckoutSteps provide reusable shopping primitives.
- app/Storefront/Catalog.ts owns proposed size bands and dated price targets in cents. The financial model consumes the same catalog.
- The local fit planner imports the pure catalog helper. Measurements remain in page memory and are not sent to an endpoint or placed in a URL.
- app/Storefront/Cart.ts uses native signed-cookie verification and the native SQLite storefront read boundary.
- Basket actions validate app inputs, then delegate to the native storefront implementation. Product prices are read by the server, not trusted from a form.
- The explicit checkout action always returns HTTP 409 with PRODUCT_VALIDATION_REQUIRED. An app override of the default PlaceOrderAction points to the same gate.

Only the app's four API routes are mounted. No payment driver is initialized for the storefront and no orders, deposits or reservations are created. The preview checkout does not ask for personal or payment details. Native cart cookies and records persist the development basket.

## Framework improvements

Changes made in the Stacks source repository extend ProductCard with generic description, priceNote, href and imageAlt, and move status text below images. QuantitySelector now uses native STX state/model bindings with independent instances, live bounds, normalized native form values and one native change event. Source browser regression tests cover these contracts. The app should consume the resulting framework patch, rather than retain local copies of those components.

## Deployment topology

The user owns buddywheels.org at Porkbun and authorized deployment with Buddy to the existing server owned by the stacks project. The tenant declares `cloud.attachTo: 'stacks'`, its own project slug and its own sites in this repository. The host project must not check out or publish tenant source. The tenant owns only its gateway fragment, application services, certificates and persistent data directories.

Provider credentials are deploy-process inputs. Do not commit them, copy the owner's complete env into this app, log them or ship unrelated tenant secrets. Reuse only the explicitly needed provider credentials from the authorized protected source. The production runtime env is specific to Buddy Wheels, with its own APP_KEY and isolated SQLite path. Add the tenant slug to the private Stacks tenant roster so owner deployments strip its namespace.

Preview the exact plan with `./buddy deploy --prod --dry-run --json`, inspect the live host's listening ports before finalizing ports, then deploy with `./buddy deploy --prod --yes`. Confirm DNS, TLS, marketing routes, same-origin API reachability, signed basket isolation and the HTTP 409 checkout gate on the public domain. A successful homepage alone is insufficient evidence.

## Production data and release

Keep SQLite, snapshots, storage and backups outside atomic release directories under the native tenant persistence paths. The web site's preStart applies committed migrations without generating schema changes and idempotently seeds the catalog. Back up before subsequent migrations. The API binds loopback and is exposed only through the web site's same-origin proxy.

Before enabling orders, implement qualified inventory, completed fitting review, provider payment setup, tax/delivery quotes, transactional order creation, provider webhooks, retries/idempotency, refunds and tested aftercare. These should extend native Stacks commerce/payments and models. Attach the physical-product release evidence to the code change that replaces the order gate.

## Verification commands

```sh
./buddy lint
./buddy test
./buddy typecheck
bun run typecheck:app
bun run typecheck:views
bun run finance
```

Real-browser QA uses the bundled stacks-browse driver or @stacksjs/testing/browser. It drives an existing Chromium executable through Bun/CDP and requires no Playwright/Puppeteer dependency. When only a cached browser binary exists, name it through CHROME_PATH for the testing package or BROWSE_BROWSER for the standalone driver. Screenshots and reports live in ignored storage/framework/runtime.
