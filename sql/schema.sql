-- Create extension in Postgres if available:
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- or use uuid_generate_v4()

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  password_hash text,
  role text NOT NULL,
  name text,
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  licence_number text,
  assigned_vehicle_id uuid
);

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text,
  model text,
  plate text UNIQUE,
  year int
);

CREATE TABLE sources (
  id serial PRIMARY KEY,
  name text UNIQUE
);

CREATE TABLE transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text,
  source_id int REFERENCES sources(id),
  pickup_time timestamptz,
  dropoff_time timestamptz,
  pickup_place text,
  dropoff_place text,
  passengers int,
  price numeric,
  status text,
  driver_id uuid REFERENCES users(id),
  pending_transfer_to uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE transfer_history (
  id serial PRIMARY KEY,
  transfer_id uuid REFERENCES transfers(id),
  old_driver_id uuid,
  new_driver_id uuid,
  action_by uuid,
  action_at timestamptz
);
