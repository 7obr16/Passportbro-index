import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { parse } from "csv-parse/sync";
import fs from "fs";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const csvData = `Country,Map Score (Ease of Dating),Reddit Consensus: Pros,Reddit Consensus: Cons,Avg Height (M / F),Avg Income (GDP per Capita),Majority Religion
Philippines,Very Easy (Dark Green),"""Wife factory."" Sweet, submissive, traditional, and treat foreigners like kings. English is widely spoken, making it perfect for beginners.","Dirty cities (Manila), horrible traffic, and low-tier food compared to neighbors. Some women play the long game for money.",163 cm / 150 cm,"~$3,500",Catholic
Thailand,Very Easy (Dark Green),"Easy lifestyle, amazing food, very safe (9/10), and women love having fun and going home with you.","Oversaturated. Thais are very used to foreigners, and there is a high number of ""professional girlfriends."" Transactional dating is common.",170 cm / 159 cm,"~$7,000",Buddhist
Indonesia,Very Easy (Dark Green),"S-Tier if you get out of the tourist traps (Bali). Great for long-term if you find a traditional, family-oriented woman.",Strict Muslim culture in many parts; public displays of affection are frowned upon. Serious relationships often require tough family/religious decisions.,163 cm / 152 cm,"~$4,300",Muslim
Malaysia,Very Easy (Dark Green),Women are open to chatting with foreigners. Penang is highly rated. Great mix of modern infrastructure and traditional values.,"Religious laws are strict for locals. Many women are covered up, which might not appeal to everyone.",168 cm / 156 cm,"~$11,000",Muslim
Vietnam,Very Easy (Dark Green),"Extremely safe (virtually no violent crime against tourists), cheap, and women are naturally pretty without heavy cosmetics.","Some find the culture boring or ""third-rate."" Saigon is unwalkable. Can be scammy if you aren't careful.",164 cm / 153 cm,"~$4,100",Folk / None
Cambodia,Very Easy (Dark Green),"Very easy to get approached at bars by local women, even upper-middle-class ones. Cheap cost of living.",Offers nothing that Thailand doesn't already do better. Infrastructure is lacking compared to its neighbors.,163 cm / 152 cm,"~$1,700",Buddhist
Kenya,Very Easy (Dark Green),Absolute gold mine. Women will treat you like a king. Traditional but know how to initiate scenarios so you don't get rejected.,Developing infrastructure. Requires adapting to a completely different pace of life.,170 cm / 159 cm,"~$2,000",Christian
Nigeria,Very Easy (Dark Green),Recommended for beginners looking for high energy and women who are direct and open to foreigners.,"Severe safety concerns, high crime rates in certain areas, and internet scammers.",170 cm / 158 cm,"~$2,100",Muslim / Christian
Uganda,Very Easy (Dark Green),Very easy dating market; women genuinely like foreigners and are highly approachable.,Infrastructure is very poor. You have to be comfortable roughing it in certain areas.,167 cm / 157 cm,"~$1,000",Christian
Rwanda,Very Easy (Dark Green),"Hidden gem. Known for breathtakingly beautiful, tall, and elegant women.","Smaller expat community, so you will stand out heavily.",166 cm / 158 cm,"~$1,000",Christian
Tanzania,Very Easy (Dark Green),"Exotic, incredible nature, and very welcoming to foreigners.",Language barrier can be an issue outside of major tourist hubs.,167 cm / 156 cm,"~$1,100",Christian / Muslim
Ethiopia,Very Easy (Dark Green),Some of the most uniquely beautiful women on the continent. Rich culture.,Political instability and conflict in certain regions make it risky.,168 cm / 157 cm,"~$1,000",Christian (Orthodox)
Bolivia,Very Easy (Dark Green),Extremely traditional and very cheap.,"High altitude, lack of English speakers, and less modern amenities.",160 cm / 148 cm,"~$3,400",Catholic
Colombia,Easy (Light Green),"Top-tier beauty, amazing partying, cheap, and women are highly feminine.",Highly dangerous. High risk of getting drugged (scopolamine) or robbed. Many women are gold diggers targeting foreigners.,171 cm / 158 cm,"~$6,100",Catholic
Mexico,Easy (Light Green),"Great food, easy flights from the US, friendly Latinas, and lots to do.",Cartel violence in certain states. Tourist areas are becoming as expensive as the US.,170 cm / 157 cm,"~$10,000",Catholic
Peru,Easy (Light Green),"Sweet women, amazing food, easy mode, and cheap Airbnbs. A true hidden gem.","According to Reddit, the women are not considered the ""hottest"" in Latin America compared to Colombia/Brazil.",165 cm / 153 cm,"~$6,600",Catholic
Venezuela,Easy (Light Green),"Historically known for pageant-winning, stunning women.",Complete economic collapse. Highly dangerous to travel to right now.,173 cm / 160 cm,"~$3,000",Catholic
Dominican Republic,Easy (Light Green),"Incredible party scene, great beaches, and easy to hook up.",Highly saturated with sex tourism (Sosua). Better to stick to Santo Domingo for genuine dating.,170 cm / 156 cm,"~$8,500",Catholic
Costa Rica,Easy (Light Green),"Safe vibe, beautiful nature, and many people speak English.",Very expensive compared to the rest of LATAM. Dating scene is heavily skewed by pay-for-play in places like Jaco.,171 cm / 158 cm,"~$13,000",Catholic
India,Easy (Light Green),Insanely easy if you are a tall white man; women will literally ask for photos with you.,"Dirty, chaotic, and conservative parents will almost always block a serious marriage to a foreigner.",165 cm / 152 cm,"~$2,200",Hindu
Pakistan,Easy (Light Green),Underrated beauty.,"F-Tier for Westerners. Extreme religious laws, and women will not date non-Muslims.",167 cm / 154 cm,"~$1,500",Muslim
Morocco,Easy (Light Green),Gorgeous women with a mix of Arab/European features. Great food.,Scammers on dating apps. Strong Muslim culture means hookups are harder to navigate safely.,170 cm / 158 cm,"~$3,500",Muslim
Brazil,Normal (Yellow),The absolute best for partying and vibes. Exotic women who love to live life.,High crime. Many women actually prefer local men and aren't specifically looking for white/foreign guys.,173 cm / 160 cm,"~$8,900",Catholic
Argentina,Normal (Yellow),"Tinder is bad, but nightlife is wide open. Beautiful women and currently very cheap due to currency exchange.",Economic instability. Women are beautiful but can be slightly more arrogant than other Latinas.,174 cm / 161 cm,"~$10,500",Catholic
Chile,Normal (Yellow),Safest country in South America. Good infrastructure.,"Colder culture, women are less approachable than in Brazil or Colombia.",171 cm / 159 cm,"~$15,000",Catholic
China,Normal (Yellow),"Good outside Tier 1 cities. If you teach or work there, you can do well.","""Legendary difficulty"" for marriage due to extreme bride prices (car/house required). Materialistic.",172 cm / 160 cm,"~$12,500",None / Folk
Mongolia,Normal (Yellow),"Untapped market, unique culture.","Extreme cold, very isolated, and a massive language barrier.",168 cm / 156 cm,"~$4,500",Buddhist
South Africa,Normal (Yellow),Cape Town has some of the best nightlife in the world.,Extreme violent crime. Murder capital. You must stay in very specific safe zones.,169 cm / 158 cm,"~$6,000",Christian
Russia,Hard (Orange),"Stunningly beautiful, traditional women who take care of their appearance.",Currently a warzone. Highly anti-American sentiment. Traditional women expect you to fully provide.,176 cm / 164 cm,"~$12,000",Orthodox
Ukraine,Hard (Orange),"Historically a top spot for beautiful, feminine women.",Brutal warzone right now. Many women have fled to the EU or Asia. Highly unsafe.,178 cm / 165 cm,"~$4,500",Orthodox
Poland,Hard (Orange),Beautiful women.,"The scene is ""cooked."" Women are highly Westernized, entitled, and act just like American women now.",178 cm / 165 cm,"~$18,000",Catholic
Romania,Hard (Orange),Top choice in Eastern Europe. Latin language base makes it easier. Large economic gap helps foreigners.,Developing economy means infrastructure isn't perfect.,177 cm / 163 cm,"~$15,000",Orthodox
Turkey,Hard (Orange),"Statistically high promiscuity, beautiful women, amazing food.",Local men are fiercely possessive. Women are often loyal to their religion/nationality.,176 cm / 162 cm,"~$10,500",Muslim
Kazakhstan,Hard (Orange),Exotic mix of Asian and European features.,"Very cold, hard language barrier, and mostly off the radar for casual travel.",171 cm / 159 cm,"~$11,000",Muslim
Algeria,Hard (Orange),Beautiful North African women.,Strict Islamic culture makes dating extremely difficult for a non-Muslim foreigner.,170 cm / 159 cm,"~$3,500",Muslim
Libya,Hard (Orange),N/A,"Active conflict zones, highly dangerous, no dating infrastructure.",171 cm / 159 cm,"~$6,000",Muslim
USA,Improbable (Red),Easy to navigate if you're from there.,"Entitled, feminist culture. The exact reason the Passport Bro movement exists.",176 cm / 162 cm,"~$70,000",Christian
Canada,Improbable (Red),Diverse cities like Toronto and Montreal.,"Extremely expensive, hyper-liberal dating culture similar to the US.",176 cm / 163 cm,"~$52,000",Christian
Australia,Improbable (Red),Beautiful beaches and people.,"Trash tier for PPB. Expensive, feminist, and women are highly Westernized.",178 cm / 164 cm,"~$60,000",Christian / None
UK,Improbable (Red),"English speaking, diverse in London.","""No luck."" Terrible weather, expensive, and women have the same attitudes as in the US.",177 cm / 163 cm,"~$45,000",Christian / None
France,Improbable (Red),Good if you like North African/Asian immigrants in Paris.,"Local women are stuck in ""lala land."" They will ignore you if you act too alpha.",177 cm / 163 cm,"~$43,000",Catholic / None
Germany,Improbable (Red),Strong economy.,Cold culture. Not a destination for romance or easy dating.,178 cm / 165 cm,"~$48,000",Christian / None
Spain,Improbable (Red),Best food and lifestyle in Europe.,Women will ignore you even if you are handsome and well-dressed. Weird dating dynamic.,176 cm / 162 cm,"~$30,000",Catholic
Italy,Improbable (Red),Beautiful architecture.,Very traditional local families make casual dating as an outsider difficult.,175 cm / 161 cm,"~$34,000",Catholic
Sweden,Improbable (Red),"Sweet, beautiful girls.",Highly feminist society. Cold approach is heavily frowned upon.,180 cm / 166 cm,"~$56,000",None / Christian
Japan,Improbable (Red),"Very safe, clean, and incredible lifestyle.","Hard to date seriously. Women who like foreigners are often ""gaijin hunters"" with high body counts.",172 cm / 158 cm,"~$39,000",Shinto / Buddhist
South Korea,Improbable (Red),"Safe, good nightlife.","Bizarre beauty standards (plastic surgery), materialistic, racist, and quick to anger.",174 cm / 161 cm,"~$32,000",None / Christian
Saudi Arabia,Improbable (Red),High wealth.,Strict Sharia law. Dating is basically illegal.,170 cm / 156 cm,"~$23,000",Muslim
Egypt,Improbable (Red),Historical sights.,"Scammy, hectic, and conservative Muslim culture blocks dating.",170 cm / 158 cm,"~$3,600",Muslim
Iran,Improbable (Red),Iranian women are famously gorgeous.,Extremely dangerous for Westerners. Severe religious policing.,173 cm / 160 cm,"~$4,000",Muslim`;

const MAP_NAME_TO_SLUG = {
  "Philippines": "philippines", "Thailand": "thailand", "Indonesia": "indonesia", "Malaysia": "malaysia",
  "Vietnam": "vietnam", "Cambodia": "cambodia", "Kenya": "kenya", "Nigeria": "nigeria",
  "Uganda": "uganda", "Rwanda": "rwanda", "Tanzania": "tanzania", "Ethiopia": "ethiopia",
  "Bolivia": "bolivia", "Colombia": "colombia", "Mexico": "mexico", "Peru": "peru",
  "Venezuela": "venezuela", "Dominican Republic": "dominican-republic", "Costa Rica": "costa-rica",
  "India": "india", "Pakistan": "pakistan", "Morocco": "morocco", "Brazil": "brazil",
  "Argentina": "argentina", "Chile": "chile", "China": "china", "Mongolia": "mongolia",
  "South Africa": "south-africa", "Russia": "russia", "Ukraine": "ukraine", "Poland": "poland",
  "Romania": "romania", "Turkey": "turkey", "Kazakhstan": "kazakhstan", "Algeria": "algeria",
  "Libya": "libya", "USA": "usa", "Canada": "canada", "Australia": "australia", "UK": "uk",
  "France": "france", "Germany": "germany", "Spain": "spain", "Italy": "italy", "Sweden": "sweden",
  "Japan": "japan", "South Korea": "south-korea", "Saudi Arabia": "saudi-arabia", "Egypt": "egypt",
  "Iran": "iran"
};

const MAP_TIER = {
  "Very Easy (Dark Green)": "Very Easy",
  "Easy (Light Green)": "Easy",
  "Normal (Yellow)": "Normal",
  "Hard (Orange)": "Hard",
  "Improbable (Red)": "Improbable",
};

const TIER_SCORES = {
  "Very Easy": 95,
  "Easy": 80,
  "Normal": 65,
  "Hard": 45,
  "Improbable": 25
};

async function run() {
  const records = parse(csvData, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    const slug = MAP_NAME_TO_SLUG[row["Country"]];
    if (!slug) {
      console.log("No slug found for", row["Country"]);
      continue;
    }

    let dating_ease = MAP_TIER[row["Map Score (Ease of Dating)"]];
    if (!dating_ease) dating_ease = "Normal";

    const [maleH, femaleH] = (row["Avg Height (M / F)"] || "").split("/").map(s => s.trim());

    // UPDATE DB FOR CORE FIELDS
    const dbObj = {
      dating_ease,
      reddit_pros: row["Reddit Consensus: Pros"],
      reddit_cons: row["Reddit Consensus: Cons"],
      avg_height_male: maleH || "",
      avg_height_female: femaleH || "",
      gdp_per_capita: row["Avg Income (GDP per Capita)"],
      majority_religion: row["Majority Religion"],
    };
    
    // Check if country exists in DB
    const { data: existing } = await supabase.from("Countries").select("dating_ease_score").eq("slug", slug).single();
    if (!existing || !existing.dating_ease_score) {
        dbObj.dating_ease_score = TIER_SCORES[dating_ease];
    }

    const { error } = await supabase.from("Countries").update(dbObj).eq("slug", slug);
    if (error) {
      console.error("Error updating DB for", slug, error.message);
    }
  }
  
  console.log("Database update with English data complete!");
}
run();