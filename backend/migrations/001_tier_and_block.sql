-- Migration 001: Add tier and is_blocked to users table
-- Run: psql -d <your_db> -f migrations/001_tier_and_block.sql

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tier VARCHAR(10) NOT NULL DEFAULT 'FREE'
  CHECK (tier IN ('FREE', 'PRO'));

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE;
