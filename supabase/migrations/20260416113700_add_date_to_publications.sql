-- Migration: Add date column to publications
-- Created at: 2024-04-16

ALTER TABLE publications ADD COLUMN IF NOT EXISTS date TIMESTAMPTZ DEFAULT now();
