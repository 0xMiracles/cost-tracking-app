-- Создание таблиц для приложения учёта расходов
-- Выполните этот скрипт в вашей базе данных (Neon / Postgres) один раз.
--
-- Setup script for the expense tracking app.
-- Run this once in your Postgres database (e.g. Neon).

CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(12, 2) NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  spent_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Стартовые категории / Default categories
INSERT INTO categories (name) VALUES
  ('Продукты'),
  ('Кафе и рестораны'),
  ('Транспорт'),
  ('Жильё и коммуналка'),
  ('Здоровье'),
  ('Развлечения'),
  ('Одежда'),
  ('Подписки'),
  ('Другое')
ON CONFLICT (name) DO NOTHING;
