-- Run this in the Supabase SQL Editor to add the women_image_url column
ALTER TABLE "Countries" ADD COLUMN IF NOT EXISTS women_image_url text not null default '';
