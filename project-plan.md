1. Project Overview
We are building a web application similar to NomadList, but tailored for a specific expat/traveler community. The goal is to rank cities based on cost of living, safety, internet speed, and dating culture, while eventually allowing users to connect and organize meetups.

Tech Stack: Next.js (App Router), Tailwind CSS, Lucide Icons, and Supabase (for Auth & Database).

2. Phased Development Approach
Since I am a beginner learning Cursor, we will build this strictly in phases. Do not move to the next phase until the current one is complete and working.

Phase 1: The Static MVP (Directory & UI)
Goal: Build the basic UI with dummy data to get the look and feel right.

Setup: Initialize Next.js with Tailwind.

Data Structure: Create a static array of dummy cities (e.g., Bangkok, Manila, Medellin) with attributes: name, country, cost_per_month, internet_speed, safety_score, dating_score, and image_url.

Homepage: A hero section explaining the site, followed by a grid of "City Cards".

City Details Page: Clicking a card opens a dedicated page (/city/[slug]) showing detailed stats and a brief description.

Phase 2: Database Integration (Supabase)
Goal: Move from dummy data to a real database.

Setup: Connect the Next.js app to Supabase.

Database Schema: Create a cities table in Supabase.

Data Fetching: Update the Homepage and City Details page to fetch data dynamically from Supabase instead of the local static array.

Phase 3: User Authentication & Reviews
Goal: Allow users to log in and leave their own ratings for cities.

Auth: Implement Supabase Auth (Email/Password or Google OAuth).

Reviews Table: Create a database table for reviews linked to both users and cities.

Review Form: Add a section on the City Details page where logged-in users can rate a city (1-5 stars) and leave a comment.

Phase 4: Social & Meetups (The "Like-minded" Feature)
Goal: Allow users to find others in the same city.

Meetups Table: Create a database table for meetups (e.g., location, date, description, creator_id).

City Board: Add a "Meetups" tab on each City Details page where users can post things like "Grabbing drinks in Sukhumvit this Friday."

RSVP System: Allow other logged-in users to click "I'm going" on a meetup.