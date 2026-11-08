# Unit economics and scenarios

Generated from scripts/finance.ts with native Bun. All figures are planning assumptions, not measured costs or forecasts. USD, integer cents. No spending is authorized.

| Size | Target | COGS | Gross profit | Delivery subsidy | Fee assumption | Reserve | Acquisition | Support | Contribution |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| XS | $129.00 | $58.00 | $71.00 | $12.00 | $4.04 | $6.45 | $18.00 | $8.00 | $22.51 |
| S | $159.50 | $72.00 | $87.50 | $14.00 | $4.93 | $7.98 | $20.00 | $8.00 | $32.59 |
| M | $224.50 | $99.00 | $125.50 | $16.00 | $6.81 | $11.23 | $25.00 | $8.00 | $58.46 |
| L | $264.50 | $125.00 | $139.50 | $18.00 | $7.97 | $13.23 | $25.00 | $8.00 | $67.30 |
| XL | $264.50 | $180.01 | $84.49 | $0.00 | $7.97 | $13.23 | $25.00 | $10.00 | $28.29 |

Mix: XS 10%, S 20%, M 35%, L 25%, XL 10%. Approximate weighted contribution: $48.88 per kit. At an assumed $1,500 monthly fixed operating cost, break-even is 31 kits per month. Fixed cost excludes founder salary, tax, financing and startup validation.

| Illustrative annual case | Revenue | Contribution | Fixed overhead | Operating result |
| --- | ---: | ---: | ---: | ---: |
| 60 kits | $12,957.00 | $2,933.04 | $18,000.00 | -$15,066.96 |
| 200 kits | $43,190.00 | $9,776.80 | $18,000.00 | -$8,223.20 |
| 600 kits | $129,570.00 | $29,330.40 | $18,000.00 | $11,330.40 |
| Downside costs, 200 kits | $43,190.00 | $3,282.80 | $18,000.00 | -$14,717.20 |

The downside case raises COGS 20% and acquisition cost 50%. It does not change price or include all possible risks. Unit counts use exact integer allocations, with the remainder assigned to XL. Startup validation of $32,000 is separate from operating results. No digital-file or repeat-purchase revenue is assumed.

The [one-off XL suspension prototype budget](xl-prototype-build-budget.md) prices a separate r0 custom bench rig, including equipment and development allowances. The production targets below do not price that rig and remain unquoted.

COGS must include purchased parts, printed material, failed-print allocation, machine capacity, assembly, inspection and packaging. Delivery and support are separate. The 2.9% + $0.30 fee and 5% warranty/return reserve are management inputs, not a processor quote or observed failure rate. Replace each with evidence before committing a production batch.

For the L family the $125 COGS allocation is: printed material $12, rails $18, wheels/axles $38, soft supports $22, fasteners $8, machine/reject allowance $6, assembly $11, QA $5 and packaging $5. These allocations sum to $125 and remain unquoted. XS/S/M remain top-down COGS envelopes. XL now uses the [r1 standard-parts model](xl-standard-r1-costs.md) at 100 units, with customer-paid outbound freight. Its $180.01 COGS scenario includes checked tube/wheel prices and unquoted manufacturing allowances, not verified production costs. Its $28.29 contribution falls to $4.29 if we subsidize $24 delivery.

Capacity example: two printers × 16 available hours/day × 22 days × 70% productive utilization = 492.8 productive printer hours/month. At an assumed eight hours per kit that is at most 61 complete print sets/month before assembly or demand constraints. These are assumptions; time an actual qualified build before purchasing capacity.
