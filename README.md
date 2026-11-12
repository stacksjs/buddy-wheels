# Buddy Wheels

A repairable dog-mobility business and native Stacks storefront, inspired by Buddy. Live at [buddywheels.org](https://buddywheels.org).

The storefront includes five wheelchair size families, Buddy Rover Run/Coast/Snow/All-season configurations, a local fit guide and a shared basket. Product pages have mobile basket actions; the basket supports automatic quantity updates, removal and product-specific images. **Ordering is not open: no orders, reservations, deposits or payments are accepted.** Physical products are still design concepts with no qualified ratings or production release.

Start with the [project documents](docs/README.md), [business plan](docs/business/business-plan.md), [wheelchair development plan](docs/product/product-development.md), [Buddy Rover brief](docs/product/buddy-rover.md) and [validation gates](docs/product/validation.md).

The [XL-first mechanical package](designs/wheelchair/r0/README.md) contains actual editable bench CAD, 1:1 printable meshes and metal profiles for XS through XL, plus BOMs and assembly travelers. [Buddy's JSON profile](designs/wheelchair/profiles/buddy-xl-estimate.json) records his owner-reported 140 lb weight with configurable estimated geometry; it exports independently of the baseline families. Start with the [illustrated XL assembly guide](docs/engineering/xl-assembly-r0.md) and [LA printer comparison](docs/engineering/printer-options-la.md). These are bench prototypes requiring engineering verification and professional fit review before animal use.

The [wheelchair design studio](https://buddywheels.org/design-studio) provides native interactive 3D inspection, live frame dimensions, suspension leverage/travel/lock controls, individual part views and a matching downloadable bench kit. See its [delivery and verification notes](docs/engineering/design-studio.md).

## Development

Requires Bun >= 1.3.0 and SQLite >= 3.47.2. This project currently declares the scaffold's Bun 1.4.4 toolchain.

```sh
bun install --frozen-lockfile
cp .env.example .env
./buddy key:generate
./buddy migrate --no-generate
./buddy seed-catalog
./buddy dev --browser
```

Open http://localhost:3460. If .env already exists, keep it and set the documented values rather than overwriting its APP_KEY. Do not copy another application's complete environment file.

```sh
./buddy lint
./buddy test
./buddy typecheck
bun run typecheck:app
bun run typecheck:views
bun run finance
```

## Native stack

STX templates, ts-css utilities, Stacks UI components, native Actions and route registration, SQLite query builder and native commerce Product/Cart/CartItem tables. Monetary values are integer cents. Reusable ProductCard, QuantitySelector and OrderSummary improvements are maintained in the Stacks source and consumed through published framework patches.

## Production

Domain: buddywheels.org, registered by the owner at Porkbun. The native cloud config attaches this independent project to the server owned by the stacks project, using an isolated tenant slug, port pair, gateway fragment and persistent database. Deployment uses `./buddy deploy --prod --yes` after checking its dry-run plan. Provider credentials stay in the protected deploy environment.

See [architecture and operations](docs/engineering/architecture.md) and the [acceptance record](docs/engineering/acceptance.md) for executed checks and remaining launch work.

The [visual fit guide](https://buddywheels.org/fit-guide) includes an interactive body-measurement worksheet and printable customer handbook. The [complete XL prototype budget](docs/business/xl-prototype-build-budget.md) separates one-off build cash, reusable equipment and unquoted professional development work. See the [r0 appearance refinement](docs/engineering/industrial-design-refinement.md) for the updated forest/silver palette and rounded nonstructural prints.

## XL r1 standard-parts redesign

[Inspect XL r1](https://buddywheels.org/design-studio-xl): a separate cut-to-fit rigid bench frame with standard tube/shafts, two repeated metal profiles and nonstructural prints. [Priced cost model](docs/business/xl-standard-r1-costs.md): $244.02 per chair at 100 units with the complete textile study, still using unquoted production assumptions, with customer-paid outbound shipping. This is not a verified price or an animal-use release. The [r2 spring-cartridge studio](https://buddywheels.org/design-studio-xl-suspension) explores a lower-cost preload-adjustable option, with [separate checked cost scenarios](docs/business/xl-spring-r2-costs.md). Native rebuild: `./buddy design:xl-standard --export --openscad /absolute/path/to/OpenSCAD`.

## Complete support and harness design

All seven studio configurations now include a woven rear saddle, removable spacer-mesh and padding, a front bib/harness, webbing, wraps, adjusters and cover closures. [Cut/sew instructions](docs/engineering/softgoods-xl-r1.md) and [scope and verification](docs/engineering/softgoods-plan.md) explain the material layers, exact patterns and remaining physical qualification. Each configured kit includes 1:1 SVG/DXF patterns, printable paper tiles, a textile BOM and assembled CAD. Textile reference STLs are inspection volumes, not printable harnesses. Native rebuild: `./buddy design:softgoods --openscad /absolute/path/to/OpenSCAD`.

The [complete XL per-unit cost study](docs/business/xl-complete-unit-costs.md) replaces the $24 harness target with actual cut schedules, listed material packs and explicit sewing labor. At $299, the current spring-chair estimate fails the margin and contribution gates.

## Buddy Rover r0 walk-in carrier

[Inspect Rover r0](https://buddywheels.org/design-studio-rover): a large cut-to-fit cabin whose tailgate folds down into a ramp of about nine degrees, with a rain, wind and sun cover and printable service parts. The [design files](designs/rover/r0/README.md) hold fifteen STL files, four metal DXFs, a dimensioned drawing, cut list, parts list and cover cut schedule. Read the [materials and weather system](docs/product/rover-materials.md) and the [cost study](docs/business/rover-r0-costs.md), which finds that this bolted bench architecture costs far more than the provisional catalog price. It is a bench design with no load rating, no sewn sample and no test. Native rebuild, no external CAD program: `./buddy design:rover`.
