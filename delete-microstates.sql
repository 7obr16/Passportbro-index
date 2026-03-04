-- ============================================================
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- Removes all microstates (<500k population) and non-sovereign
-- territories from the Countries table.
-- ============================================================

DELETE FROM "Countries"
WHERE slug IN (
  -- ── Sovereign microstates (population < 500 000) ──────────
  'andorra',
  'antigua-and-barbuda',
  'bahamas',
  'barbados',
  'belize',
  'brunei',
  'dominica',
  'grenada',
  'iceland',
  'kiribati',
  'liechtenstein',
  'marshall-islands',
  'micronesia',
  'monaco',
  'nauru',
  'niue',
  'palau',
  'saint-kitts-and-nevis',
  'saint-lucia',
  'saint-vincent-and-the-grenadines',
  'samoa',
  'san-marino',
  'sao-tome-and-principe',
  'seychelles',
  'tonga',
  'tuvalu',
  'vanuatu',
  'vatican-city',

  -- ── Non-sovereign territories (all sizes) ────────────────
  'aland-islands',
  'american-samoa',
  'anguilla',
  'antarctica',
  'aruba',
  'bermuda',
  'bouvet-island',
  'british-indian-ocean-territory',
  'british-virgin-islands',
  'caribbean-netherlands',
  'cayman-islands',
  'christmas-island',
  'cocos-keeling-islands',
  'cook-islands',
  'curacao',
  'falkland-islands',
  'faroe-islands',
  'french-guiana',
  'french-polynesia',
  'french-southern-and-antarctic-lands',
  'gibraltar',
  'greenland',
  'guadeloupe',
  'guam',
  'guernsey',
  'heard-island-and-mcdonald-islands',
  'hong-kong',
  'isle-of-man',
  'jersey',
  'macau',
  'martinique',
  'mayotte',
  'montserrat',
  'new-caledonia',
  'norfolk-island',
  'northern-mariana-islands',
  'pitcairn-islands',
  'puerto-rico',
  'reunion',
  'saint-barthelemy',
  'saint-helena-ascension-and-tristan-da-cunha',
  'saint-martin',
  'saint-pierre-and-miquelon',
  'sint-maarten',
  'south-georgia',
  'svalbard-and-jan-mayen',
  'tokelau',
  'turks-and-caicos-islands',
  'united-states-minor-outlying-islands',
  'united-states-virgin-islands',
  'wallis-and-futuna',
  'western-sahara',

  -- ── Duplicate rows (keep 'uk' and 'usa') ────────────────
  'united-kingdom',
  'united-states'
);

-- Fix German names left over from old data sync
UPDATE "Countries" SET name = 'Czech Republic' WHERE slug = 'czech-republic';
UPDATE "Countries" SET name = 'Hungary'        WHERE slug = 'hungary';
UPDATE "Countries" SET name = 'Bulgaria'       WHERE slug = 'bulgaria';
