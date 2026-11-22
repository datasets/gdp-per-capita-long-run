Real GDP per person and population by country and year, for comparing how rich countries are, relative to each other and over long periods. The main series is the Maddison Project Database 2023, which covers 169 countries in 2011 international dollars: 14 countries have an estimate for year 1, 55 for 1820, 146 for 1950 and all 169 for 2022. It also gives Maddison's averages for eight world regions and the world. A second file has Penn World Table (PWT) 11.0 real GDP per person in 2021 US dollars for 185 countries, 1950 to 2023, as an independent modern series.

GDP per person here is adjusted for differences in prices between countries (purchasing power parity, PPP) and for inflation, so a dollar buys roughly the same everywhere and in every year. It measures output, not income distribution or wellbeing, and estimates for early years and poor countries are rough.

## What stands out

Since 1950, more than four in ten countries have fallen further behind the United States. Of the 145 countries with Maddison estimates for both 1950 and 2022, 63 had a lower GDP per person relative to the US in 2022 than in 1950. A few raced ahead: South Korea went from 6.5% of the US level (998 against 15,240 international dollars of 2011) to 70.6% (41,321 against 58,487), and Taiwan from 9.6% to 90.9%. In 1950 Ghana was richer per person than South Korea (1,788 against 998); by 2022 South Korea was 9.7 times richer (41,321 against 4,242), and Ghana had slipped from 11.7% of the US level to 7.3%. These are shares of the US level, not falls in absolute income: Ghana's GDP per person more than doubled over the period.

## Data

### maddison-gdp-per-capita.csv

One row per country and year where the Maddison Project gives an estimate (23,280 rows).

- `country_code`: three-letter code as used by the Maddison Project. These are ISO 3166-1 alpha-3 codes, plus three former states: `CSK` (Czechoslovakia), `SUN` (Former USSR) and `YUG` (Former Yugoslavia), which have estimates up to their break-up, while their successor states start later. `SDN` is Sudan before the 2011 split and `TZA` is mainland Tanzania.
- `country`: name as given by the Maddison Project.
- `year`: before 1820 coverage is thin (14 countries have an estimate for year 1 and 21 for 1800), though a few European countries have long annual series; most countries are annual from 1950 (145 countries have every year 1950-2022).
- `gdp_per_capita`: real GDP per person in 2011 international dollars, rounded to cents. Empty for years with a population estimate but no GDP estimate.
- `population`: mid-year population in persons. The source gives thousands; they are multiplied by 1,000 and rounded.
- `region`: one of the eight Maddison regions (East Asia, Eastern Europe, Latin America, Middle East and North Africa, South and South East Asia, Sub Saharan Africa, Western Europe, Western Offshoots, the last being the US, Canada, Australia and New Zealand).

### maddison-regions.csv

The Maddison Project's own regional and world averages of GDP per person and population (227 rows): every ten years from 1820 to 2010, then every year from 2015 to 2022. The project computes them from all the country estimates available, so early figures rest on few countries; many regions have gaps before 1950, and population is given for only some years before 1950.

### pwt-gdp-per-capita.csv

Penn World Table 11.0, one row per country and year from 1950 to 2023 (11,201 rows). Coverage grows over time: 55 countries in 1950, all 185 by 2023.

- `country_code`, `country`: ISO 3166-1 alpha-3 code and name, as in PWT.
- `rgdpe_per_capita`: expenditure-side real GDP at chained PPPs per person, in 2021 US dollars (PWT `rgdpe` divided by `pop`). PWT recommends this for comparing living standards across countries and over time.
- `rgdpo_per_capita`: output-side real GDP at chained PPPs per person, in 2021 US dollars (`rgdpo` divided by `pop`), a measure of productive capacity. It differs from `rgdpe` mostly for countries whose export and import prices move a lot, such as oil exporters.
- `population`: persons (PWT gives millions; multiplied by 1,000,000 and rounded).

### How the two sources differ

Comparing countries needs PPPs, the exchange rates that equalise the cost of the same goods. They come from the World Bank's International Comparison Program (ICP), which prices goods in most countries in benchmark years (2005, 2011, 2017, 2021 and others). The two databases use them differently, by design:

- Maddison expresses everything in 2011 international dollars. Levels are anchored on 2011 PPPs, and other years mostly follow each country's real growth rate from national accounts and, before about 1950, historical research. It is built to compare one country over centuries and to put the whole world on one scale.
- PWT uses all the ICP benchmark rounds and chains them, in 2021 US dollars, so a country's level can shift when new price surveys arrive. It starts in 1950 and is built for comparing countries in the modern period.

So the levels differ (the US in 1950 is 15,240 in Maddison, in 2011 international dollars, and 17,501 in PWT `rgdpe`, in 2021 US dollars), and so can growth rates for some countries. Use one source per comparison; do not splice them into one series. The Maddison estimates for 1950 in many African and Middle Eastern countries are rough, which matters for statements about catch-up from 1950.

## Source and licence

Main source: Jutta Bolt and Jan Luiten van Zanden, [Maddison Project Database, version 2023](https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023), Groningen Growth and Development Centre, University of Groningen (data at doi.org/10.34894/INZBF2). Cite as: Bolt, Jutta and Jan Luiten van Zanden (2024), "Maddison style estimates of the evolution of the world economy: A new 2023 update", Journal of Economic Surveys, 1–41, DOI 10.1111/joes.12618. The Maddison Project asks that the original papers behind each country's estimates (listed in the "Sources" sheet of its workbook) be cited when the data is shown in a chart or when fewer than 12 countries are used.

Second source: Robert C. Feenstra, Robert Inklaar and Marcel P. Timmer, [Penn World Table 11.0](https://www.rug.nl/ggdc/productivity/pwt/), Groningen Growth and Development Centre (data at doi.org/10.34894/FABVLR). Cite as: Feenstra, Robert C., Robert Inklaar and Marcel P. Timmer (2015), "The Next Generation of the Penn World Table", American Economic Review, 105(10), 3150-3182.

Licence: both are licensed under the Creative Commons Attribution 4.0 International Licence (CC BY 4.0), as stated on their release pages. The exact wording is in `archive/PROVENANCE.md` in the source repository. This package is offered under the same licence.

This is a frozen snapshot taken on 2026-11-22 of Maddison Project Database 2023 and Penn World Table 11.0. Future releases will not be added here automatically. The related Commons dataset [gdp](https://datahub.io/core/gdp) has World Bank GDP totals in current US dollars from 1960; this one adds GDP per person adjusted for price differences, back to 1820 and earlier.
