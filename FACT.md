# Fact for checking

Claim (README "What stands out"): of the 145 countries (other than the US) with Maddison estimates of GDP per capita for both 1950 and 2022, 63 had a lower GDP per person relative to the US in 2022 than in 1950.

Numbers (from data/maddison-gdp-per-capita.csv, column gdp_per_capita, 2011 international dollars):

- USA: 1950 15,240; 2022 58,487.47
- Countries other than USA with a value in both years: 145; of these, ratio to US lower in 2022 than in 1950: 63
- South Korea (KOR): 1950 998.09 (6.5% of US); 2022 41,320.9 (70.6%)
- Taiwan (TWN): 1950 1,460 (9.6%); 2022 53,142.98 (90.9%)
- Ghana (GHA): 1950 1,788 (11.7%); 2022 4,242.41 (7.3%)
- Korea / Ghana: 1950 0.56; 2022 9.74 (README says 9.7 times)

Recompute (run in the dataset directory; country names can contain quoted commas, so fields are read from the right):

```sh
node -e 'const L=require("fs").readFileSync("data/maddison-gdp-per-capita.csv","utf8").trim().split("\n").slice(1).map(l=>{const f=l.split(",");return{c:f[0],y:+f.at(-4),g:f.at(-3)}}).filter(r=>r.g!=="");const v=(c,y)=>{const r=L.find(r=>r.c==c&&r.y==y);return r?+r.g:null};const a=v("USA",1950),b=v("USA",2022);const cs=[...new Set(L.map(r=>r.c))].filter(c=>c!="USA"&&v(c,1950)&&v(c,2022));console.log("US",a,b,"countries",cs.length,"fell behind",cs.filter(c=>v(c,2022)/b<v(c,1950)/a).length);for(const c of ["KOR","TWN","GHA"])console.log(c,v(c,1950),v(c,2022),(100*v(c,1950)/a).toFixed(1)+"%",(100*v(c,2022)/b).toFixed(1)+"%");console.log("KOR/GHA 2022",(v("KOR",2022)/v("GHA",2022)).toFixed(2))'
```

Notes for the checker:

- Robustness: with PWT 11.0 (data/pwt-gdp-per-capita.csv, rgdpe_per_capita) only 54 countries other than the US have both 1950 and 2022; 18 of them fell further behind the US. Same direction, smaller share, very different sample (PWT's 1950 coverage is mostly richer and Latin American countries). The README claim is about Maddison only.
- Maddison's 1950 estimates for many poor countries (notably in Africa and the Middle East, e.g. Oman, Liberia) are rough; some of the 63 may be sensitive to that. Liberia (20.7% of US in 1950 to 1.4%) and Venezuela (55.5% to 9.0%) are the largest falls.
- The licence's attribution clause asks for citing the original papers when the data is charted; the package therefore ships no view/chart. PACK.md uses no image.
