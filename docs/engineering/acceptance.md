# Acceptance record

Implementation and local QA recorded November 7, 2026. Production deployment and public QA recorded November 8, 2026. This record covers software and planning artifacts only. It does not validate a physical wheelchair.

## Completed locally

- Project created with native Buddy scaffolding under ~/Code/Apps/buddy-wheels.
- Commerce enabled through Buddy and 244 native migrations applied to the development SQLite database.
- Five known development configurations installed with the idempotent native seed command.
- Marketing, shop, fit guide, basket, checkout preview, story, care, policies and development-plan pages implemented in STX with ts-css.
- Native ProductCard, QuantitySelector, Button, OrderSummary and CheckoutSteps used for commerce UI.
- Business plan, reproducible financial model, product/manufacturing plan, validation/risk register, research, marketing and operations docs completed.
- Origin story corrected to include Buddy's very large size and limited suitable options, alongside affordability.
- Public development page includes outdoor-use goals and separate suspension/body-support research, with no availability or rehabilitation efficacy claim.
- Native app lint passed with zero errors and zero warnings.
- App TypeScript checks passed, including the direct application project check.
- STX checks passed with zero errors and zero warnings.
- Native unit/feature suite passed: five tests, 37 assertions.
- Browser journey passed: choose L, set quantity two, add to basket, change quantity, preview checkout, acknowledge fitting and see the disabled payment state.
- Server checkout returns HTTP 409 and PRODUCT_VALIDATION_REQUIRED.
- Fresh/tampered cart cookies reveal no other basket, and fractional quantities/open redirects are rejected.
- Local fit planner passed a medium-family example and labels its result as unapproved.
- Home layout checked at 320, 428, 768 and 1440 pixels with zero horizontal overflow and no browser console errors.
- Native deployment dry-run targets the existing stacks host, not new compute. Web/API ports 3460/3468 were checked against live listeners and were unused at inspection time.
- Private production env and provider credentials are excluded from Git. Only required provider keys are passed to the local deployment process.

## Framework source evidence

The Stacks source includes generic product-card props, status copy below images, isolated STX quantity state, native form values, one native change event, and live bounds/model normalization. Four retained source tests passed with 26 assertions, including real Chromium interactions. Source lint and framework typechecks passed.

Source review found and corrected duplicate change events and stale form values after live bounds changed. The publishing pipeline also exposed a pre-existing router declaration-generator failure; removing a redundant nested conditional preserves type behavior and passed router build/type fixtures. Source changes were fast-forward pushed to origin/main and native patch release commands were run. Publication and installed-consumer evidence follows.

Stacks 0.75.522 was published to npm after the exact release source passed CI. Native `./buddy upgrade` installed it in this application, updating the root and framework-support manifests and lockfile. Installed stacks, defaults and actions package versions were verified as 0.75.522. App lint, native tests, typechecks and STX checks passed against that install. The real-browser journey passed again, including native ProductCard links to `/shop?size=L`, quantity updates, concurrent five-per-size enforcement and all four responsive widths. No local component fork is used.

## Production verification

Live at [buddywheels.org](https://buddywheels.org). The founder enabled domain-specific Porkbun API access, verified through the saved setting and a successful native provider request. The authorized provider keys remained deploy-process inputs.

Native `./buddy deploy --prod --yes` successfully deployed application commit `8089b9153ef4e9e624ed6d6787349bb355c2421d` to the existing `stacks-production-app` server. It skipped provisioning and installed independent `buddy-wheels-main` and `buddy-wheels-api` services and the `buddy-wheels` gateway fragment. The API listener was verified on loopback port 3468; web traffic is routed to port 3460. SQLite persists at the app-specific absolute path declared in config/cloud.ts.

- Native Porkbun reconciliation published apex and www IPv4/IPv6 records.
- Native TLS issuance completed for both names. HTTPS passed with normal certificate verification.
- HTTP and www requests for `/shop?size=L` returned 301 to `https://buddywheels.org/shop?size=L`.
- All nine public pages returned 200: home, shop, fit guide, basket, checkout, story, care, policies and development plan.
- The theme stylesheet and responsive WebP assets returned 200 with their expected content types.
- Same-origin `/api/cart` returned 200 JSON; order placement returned HTTP 409 with PRODUCT_VALIDATION_REQUIRED.
- The full native Chromium journey passed against the public HTTPS origin: L quantity two totals $529.00, quantity one totals $264.50, checkout remains disabled, unsigned/forged/absent cookies isolate baskets, invalid quantities and redirects are rejected, and concurrent adds retain the five-per-size limit.
- The local fit planner example passed on the public site. Responsive checks at 320, 428, 768 and 1440 pixels found no horizontal overflow or browser console errors.
- Application CI passed for the deployed commit; the Stacks 0.75.522 release workflow completed successfully.

The site is a development storefront with persistent planning baskets. It accepts no payments, deposits, reservations or customer orders. Software delivery does not establish physical-product readiness.

## November 8 storefront and Rover update

Launch-style copy replaces the repeated planning language and competitor-price references in all public pages. Internal price evidence remains in the project docs. A concise availability statement and the server order gate remain accurate.

- Buddy Rover adds complete Run ($399), Coast ($449), Snow ($499) and All-season ($599) configurations to the native catalog, shared signed basket and idempotent seeder.
- The wheelchair fit helper still searches only wheelchair size families. No untested carrier dimensions or load rating is published.
- Native STX configuration state updates price, SKU, included items and imagery. Snow has its own generated visualization and SKU thumbnail.
- Basket quantity changes save through their owning native form; removal, correct product images/links and the shared header count work across both families.
- Product pages have mobile purchase actions; checkout now has one direct availability step without forced preview acknowledgements.
- Native `buddy upgrade` installed Stacks 0.75.524. Source OrderSummary changes preserve defaults while supporting separate heading, tax and item-total labels. Source tests and exact release CI passed; a superseded 0.75.523 release was cancelled after the newer mainline release included its changes.
- App lint has zero errors/warnings; app TypeScript and STX checks passed; seven tests passed with 45 assertions; both financial documents regenerated successfully.
- Retained native Chromium QA passed on the installed package graph: real home-to-Rover-to-wheelchair navigation, configuration prices, image switching, mixed totals, mobile submit, quantity limits/concurrency, removal, cookie isolation, professional-fit wording and the HTTP 409 gate.
- All ten public pages were checked at 320, 428, 768 and 1440 pixels with no horizontal overflow or console errors. Hero CTA centers, principle icons and heading tops align within one CSS pixel; native purchase buttons use the forest-green theme. Mobile safe-area spacing and visible keyboard focus are styled consistently.
- Independent Standards and Spec reviews found three issues, all corrected: overly advanced readiness wording, an unverified stability adjective and incorrect Rover Open Graph metadata.

Public deployment evidence for this iteration follows after the production check.

## Physical product gate

No production CAD/STL/3MF, qualified print specification, structural test report, veterinary fitting study, certified load rating, production inventory, supplier quotes, insurance, final return/warranty terms, live payment provider or customer order exists. Follow docs/product/validation.md before enabling sales or using a prototype on an animal.
