# Unit economics and scenarios

Generated from scripts/finance.ts with native Bun. All figures are planning assumptions, not measured costs or forecasts. USD, integer cents. No spending is authorized.

| Size | Target | COGS | Gross profit | Delivery subsidy | Fee assumption | Reserve | Acquisition | Support | Contribution |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| XS | $129.00 | $58.00 | $71.00 | $12.00 | $4.04 | $6.45 | $18.00 | $8.00 | $22.51 |
| S | $159.50 | $72.00 | $87.50 | $14.00 | $4.93 | $7.98 | $20.00 | $8.00 | $32.59 |
| M | $224.50 | $99.00 | $125.50 | $16.00 | $6.81 | $11.23 | $25.00 | $8.00 | $58.46 |
| L | $264.50 | $125.00 | $139.50 | $18.00 | $7.97 | $13.23 | $25.00 | $8.00 | $67.30 |
| XL | $264.50 | $155.00 | $109.50 | $24.00 | $7.97 | $13.23 | $25.00 | $10.00 | $29.30 |

Mix: XS 10%, S 20%, M 35%, L 25%, XL 10%. Approximate weighted contribution: $48.99 per kit. At an assumed $1,500 monthly fixed operating cost, break-even is 31 kits per month. Fixed cost excludes founder salary, tax, financing and startup validation.

| Illustrative annual case | Revenue | Contribution | Fixed overhead | Operating result |
| --- | ---: | ---: | ---: | ---: |
| 60 kits | $12,957.00 | $2,939.10 | $18,000.00 | -$15,060.90 |
| 200 kits | $43,190.00 | $9,797.00 | $18,000.00 | -$8,203.00 |
| 600 kits | $129,570.00 | $29,391.00 | $18,000.00 | $11,391.00 |
| Downside costs, 200 kits | $43,190.00 | $3,403.00 | $18,000.00 | -$14,597.00 |

The downside case raises COGS 20% and acquisition cost 50%. It does not change price or include all possible risks. Unit counts use exact integer allocations, with the remainder assigned to XL. Startup validation of $32,000 is separate from operating results. No digital-file or repeat-purchase revenue is assumed.

COGS must include purchased parts, printed material, failed-print allocation, machine capacity, assembly, inspection and packaging. Delivery and support are separate. The 2.9% + $0.30 fee and 5% warranty/return reserve are management inputs, not a processor quote or observed failure rate. Replace each with evidence before committing a production batch.

For the L family the $125 COGS allocation is: printed material $12, rails $18, wheels/axles $38, soft supports $22, fasteners $8, machine/reject allowance $6, assembly $11, QA $5 and packaging $5. These allocations sum to $125 and remain unquoted. XS/S/M/XL are top-down COGS envelopes until their BOMs are priced.

Capacity example: two printers × 16 available hours/day × 22 days × 70% productive utilization = 492.8 productive printer hours/month. At an assumed eight hours per kit that is at most 61 complete print sets/month before assembly or demand constraints. These are assumptions; time an actual qualified build before purchasing capacity.
