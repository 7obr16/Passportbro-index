-- Seed: Additional European countries for Passport App (with manual dating scores)
-- Run this in Supabase SQL editor after the main Countries table exists.
-- Dating: Hard=35, Improbable=15, Normal=52. If your table has no UNIQUE(slug), remove ON CONFLICT clause.

INSERT INTO "Countries" (
  slug, name, region, flag_emoji, dating_ease, dating_ease_score,
  reddit_pros, reddit_cons, avg_height_male, avg_height_female,
  gdp_per_capita, majority_religion, image_url, women_image_url
) VALUES
  ('portugal', 'Portugal', 'Europe', '🇵🇹', 'Hard', 35, '', '', '174', '161', '27500', 'Christianity', '', NULL),
  ('netherlands', 'Netherlands', 'Europe', '🇳🇱', 'Improbable', 15, '', '', '184', '170', '58000', 'Non-religious', '', NULL),
  ('belgium', 'Belgium', 'Europe', '🇧🇪', 'Improbable', 15, '', '', '182', '168', '52000', 'Christianity', '', NULL),
  ('austria', 'Austria', 'Europe', '🇦🇹', 'Improbable', 15, '', '', '179', '166', '55000', 'Christianity', '', NULL),
  ('switzerland', 'Switzerland', 'Europe', '🇨🇭', 'Improbable', 15, '', '', '179', '164', '92000', 'Christianity', '', NULL),
  ('norway', 'Norway', 'Europe', '🇳🇴', 'Improbable', 15, '', '', '182', '168', '89000', 'Christianity', '', NULL),
  ('denmark', 'Denmark', 'Europe', '🇩🇰', 'Improbable', 15, '', '', '182', '169', '68000', 'Christianity', '', NULL),
  ('finland', 'Finland', 'Europe', '🇫🇮', 'Improbable', 15, '', '', '180', '166', '54000', 'Christianity', '', NULL),
  ('ireland', 'Ireland', 'Europe', '🇮🇪', 'Improbable', 15, '', '', '179', '164', '85000', 'Christianity', '', NULL),
  ('greece', 'Greece', 'Europe', '🇬🇷', 'Hard', 35, '', '', '178', '165', '23000', 'Christianity', '', NULL),
  ('czech-republic', 'Czech Republic', 'Europe', '🇨🇿', 'Hard', 35, '', '', '181', '168', '28000', 'Non-religious', '', NULL),
  ('hungary', 'Hungary', 'Europe', '🇭🇺', 'Hard', 35, '', '', '176', '164', '21000', 'Christianity', '', NULL),
  ('croatia', 'Croatia', 'Europe', '🇭🇷', 'Hard', 35, '', '', '181', '167', '19000', 'Christianity', '', NULL),
  ('serbia', 'Serbia', 'Europe', '🇷🇸', 'Hard', 35, '', '', '182', '168', '10000', 'Christianity', '', NULL),
  ('bulgaria', 'Bulgaria', 'Europe', '🇧🇬', 'Hard', 35, '', '', '178', '165', '14000', 'Christianity', '', NULL),
  ('slovakia', 'Slovakia', 'Europe', '🇸🇰', 'Hard', 35, '', '', '181', '167', '23000', 'Christianity', '', NULL),
  ('lithuania', 'Lithuania', 'Europe', '🇱🇹', 'Hard', 35, '', '', '181', '168', '26000', 'Christianity', '', NULL),
  ('latvia', 'Latvia', 'Europe', '🇱🇻', 'Hard', 35, '', '', '181', '169', '22000', 'Christianity', '', NULL),
  ('estonia', 'Estonia', 'Europe', '🇪🇪', 'Hard', 35, '', '', '182', '168', '31000', 'Non-religious', '', NULL),
  ('slovenia', 'Slovenia', 'Europe', '🇸🇮', 'Hard', 35, '', '', '181', '167', '32000', 'Christianity', '', NULL),
  ('luxembourg', 'Luxembourg', 'Europe', '🇱🇺', 'Improbable', 15, '', '', '180', '166', '128000', 'Christianity', '', NULL),
  ('malta', 'Malta', 'Europe', '🇲🇹', 'Improbable', 15, '', '', '175', '163', '35000', 'Christianity', '', NULL),
  ('cyprus', 'Cyprus', 'Europe', '🇨🇾', 'Hard', 35, '', '', '178', '165', '35000', 'Christianity', '', NULL),
  ('iceland', 'Iceland', 'Europe', '🇮🇸', 'Improbable', 15, '', '', '181', '168', '73000', 'Christianity', '', NULL),
  ('montenegro', 'Montenegro', 'Europe', '🇲🇪', 'Hard', 35, '', '', '183', '170', '11000', 'Christianity', '', NULL),
  ('north-macedonia', 'North Macedonia', 'Europe', '🇲🇰', 'Normal', 52, '', '', '176', '163', '7000', 'Christianity', '', NULL),
  ('albania', 'Albania', 'Europe', '🇦🇱', 'Hard', 35, '', '', '176', '164', '7000', 'Islam', '', NULL),
  ('bosnia-and-herzegovina', 'Bosnia and Herzegovina', 'Europe', '🇧🇦', 'Normal', 52, '', '', '182', '167', '7500', 'Islam', '', NULL),
  ('moldova', 'Moldova', 'Europe', '🇲🇩', 'Normal', 52, '', '', '175', '162', '6000', 'Christianity', '', NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  region = EXCLUDED.region,
  flag_emoji = EXCLUDED.flag_emoji,
  dating_ease = EXCLUDED.dating_ease,
  dating_ease_score = EXCLUDED.dating_ease_score,
  reddit_pros = EXCLUDED.reddit_pros,
  reddit_cons = EXCLUDED.reddit_cons,
  avg_height_male = EXCLUDED.avg_height_male,
  avg_height_female = EXCLUDED.avg_height_female,
  gdp_per_capita = EXCLUDED.gdp_per_capita,
  majority_religion = EXCLUDED.majority_religion;
