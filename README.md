# Appliance Energy Consumption Website (Swinburne – Mercury)

Author: Pham Huy Phuc (105715493) · Unit: COS30045 Data Visualization, Swinburne University of Technology

A 3-page static site (HTML, CSS, vanilla JS) about Australian television energy use.
Open `index.html` in any browser. No build step or dependencies.

```
index.html          Home: hero, energy highlights, FAQ accordion
televisions.html    Data story (4 charts) + interactive energy calculator
about.html          Project, author, audience, data, ethics, AI declaration
assets/css/style.css   Global stylesheet
assets/js/main.js      FAQ, calculator, scroll reveal, footer year
assets/img/power-icon.png   Logo (from PowerIcon.png)
assets/img/charts/          Charts exported from KNIME
```

## Data story
Source charts show mean labelled energy consumption (kWh/year) from the GEMS television dataset:
1. **Brand spread** – brand averages range from ~53 (ARK) to ~823 kWh/year.
2. **Popular brands** – roughly 290 to 600 kWh/year.
3. **Power supply type** – EPS ~100 vs internal ~462 kWh/year.
4. **Top 10 lowest** – ARK ~53 up to RCA ~90 kWh/year.

Values are read from the charts and are approximate. Brand averages mix models of different sizes.

## Audience
Australian households, appliance shoppers and cost- or environment-conscious consumers who prefer
minimalism, concise summaries, transparent data and smooth desktop/mobile use.

## Data Source
Australian Government – Energy Rating Data for household appliances – Labelled Products (Televisions)
Source: https://data.gov.au/data/dataset/559708e5-480e-4f94-8429-c49571e82761/resource/93a615e5-935e-4713-a4b0-379e3f6dedc9/download/tv_2026_09_30.csv

## Ethics
Only aggregated product data is shown. The calculator runs entirely in the browser; nothing is stored or sent.
Costs are estimates based on user-entered wattage, hours and price.

## Calculator formulas
- kWh/day = Wattage × Daily hours ÷ 1000
- kWh/year = kWh/day × 365
- Cost ($/year) = kWh/year × Price (cents) ÷ 100

## Design notes
Apple-style minimalism with Samsung/LG-style dark feature panels. One accent (energy green #34C759 for fills;
#1E7B34 for text/buttons so contrast passes WCAG AA). Secondary text is #6E6E73 for the same reason.
Corner radii: cards 24px, inputs 14px, buttons pill. Respects `prefers-reduced-motion` and
`prefers-reduced-transparency`.

## Generative AI declaration
Generative AI assisted with the JavaScript portion of this site (FAQ accordion and energy calculator). All other work is my own.


