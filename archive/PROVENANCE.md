# Provenance

## Files

| File | Source URL | Retrieved | Bytes | sha256 |
|---|---|---|---|---|
| mpd2023_web.xlsx | https://dataverse.nl/api/access/datafile/421302 (the "Excel" link on the Maddison Project Database 2023 release page; served as `mpd2023_web.xlsx`) | 2026-11-22 | 4,903,804 | ecc5916ca12789b983fc4be437f8a354bbf4291323605324ac3e0aea4c57cbb6 |
| pwt110.xlsx | https://dataverse.nl/api/access/datafile/554105 (the "Excel" link on the Penn World Table page; served as `pwt110.xlsx`) | 2026-11-22 | 5,839,841 | 7b337e94f39dfe304bc459e433f8ce0624496c812707ae0c924888f5142b3ab3 |

Both were downloaded with a generic User-Agent (`datasets-commons-wrangler`) and are kept unchanged. `scripts/build.mjs` reads the "Full data" and "Regional data" sheets of the Maddison workbook and the "Data" sheet of the PWT workbook. The Stata versions on the same pages (Maddison datafile 421303, PWT datafile 554030) hold the same data and were not used.

- Maddison Project Database 2023: release page https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023, Dataverse DOI 10.34894/INZBF2. The 2023 version covers 169 countries and the period up to 2022. The workbook's Notes sheet gives units: "Real GDP per capita in 2011$" and "Population, mid-year (thousands)".
- Penn World Table 11.0: page https://www.rug.nl/ggdc/productivity/pwt/, Dataverse DOI 10.34894/FABVLR. Published on October 7, 2025; 185 countries, 1950-2023. Units from the workbook's Legend sheet: rgdpe "Expenditure-side real GDP at chained PPPs (in mil. 2021US$)", rgdpo "Output-side real GDP at chained PPPs (in mil. 2021US$)", pop "Population (in millions)".

## Licence

Maddison Project Database 2023, quoted verbatim from the release page https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023 (retrieved 2026-11-22), section "License and funding", which links to http://creativecommons.org/licenses/by/4.0/:

> Maddison Project Database, version 2023 by Jutta Bolt and Jan Luiten van Zanden is licensed under a Creative Commons Attribution 4.0 International License.

Its attribution requirement, from the same page (on the page the two conditions are list items; here they are joined with a semicolon):

> All original papers must be cited when: the data is shown in any graphical form; subsets of the full dataset that include less than a dozen (12) countries are used for statistical analysis or any other purposes. A list of original papers can be found in the source sheet of the database. When neither a) or b) apply, then the MPD as a whole should be cited. MPD version 2023: Bolt, Jutta and Jan Luiten van Zanden (2024), "Maddison style estimates of the evolution of the world economy: A new 2023 update", Journal of Economic Surveys, 1–41. DOI: 10.1111/joes.12618

Penn World Table 11.0, quoted verbatim from https://www.rug.nl/ggdc/productivity/pwt/ (retrieved 2026-11-22), section "License and funding", which links to http://creativecommons.org/licenses/by/4.0/:

> Penn World Table 11.0 by Robert C. Feenstra, Robert Inklaar and Marcel P. Timmer is licensed under a Creative Commons Attribution 4.0 International License.

Its attribution requirement, from the same page:

> When using these data (for whatever purpose), please make the following reference: Feenstra, Robert C., Robert Inklaar and Marcel P. Timmer (2015), "The Next Generation of the Penn World Table" American Economic Review, 105(10), 3150-3182, available for download at www.ggdc.net/pwt

Note: the original Commons issue (datasets/commons#101, 2015) warned of possible IP issues with Angus Maddison's older spreadsheets. The 2023 Maddison Project release used here carries an explicit CC BY 4.0 licence from its authors, so that concern does not apply to this snapshot.

Because the Maddison terms ask that all original papers be cited whenever the data is shown in graphical form, this package ships no chart or view of the Maddison data. Anyone charting it should cite the papers listed in the workbook's "Sources" sheet (kept in `archive/mpd2023_web.xlsx`).
