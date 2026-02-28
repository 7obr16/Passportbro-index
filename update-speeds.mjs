import fs from 'fs';
import { COUNTRY_FILTER_DATA } from './lib/countryFilterData.ts';

const speedData = `1	-	Singapore	416.10
2	-	United Arab Emirates	397.41
3	-	France	348.02
4	+1	Hong Kong (SAR)	347.44
5	+1	Iceland	347.13
6	-2	Chile	337.86
7	-	Macau (SAR)	315.05
8	-	United States	306.15
9	+1	Switzerland	286.59
10	-1	Vietnam	284.99
11	-	Israel	281.40
12	+1	Denmark	281.31
13	+3	Canada	274.35
14	-	Spain	274.21
15	-3	Thailand	272.99
16	-1	Romania	268.82
17	-	Taiwan	268.59
18	-	Peru	256.52
19	+4	Japan	248.85
20	+2	South Korea	247.37
21	-1	Portugal	245.44
22	-1	Hungary	243.90
23	+1	Netherlands	235.59
24	+1	Kuwait	226.19
25	+1	Brazil	222.30
26	+1	China	216.96
27	+6	Panama	214.96
28	-	Poland	214.57
29	+2	Colombia	208.11
30	+2	Luxembourg	207.62
31	-2	New Zealand	205.80
32	-2	Lithuania	205.60
33	+3	Malta	204.80
34	+3	Ireland	203.98
35	-	Sweden	203.36
36	-2	Jordan	197.27
37	+1	Qatar	194.16
38	+1	Uruguay	184.18
39	+1	Norway	174.35
40	+3	Finland	171.02
41	+4	United Kingdom	166.28
42	+2	Malaysia	165.48
43	+3	Costa Rica	161.77
44	+3	Saudi Arabia	160.79
45	+8	Slovenia	159.52
46	-5	Australia	158.62
47	-5	Moldova	157.57
48	+1	Ecuador	156.53
49	+1	Cyprus	155.71
50	-2	Trinidad and Tobago	151.41
51	+1	Bahrain	141.01
52	-1	Belgium	139.10
53	+4	Croatia	132.79
54	+2	Latvia	132.48
55	-1	Montenegro	131.02
56	+2	Austria	116.76
57	+4	Paraguay	114.54
58	+2	Italy	113.34
59	-	Argentina	113.33
60	+2	El Salvador	106.33
61	+2	Philippines	103.91
62	+4	Germany	102.67
63	+1	Serbia	100.94
64	+3	Slovakia	100.34
65	+3	Venezuela	96.60
66	+4	Nicaragua	94.42
67	+2	Estonia	94.36
68	+3	Oman	94.21
69	+5	Albania	93.33
70	+3	Mexico	93.19
71	+5	Grenada	93.03
72	+6	Greece	92.79
73	+7	Guatemala	92.66
74	+10	Bulgaria	92.12
75	+8	Uzbekistan	91.79
76	+1	Egypt	91.62
77	+5	Ukraine	91.38
78	+1	Russia	91.34
79	+2	Belarus	90.91
80	+5	Czechia	89.97
81	+5	Azerbaijan	89.88
82	+5	Saint Kitts and Nevis	89.34
83	+7	Honduras	89.22
84	-9	Jamaica	88.77
85	+3	Kosovo	87.59
86	+5	Kazakhstan	87.17
87	+2	Brunei	87.11
88	+4	Kyrgyzstan	85.41
89	+4	Nepal	84.38
90	+6	Armenia	81.21
91	+3	The Bahamas	81.20
92	+3	Mongolia	81.13
93	+4	Palestine	79.44
94	+5	Türkiye	75.34
95	+3	Dominican Republic	73.07
96	+4	Bangladesh	64.37
97	+4	Bolivia	62.99
98	+4	India	61.67
99	+4	Côte d'Ivoire	59.45
100	+4	Mauritius	57.32
101	+4	Morocco	55.71
102	+4	Mauritania	55.45
103	+6	Algeria	55.13
104	+6	Laos	55.02
105	+2	North Macedonia	54.21
106	+5	Haiti	53.51
107	+1	Ghana	52.92
108	+5	Cambodia	50.88
109	+3	Belize	49.86
110	+4	Burkina Faso	49.53
111	+4	South Africa	48.39
112	+4	DR Congo	45.49
113	+8	Botswana	44.84
114	+4	Indonesia	44.62
115	+2	Georgia	44.45
116	+4	Iraq	44.22
117	+2	Antigua and Barbuda	43.92
118	+4	Rwanda	41.98
119	+6	Mozambique	41.77
120	+4	Tajikistan	39.59
121	+2	Cape Verde	38.55
122	-	Zambia	37.49
123	-	Sierra Leone	37.39
124	+3	Bosnia and Herzegovina	37.10
125	+4	Nigeria	35.93
126	+5	Sri Lanka	35.79
127	+1	Togo	35.64
128	-2	Gabon	35.57
129	+1	Zimbabwe	32.45
130	+2	Myanmar (Burma)	30.29
131	+2	Madagascar	30.02
132	+2	Uganda	28.66
133	+2	Benin	28.60
134	+2	Angola	23.48
135	-	Mali	23.26
136	+2	Tanzania	22.11
137	-	Iran	22.05
138	+1	Senegal	20.67
139	+3	Maldives	20.30
140	+3	Lebanon	19.83
141	+4	Tunisia	19.19
142	+4	Somalia	18.61
143	-3	Yemen	18.57
144	-	Djibouti	18.17
145	+2	Pakistan	18.06
146	+2	Namibia	16.19
147	+2	Kenya	15.92
148	+2	Cameroon	14.79
149	+4	Libya	10.96
150	+4	Afghanistan	4.79
151	+4	Syria	4.03
152	+4	Cuba	3.85`;

const speedMap = new Map();
speedData.split('\\n').forEach(line => {
  const parts = line.split('\\t');
  if (parts.length >= 3) {
    const country = parts[2].toLowerCase().replace(/ /g, '-').replace('united-states', 'usa').replace('united-kingdom', 'uk');
    const speed = parseFloat(parts[3]);
    speedMap.set(country, speed);
  }
});

Object.keys(COUNTRY_FILTER_DATA).forEach(slug => {
  let mappedSlug = slug;
  if (slug === 'dominican-republic') mappedSlug = 'dominican-republic';
  if (slug === 'south-africa') mappedSlug = 'south-africa';
  
  if (speedMap.has(mappedSlug)) {
    COUNTRY_FILTER_DATA[slug].internetMbps = speedMap.get(mappedSlug);
  } else {
    // try exact match by name without hyphens mapped
    for (const [key, val] of speedMap.entries()) {
      if (key === slug) {
         COUNTRY_FILTER_DATA[slug].internetMbps = val;
      }
    }
  }
});

let output = 'export type CountryFilterMeta = {\n' +
  '  receptiveness: string;\n' +
  '  localValues: string;\n' +
  '  englishProficiency: string;\n' +
  '  budgetTier: string;\n' +
  '  visaEase: string;\n' +
  '  internetSpeed: string;\n' +
  '  internetMbps?: number;\n' +
  '  climate: string;\n' +
  '  vibe: string[];\n' +
  '  safetyLevel: string;\n' +
  '  healthcareQuality: string;\n' +
  '};\n\n' +
  'export const DEFAULT_COUNTRY_FILTER_META: CountryFilterMeta = {\n' +
  '  receptiveness: "Medium",\n' +
  '  localValues: "Mixed",\n' +
  '  englishProficiency: "Moderate",\n' +
  '  budgetTier: "$1k-$2k",\n' +
  '  visaEase: "Visa-Free",\n' +
  '  internetSpeed: "Moderate",\n' +
  '  climate: "Temperate",\n' +
  '  vibe: [],\n' +
  '  safetyLevel: "Moderate",\n' +
  '  healthcareQuality: "Moderate",\n' +
  '};\n\n' +
  'export const COUNTRY_FILTER_DATA: Record<string, CountryFilterMeta> = ' + JSON.stringify(COUNTRY_FILTER_DATA, null, 2) + ';\n';

fs.writeFileSync('lib/countryFilterData.ts', output);
console.log('Done mapping speeds');
