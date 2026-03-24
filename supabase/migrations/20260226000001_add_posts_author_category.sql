-- Migration: Add author and category columns to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author VARCHAR(255);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category VARCHAR(255);
