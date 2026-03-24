-- Add animal_name column to team_members
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS animal_name VARCHAR(255);
