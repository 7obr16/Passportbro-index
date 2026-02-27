import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { parse } from "csv-parse/sync";
import fs from "fs";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const csvData = `Land,PPB Score,Map Rating,Budget/Monat,Englisch,Werte,Sicherheit,Vibe,Reddit Pro-Konsens,Reddit Contra-Konsens
Philippinen,9.5,Sehr Leicht (Dunkelgrün),$1k - $2k,Hoch,Traditionell,Moderat,Strand / Natur,"S+ Tier. Enorme Quantität an Frauen, sehr feminin und fürsorglich. ""Wife Factory"", besonders in der Provinz (z.B. Butuan).","Manila/BGC ist übersättigt und teurer geworden. Hohes Risiko für Betrug, Ladyboys und verheiratete Frauen (Scheidung ist dort illegal!)."
Thailand,8.5,Sehr Leicht (Dunkelgrün),$1k - $2k,Moderat,Gemischt,Sehr Sicher,Nightlife / Strand,"Fantastisches Essen, extrem sicher, Top-Infrastruktur. Dating ist sehr einfach und macht Spaß.","Stark übersättigt (""Gold Rush"" verblasst). Sehr viele ""Professionelle"" und P2P-Dynamiken (Pay-to-Play), selbst außerhalb von Bars."
Kenia,9.0,Sehr Leicht (Dunkelgrün),<$1k,Hoch,Traditionell,Moderat,Natur / Safari,"Extrem hohe Match-Raten, sehr traditionelle und freundliche Frauen, die Englisch sprechen.","Infrastruktur ist ausbaufähig. Armut ist sichtbar, was Dating manchmal asymmetrisch wirken lässt."
Argentinien,8.5,Möglich (Gelb),$1k - $2k,Moderat,Gemischt,Sicher,Nightlife / City,"Aktuell eine absolute ""Goldmine"". Wunderschöne Frauen (europäische Genetik), sehr günstig, offene Kultur.","Spanisch ist absolute Pflicht. Starker lokaler Akzent, der schwer zu verstehen ist."
Peru,8.0,Leicht (Hellgrün),$1k - $2k,Niedrig,Traditionell,Sicher,Natur / City,"Lima (Miraflores) ist ein Hidden Gem. Tolles Essen, sehr sichere Touristenzonen.","Frauen gelten auf Reddit oft als ""weniger heiß"" im Vergleich zu Kolumbien/Brasilien."
Malaysia,8.5,Sehr Leicht (Dunkelgrün),$2k - $3k,Hoch,Traditionell,Sehr Sicher,City / Natur,"Bessere Alternative zu Thailand. Ethnisch chinesische Frauen dort mögen westliche Männer, exzellentes Englisch.",Sehr teuer im Vergleich zu Nachbarn. Strikte muslimische Gesetze für Locals.
Vietnam,8.0,Sehr Leicht (Dunkelgrün),$1k - $2k,Niedrig,Traditionell,Sehr Sicher,City / Natur,"Geringe Scheidungsrate, Frauen sind sehr auf Heirat aus und natürlich schön.","Einige PPBs berichten von zunehmenden ""Scams"" (z.B. plötzliche Forderungen nach Motorrad-Reparaturen)."
Indonesien,8.0,Sehr Leicht (Dunkelgrün),$1k - $2k,Moderat,Traditionell,Sicher,Strand / Natur,"Gigantische Auswahl, sehr feminine Frauen. Tolle Natur (Bali, Lombok).",Stark muslimisch geprägt. Einige Locals berichten von hohem Flake-Verhalten und Untreue bei Dates.
Kolumbien,6.5,Leicht (Hellgrün),$1k - $2k,Niedrig,Gemischt,Gefährlich,Nightlife,"Top-Tier Schönheit, extrem gutes Partyleben.","Extrem gefährlich. Tödliche Scopolamin-Fälle, Sicarios (Kartell-Auftragskiller), extrem transaktionales Dating in Medellin (""Cooked"")."
Brasilien,7.0,Möglich (Gelb),$1k - $2k,Niedrig,Modern,Gefährlich,Strand / Party,"Beste Party-Vibes der Welt, wunderschöne und sehr direkte Frauen.",Sehr gefährlich. Oft rassistisch gegenüber schwarzen/indischen Touristen. Extrem hohe Flake-Rate und sehr promiskuitiv.
Uruguay,7.5,Möglich (Gelb),$2k - $3k,Moderat,Gemischt,Sehr Sicher,Strand / City,"Frauen sind sehr direkt und flirten proaktiv, sehr sicher für LATAM-Verhältnisse.","Hohe Flake-Rate auf Tinder, relativ teuer im Vergleich zu Nachbarn."
Dominik. Rep.,6.0,Leicht (Hellgrün),$1k - $2k,Niedrig,Gemischt,Moderat,Strand / Party,"Extrem spaßig, sehr direkte und attraktive Frauen.","Absolut übersättigt von Sex-Tourismus (""Sanky Pankys""). Reine P2P-Dynamik, schwer etwas Ernstes zu finden."
Mexiko,7.5,Leicht (Hellgrün),$2k - $3k,Moderat,Gemischt,Moderat,City / Strand,"CDMX ist ein Hub. Sehr leichte Dates, super Essen, schnelle Flüge aus den USA.",Gentrifizierung: Locals hassen digitale Nomaden zunehmend. Kartell-Gefahr und Entführungen über Dating-Apps steigen.
Bolivien,7.5,Leicht (Hellgrün),<$1k,Niedrig,Traditionell,Sicher,Natur,"Sehr authentisch, traditionell und billig.","Schwache Infrastruktur, keine Strände, extremer Fokus auf Hautfarbe (weiß = Status)."
Uganda,8.5,Sehr Leicht (Dunkelgrün),<$1k,Hoch,Traditionell,Moderat,Natur,"Frauen sind konservativ, christlich und extrem respektvoll gegenüber Ausländern.","Wenig Infrastruktur. Man muss bereit sein, sich an afrikanische Lebensstandards anzupassen."
Ruanda,8.5,Sehr Leicht (Dunkelgrün),<$1k,Moderat,Traditionell,Sehr Sicher,Natur / City,"Extrem sicher, sauber und sehr konservative Dating-Kultur.","Ziemlich langsam (""läuft auf eigener Zeit""). Wenig Nightlife vorhanden."
Angola,8.0,N/A (Grau),$1k - $2k,Niedrig,Traditionell,Moderat,City / Strand,Absolutes Hidden Gem. Verrückte Match-Raten auf Tinder (Hunderte pro Monat).,Portugiesisch ist Pflicht. Sehr wenig touristische Infrastruktur.
Südafrika,5.5,Möglich (Gelb),$1k - $2k,Hoch,Gemischt,Gefährlich,Strand / City,"Kapstadt hat geniales Nightlife und sehr liberale, offene Frauen.","Extrem gefährlich. Mordrate ist hoch, man darf nachts nie alleine herumlaufen."
China,5.0,Normal (Hellgelb),$2k - $3k,Niedrig,Traditionell,Sehr Sicher,City,Außerhalb der Tier-1-Städte gibt es viele interessierte Frauen.,"Neue Scheidungsgesetze und extreme ""Bride Prices"" (Haus + Auto nötig) machen Heirat extrem riskant."
Südkorea,2.0,Unwahrscheinlich (Rot),$2k - $3k,Moderat,Modern,Sehr Sicher,City / Nightlife,"Optisch hoch im Kurs, tolles Essen und Nightlife.","Extreme ""4B"" Radikal-Feminismus-Welle. Starker Rassismus gegen Nicht-Koreaner. Frauen sind hyper-materialistisch."
Japan,3.0,Unwahrscheinlich (Rot),$2k - $3k,Niedrig,Traditionell,Sehr Sicher,City,"Ultra sicher, toller Lebensstandard. Wer fließend Japanisch spricht, hat Chancen.","Extrem verschlossene Gesellschaft. Frauen, die Ausländer daten (""Gaijin Hunters""), haben oft Ulteriormotive."
Indien,5.0,Leicht (Hellgrün),<$1k,Hoch,Traditionell,Moderat,City,Als großer weißer Mann ist man ein absoluter Star.,Sehr chaotisch/schmutzig. Konservative Familien verbieten Ehen mit Ausländern fast immer.
Taiwan,7.5,Normal (Hellgelb),$2k - $3k,Moderat,Gemischt,Sehr Sicher,City / Natur,"Taipei ist Top-Tier. Frauen sind direkter als in Japan, extrem sicher, tolles Essen.",Gefahr durch politischen Konflikt mit China.
Singapur,4.0,Sehr Leicht (Dunkelgrün),$3k+,Hoch,Modern,Sehr Sicher,City,Englisch ist Muttersprache. Sicherste Stadt der Welt.,"Extrem teuer (1-Zimmer 1 Mio. $). Frauen sind hyper-karrierefokussiert, wollen oft keine Kinder."
Kambodscha,7.5,Sehr Leicht (Dunkelgrün),$1k - $2k,Niedrig,Traditionell,Moderat,Nightlife,"Sehr billig, Frauen gehen proaktiv auf westliche Männer zu.","Bietet eigentlich nichts, was Thailand nicht besser und sicherer macht."
Chile,6.0,Möglich (Gelb),$2k - $3k,Niedrig,Modern,Sicher,Natur / City,Sicherstes Land in LATAM. Gute Infrastruktur.,Dating-Kultur ist kälter. Frauen sind rassistisch/koloristisch veranlagt (Fokus auf weiße Haut).
Rumänien,6.0,Schwer (Orange),$1k - $2k,Moderat,Gemischt,Sicher,City / Party,Optisch Top-Frauen. Lateinische Sprache hilft beim Lernen.,Wird immer teurer. Kartell- und Scamming-Gefahren existieren im Nightlife.
Polen,4.0,Schwer (Orange),$2k - $3k,Hoch,Modern,Sicher,City,"Wunderschöne, gebildete Frauen.","Dating-Markt ist ""cooked"". Frauen sind extrem verwestlicht, arrogant und verhalten sich wie in den USA."
Ukraine,3.0,Schwer (Orange),$1k - $2k,Niedrig,Gemischt,Gefährlich,City,Traditionell bekannt für extrem schöne Frauen.,"Kriegsgebiet. Frauen, die Ausländer daten, tun dies oft extrem transaktional (""Paypigs"", wollen iPhones)."
Russland,4.0,Schwer (Orange),$2k - $3k,Niedrig,Traditionell,Moderat,City,"Traditionelle Rollenverteilung, Frauen achten sehr auf ihr Äußeres.","Sanktionen machen Logistik extrem schwer (kein Tinder, keine Visa-Karten). Frauen erwarten 100% Provider-Männer."
Spanien,5.0,Unwahrscheinlich (Rot),$2k - $3k,Moderat,Modern,Sicher,Strand / City,"Gutes Wetter, entspannter Vibe. Frauen sind offener als in Nordeuropa.",Sehr feministisch geprägt. Frauen ignorieren ausländische Männer oft komplett.
Italien,3.5,Unwahrscheinlich (Rot),$2k - $3k,Moderat,Gemischt,Sicher,City / Natur,"Romantisiertes Land, tolles Essen.","Extrem urteilende, elitäre Gesellschaft. Rassistisch gegenüber Minderheiten. Frauen sind schwer zugänglich."
Frankreich,5.0,Unwahrscheinlich (Rot),$3k+,Moderat,Modern,Moderat,City,"Paris bietet viele Optionen, besonders für schwarze und indische Männer (kein Stigma).","Teuer. Französische Frauen gelten als arrogant und spielen ""Test-Flakes"" mit Männern."
Schweden,3.0,Unwahrscheinlich (Rot),$3k+,Hoch,Modern,Sicher,Natur / City,"Egalitäre Gesellschaft: Frauen teilen die Rechnung, Initiieren Sex.","Keine ""Passport Bro"" Kultur möglich. Ohne Zugehörigkeit zum sozialen Kreis wird man komplett isoliert (""Cliquen"")."
Deutschland,4.0,Unwahrscheinlich (Rot),$2k - $3k,Hoch,Modern,Sicher,City,"Solide Wirtschaft, wenig Rassismus beim Dating in Großstädten.","Sehr kühle Kultur. Hohe Erwartungen der Frauen bei gleichzeitig wenig Eigenleistung (""Reverse Culture Shock"")."
Großbritannien,2.0,Unwahrscheinlich (Rot),$3k+,Hoch,Modern,Sicher,City / Party,Keine Sprachbarriere.,"Frauen sind verwestlicht, stark übergewichtig im Schnitt und daten am liebsten nur einheimische Männer."
Türkei,6.5,Schwer (Orange),$1k - $2k,Moderat,Traditionell,Sicher,City / Strand,"Wunderschöne Frauen, unglaubliche Gastfreundschaft. Heiraten geht einher mit ""5-Sterne-Behandlung"" zu Hause.",Lokale Männer sind extrem besitzergreifend. Frauen erwarten teuren Schmuck/Gold bei Heirat.
Dubai (VAE),2.0,Schwer (Orange),$3k+,Hoch,Modern,Sehr Sicher,City / Nightlife,"Super sicher, keine Steuern, modern.","Dating-Markt ist ""Hölle auf Erden"". 70% Männer. Tinder besteht nur aus Escorts und extrem materialistischen Frauen."
Saudi-Arabien,1.5,Unwahrscheinlich (Rot),$3k+,Moderat,Traditionell,Sehr Sicher,City,Keine.,Geschlechtertrennung. Cold Approach ist quasi illegal. Dating-Apps haben eine Ratio von 1:100.
USA,1.0,Unwahrscheinlich (Rot),$3k+,Hoch,Modern,Moderat,City / Natur,Wirtschaftsstark.,"Der Hauptgrund für die PPB-Bewegung. Toxischer Feminismus, Übergewicht, unrealistische Standards (6ft, 6-figures)."
Kanada,1.5,Unwahrscheinlich (Rot),$3k+,Hoch,Modern,Sicher,City / Natur,Diverse Städte wie Montreal und Toronto.,"Noch teurer als die USA, gleiche Dating-Kultur (Alt-Girls, Hass auf Männer)."
Australien,2.0,Unwahrscheinlich (Rot),$3k+,Hoch,Modern,Sicher,Strand / Natur,Backpacker-Szene bietet Chancen (Latina/Europa-Touristen in Hostels).,"Einheimische Frauen sind verwestlicht, teures Land, toxische ""Mate""-Trinkkultur."
Marokko,6.0,Leicht (Hellgrün),$1k - $2k,Moderat,Traditionell,Moderat,City / Strand,"Unglaublich schöne Frauen, interessanter kultureller Mix.",Hohe Scam-Gefahr auf Apps. Religion macht ernsthaftes Dating für Nicht-Muslime fast unmöglich.
Kasachstan,7.0,Schwer (Orange),$1k - $2k,Niedrig,Gemischt,Sicher,Natur / City,"Die wohl ""heißesten Asiatinnen der Welt"" (Mix aus asiatisch und slawisch).","Sehr materialistisch (wollen nach Dubai geflogen werden), extreme Sprachbarriere (Russisch nötig)."
Costa Rica,6.5,Leicht (Hellgrün),$2k - $3k,Moderat,Gemischt,Sicher,Strand / Natur,"Natur pur, sicherer als Kolumbien, Pura-Vida Lifestyle.",Das teuerste Land in LATAM. Stark von Gringos und Pay-to-Play überlaufen (Jaco).
Tansania,8.0,Sehr Leicht (Dunkelgrün),<$1k,Niedrig,Traditionell,Moderat,Natur / Strand,"Exotisch, wunderschöne Landschaften.",Englisch außerhalb der Städte schlecht.
Pakistan,3.0,Leicht (Hellgrün),<$1k,Moderat,Traditionell,Gefährlich,City,Sehr traditionelle Werte.,"Religiös extrem strikt, für westliche Nicht-Muslime unmöglich zu navigieren."
Ägypten,2.5,Unwahrscheinlich (Rot),<$1k,Niedrig,Traditionell,Moderat,City,Historisch extrem reich.,"Scam-Kultur, extrem chaotisch, Dating ist tabu."
Venezuela,5.0,Leicht (Hellgrün),<$1k,Niedrig,Traditionell,Gefährlich,Natur,Bekannt für die schönsten Latinas der Welt.,Politisch und wirtschaftlich komplett zusammengebrochen. Sicario-Gefahr sehr hoch.
Paraguay,7.5,Möglich (Gelb),$1k - $2k,Niedrig,Traditionell,Sicher,City / Natur,Absolutes Hidden Gem in Südamerika.,"Kaum Infrastruktur, kein Meerzugang."
Ecuador,7.0,Leicht (Hellgrün),$1k - $2k,Niedrig,Traditionell,Moderat,Natur / Berg,Günstig und authentisch.,Kartellgewalt hat in letzter Zeit in Großstädten zugenommen.
Mongolei,6.5,Möglich (Gelb),$1k - $2k,Niedrig,Traditionell,Sicher,Natur,"""Falken-Jägerinnen"" – exotisch und unentdeckt.","Extrem kalt, absolut keine westliche Infrastruktur."
Tschechien,4.0,Schwer (Orange),$1k - $2k,Hoch,Gemischt,Sicher,City,"Früher ein Paradies, tolle Architektur.","Von Touristen und ""Refugees"" überlaufen. Frauen sind misstrauisch gegenüber Ausländern geworden."
Ungarn,4.0,Schwer (Orange),$1k - $2k,Hoch,Gemischt,Sicher,City / Party,Budapest ist schön und (noch) günstig.,Gleiches Schicksal wie Prag. Frauen sind genervt von Touristen und Sexpats.
Bulgarien,5.0,Schwer (Orange),$1k - $2k,Moderat,Gemischt,Sicher,City / Strand,Günstigster Ort in Europa.,"Extrem materialistisch. Männer müssen Haare, Nägel und teure Club-Flaschen zahlen."
Lettland / Estland,4.5,Schwer (Orange),$1k - $2k,Hoch,Gemischt,Sicher,City,"Viele gutaussehende, blonde Frauen.","Kaltes Wetter, Dating-Markt wird durch westliche und östliche Touristenströme langsam ""cooked""."
Kuba,4.0,Möglich (Gelb),<$1k,Niedrig,Traditionell,Moderat,Strand / Party,"Wunderschöne Frauen, tolle Musik.","Wirtschaft komplett tot. Fast alle schönen Frauen sind in die Prostitution (Sanky Panky) abgerutscht, um zu überleben."
Panama,7.0,Leicht (Hellgrün),$1k - $2k,Moderat,Gemischt,Sicher,Strand / City,"Panama City hat US-Standards, gute Wirtschaft.","Weniger ""exotischer Bonus"" als in ärmeren Ländern, da die Frauen selbst Geld verdienen."
Jamaika,5.0,Leicht (Hellgrün),$1k - $2k,Hoch,Gemischt,Gefährlich,Strand,"Englischsprachig, tolle Strände.","Hub für ""Passport Sisters"" (westliche Frauen, die lokale Beach-Boys daten). Gefährlich außerhalb von Resorts."`;

const MAP_NAME_TO_SLUG = {
  "Philippinen": "philippines", "Thailand": "thailand", "Kenia": "kenya", "Argentinien": "argentina",
  "Peru": "peru", "Malaysia": "malaysia", "Vietnam": "vietnam", "Indonesien": "indonesia",
  "Kolumbien": "colombia", "Brasilien": "brazil", "Uruguay": "uruguay", "Dominik. Rep.": "dominican-republic",
  "Mexiko": "mexico", "Bolivien": "bolivia", "Uganda": "uganda", "Ruanda": "rwanda", "Angola": "angola",
  "Südafrika": "south-africa", "China": "china", "Südkorea": "south-korea", "Japan": "japan",
  "Indien": "india", "Taiwan": "taiwan", "Singapur": "singapore", "Kambodscha": "cambodia",
  "Chile": "chile", "Rumänien": "romania", "Polen": "poland", "Ukraine": "ukraine", "Russland": "russia",
  "Spanien": "spain", "Italien": "italy", "Frankreich": "france", "Schweden": "sweden", "Deutschland": "germany",
  "Großbritannien": "uk", "Türkei": "turkey", "Dubai (VAE)": "united-arab-emirates", "Saudi-Arabien": "saudi-arabia",
  "USA": "usa", "Kanada": "canada", "Australien": "australia", "Marokko": "morocco", "Kasachstan": "kazakhstan",
  "Costa Rica": "costa-rica", "Tansania": "tanzania", "Pakistan": "pakistan", "Ägypten": "egypt",
  "Venezuela": "venezuela", "Paraguay": "paraguay", "Ecuador": "ecuador", "Mongolei": "mongolia",
  "Tschechien": "czech-republic", "Ungarn": "hungary", "Bulgarien": "bulgaria", "Lettland / Estland": "estonia",
  "Kuba": "cuba", "Panama": "panama", "Jamaika": "jamaica"
};

const MAP_TIER = {
  "Sehr Leicht (Dunkelgrün)": "Very Easy",
  "Leicht (Hellgrün)": "Easy",
  "Möglich (Gelb)": "Possible",
  "Normal (Hellgelb)": "Normal",
  "Schwer (Orange)": "Hard",
  "Unwahrscheinlich (Rot)": "Improbable",
  "N/A (Grau)": "N/A",
  "Sehr Leicht (Dunkgrün)": "Very Easy", // typo in input fixing
};

const MAP_ENGLISH = { "Hoch": "High", "Moderat": "Moderate", "Niedrig": "Low" };
const MAP_VALUES = { "Traditionell": "Traditional", "Gemischt": "Mixed", "Modern": "Modern" };
const MAP_SAFETY = { "Sehr Sicher": "Very Safe", "Sicher": "Safe", "Moderat": "Moderate", "Gefährlich": "Dangerous" };

async function run() {
  const records = parse(csvData, { columns: true, skip_empty_lines: true });
  const filterData = {};

  for (const row of records) {
    const slug = MAP_NAME_TO_SLUG[row["Land"]];
    if (!slug) continue;

    const vibe = row["Vibe"].toLowerCase();
    const has_beach = vibe.includes("strand");
    const has_nature = vibe.includes("natur") || vibe.includes("safari") || vibe.includes("berg");
    const has_nightlife = vibe.includes("nightlife") || vibe.includes("party") || vibe.includes("city");

    let dating_ease = MAP_TIER[row["Map Rating"]];
    if (!dating_ease) {
        if (row["Map Rating"].includes("Leicht")) dating_ease = "Easy";
        else dating_ease = "Normal";
    }

    // UPDATE DB FOR CORE FIELDS
    const dbObj = {
      slug,
      name: row["Land"] === "Dubai (VAE)" ? "United Arab Emirates" : 
            row["Land"] === "Großbritannien" ? "United Kingdom" : 
            row["Land"] === "Lettland / Estland" ? "Estonia" : row["Land"],
      dating_ease,
      dating_ease_score: Math.round(parseFloat(row["PPB Score"]) * 10), // 9.5 -> 95
      reddit_pros: row["Reddit Pro-Konsens"],
      reddit_cons: row["Reddit Contra-Konsens"],
    };

    const { error } = await supabase.from("Countries").update(dbObj).eq("slug", slug);
    if (error) {
      console.error("Error updating DB for", slug, error.message);
    }

    // UPDATE LOCAL FILTER DATA FOR EXTENDED FIELDS (to bypass cache issues safely)
    const tier = row["Map Rating"];
    let receptiveness = "Medium";
    if (tier.includes("Sehr Leicht") || tier.includes("Leicht")) receptiveness = "High";
    if (tier.includes("Schwer") || tier.includes("Unwahrscheinlich")) receptiveness = "Low";

    filterData[slug] = {
      receptiveness,
      localValues: MAP_VALUES[row["Werte"]] || "Mixed",
      englishProficiency: MAP_ENGLISH[row["Englisch"]] || "Moderate",
      budgetTier: row["Budget/Monat"],
      visaEase: "Visa-Free", // default as it's missing in new data
      internetSpeed: "Moderate", // default
      climate: "Temperate", // default
      vibe: [has_nightlife && "Great Nightlife", has_beach && "Beach Access", has_nature && "Nature/Mountains"].filter(Boolean).join(", ") || "City",
      safetyLevel: MAP_SAFETY[row["Sicherheit"]] || "Moderate",
      healthcareQuality: "Moderate" // default
    };
  }
  
  const fileOutput = `// This file is auto-generated based on the latest dataset
export type CountryFilterMeta = {
  receptiveness: string;
  localValues: string;
  englishProficiency: string;
  budgetTier: string;
  visaEase: string;
  internetSpeed: string;
  climate: string;
  vibe: string;
  safetyLevel: string;
  healthcareQuality: string;
};

export const COUNTRY_FILTER_DATA: Record<string, CountryFilterMeta> = ${JSON.stringify(filterData, null, 2)};

export const DEFAULT_COUNTRY_FILTER_META: CountryFilterMeta = {
  receptiveness: "Medium",
  localValues: "Mixed",
  englishProficiency: "Moderate",
  budgetTier: "$1k-$2k",
  visaEase: "Visa-Free",
  internetSpeed: "Moderate",
  climate: "Temperate",
  vibe: "City",
  safetyLevel: "Moderate",
  healthcareQuality: "Moderate"
};
`;

  fs.writeFileSync("./lib/countryFilterData.ts", fileOutput);
  console.log("Data sync and local generation complete!");
}
run();