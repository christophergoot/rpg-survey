-- RPG Survey Application Database Schema
-- Migration 003: Update theme question to multi_choice

-- Change theme question from single_choice to multi_choice
UPDATE survey_questions
SET question_type = 'multi_choice'
WHERE question_key = 'theme';
