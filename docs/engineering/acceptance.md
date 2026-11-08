# Acceptance record

Implementation and local QA recorded November 7, 2026. This record covers software and planning artifacts only. It does not validate a physical wheelchair.

## Completed locally

- Project created with native Buddy scaffolding under ~/Code/Apps/buddy-wheels.
- Commerce enabled through Buddy and 244 native migrations applied to the development SQLite database.
- Five known development configurations installed with the idempotent native seed command.
- Marketing, shop, fit guide, basket, checkout preview, story, care, policies and development-plan pages implemented in STX with ts-css.
- Native ProductCard, QuantitySelector, Button, OrderSummary and CheckoutSteps used for commerce UI.
- Business plan, reproducible financial model, product/manufacturing plan, validation/risk register, research, marketing and operations docs completed.
- Origin story corrected to include Buddy's very large size and limited suitable options, alongside affordability.
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

Source review found and corrected duplicate change events and stale form values after live bounds changed. The publishing pipeline also exposed a pre-existing router declaration-generator failure; removing a redundant nested conditional preserves type behavior and passed router build/type fixtures. Source changes were fast-forward pushed to origin/main and native patch release commands were run. Publication and installed-consumer evidence is recorded below when completed.

## Production verification

Pending the final deployed release. Public acceptance must verify apex HTTPS, www redirect, assets, all pages, same-origin cart API, cookie isolation, target-price calculations and the server checkout gate. A successful dry-run or homepage response is not recorded as a deployed service.

## Product work still required

No production CAD/STL/3MF, qualified print specification, structural test report, veterinary fitting study, certified load rating, production inventory, supplier quotes, insurance, final return/warranty terms, live payment provider or customer order exists. Follow docs/product/validation.md before enabling sales or using a prototype on an animal.
