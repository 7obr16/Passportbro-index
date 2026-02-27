ALTER TABLE "Countries"
ADD COLUMN IF NOT EXISTS receptiveness text not null default 'Medium',
ADD COLUMN IF NOT EXISTS local_values text not null default 'Mixed',
ADD COLUMN IF NOT EXISTS english_proficiency text not null default 'Moderate',
ADD COLUMN IF NOT EXISTS budget_tier text not null default '$1k-$2k',
ADD COLUMN IF NOT EXISTS visa_ease text not null default 'Visa-Free',
ADD COLUMN IF NOT EXISTS internet_speed text not null default 'Moderate',
ADD COLUMN IF NOT EXISTS climate text not null default 'Temperate',
ADD COLUMN IF NOT EXISTS has_nightlife boolean not null default false,
ADD COLUMN IF NOT EXISTS has_beach boolean not null default false,
ADD COLUMN IF NOT EXISTS has_nature boolean not null default false,
ADD COLUMN IF NOT EXISTS safety_level text not null default 'Safe',
ADD COLUMN IF NOT EXISTS healthcare_quality text not null default 'Moderate';