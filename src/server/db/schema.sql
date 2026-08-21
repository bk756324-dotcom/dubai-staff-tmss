-- ============================================================================
-- Dubai Staff Transport Management System (TMS) - PostgreSQL Production DDL
-- Enterprise Relational Schema with JSONB support for complex route/stop geometry
-- ============================================================================

-- 1. SYSTEM METADATA & SCHEMA VERSIONING
CREATE TABLE IF NOT EXISTS system_meta (
  key VARCHAR(64) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS & ACCESS CONTROL (RBAC)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  phone VARCHAR(32) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'DISPATCHER', 'DRIVER', 'CLIENT')),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  avatar_url VARCHAR(255),
  department VARCHAR(128),
  company_id VARCHAR(64),
  client_id VARCHAR(64),
  driver_id VARCHAR(64),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users (company_id);

-- 3. CORPORATE CLIENT ACCOUNTS
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(64) PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(128) NOT NULL,
  trade_license_number VARCHAR(64) NOT NULL,
  contact_person VARCHAR(128) NOT NULL,
  contact_title VARCHAR(128),
  email VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  office_location TEXT NOT NULL,
  contract_start_date DATE NOT NULL,
  contract_end_date DATE NOT NULL,
  contract_value_aed NUMERIC(12, 2) DEFAULT 0.00,
  payment_terms VARCHAR(64) DEFAULT 'Net 30 Days',
  billing_cycle VARCHAR(64),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING', 'EXPIRED')),
  active_routes_count INTEGER DEFAULT 0,
  total_passengers_count INTEGER DEFAULT 0,
  assigned_vehicles_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clients_status ON clients (status);

-- 4. FLEET VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(64) PRIMARY KEY,
  vehicle_number VARCHAR(64) UNIQUE NOT NULL,
  registration_number VARCHAR(64) UNIQUE NOT NULL,
  plate_category VARCHAR(64) NOT NULL,
  vehicle_type VARCHAR(64) NOT NULL,
  make VARCHAR(64) NOT NULL,
  model VARCHAR(64) NOT NULL,
  year INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'ON_TRIP', 'MAINTENANCE', 'INACTIVE')),
  assigned_driver_id VARCHAR(64),
  assigned_driver_name VARCHAR(128),
  current_route_id VARCHAR(64),
  current_route_name VARCHAR(255),
  insurance_expiry DATE,
  registration_expiry DATE,
  rta_permit_expiry DATE,
  next_maintenance_date DATE,
  current_mileage_km NUMERIC(10, 2) DEFAULT 0,
  fuel_type VARCHAR(32) DEFAULT 'DIESEL' CHECK (fuel_type IN ('DIESEL', 'PETROL', 'EV')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles (status);
CREATE INDEX IF NOT EXISTS idx_vehicles_assigned_driver ON vehicles (assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_reg_expiry ON vehicles (registration_expiry);

-- 5. DRIVER CAPTAINS
CREATE TABLE IF NOT EXISTS drivers (
  id VARCHAR(64) PRIMARY KEY,
  employee_id VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(128),
  license_number VARCHAR(64) NOT NULL,
  license_category VARCHAR(64) NOT NULL,
  license_expiry DATE NOT NULL,
  rta_card_number VARCHAR(64) NOT NULL,
  rta_card_expiry DATE NOT NULL,
  visa_expiry DATE,
  medical_fitness_expiry DATE,
  status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'ON_LEAVE', 'INACTIVE')),
  assigned_vehicle_id VARCHAR(64),
  assigned_vehicle_number VARCHAR(64),
  assigned_route_id VARCHAR(64),
  assigned_route_name VARCHAR(255),
  joining_date DATE,
  emergency_contact JSONB,
  total_trips_completed INTEGER DEFAULT 0,
  safety_rating NUMERIC(3, 2) DEFAULT 5.00,
  rating NUMERIC(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers (status);
CREATE INDEX IF NOT EXISTS idx_drivers_license_expiry ON drivers (license_expiry);
CREATE INDEX IF NOT EXISTS idx_drivers_rta_card_expiry ON drivers (rta_card_expiry);

-- 6. TRANSPORT ROUTES & CORRIDORS
CREATE TABLE IF NOT EXISTS routes (
  id VARCHAR(64) PRIMARY KEY,
  route_name VARCHAR(255) NOT NULL,
  route_code VARCHAR(64) UNIQUE NOT NULL,
  description TEXT,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  distance_km NUMERIC(8, 2) NOT NULL,
  estimated_duration_minutes INTEGER NOT NULL,
  assigned_vehicle_id VARCHAR(64),
  assigned_vehicle_number VARCHAR(64),
  assigned_driver_id VARCHAR(64),
  assigned_driver_name VARCHAR(128),
  client_id VARCHAR(64) REFERENCES clients(id) ON DELETE SET NULL,
  client_company_name VARCHAR(255),
  shift VARCHAR(32) DEFAULT 'MORNING',
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  stops JSONB NOT NULL DEFAULT '[]'::jsonb,
  operating_days JSONB DEFAULT '["MON","TUE","WED","THU","FRI"]'::jsonb,
  morning_departure_time VARCHAR(16),
  evening_return_time VARCHAR(16),
  assigned_passenger_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_routes_status ON routes (status);
CREATE INDEX IF NOT EXISTS idx_routes_client_id ON routes (client_id);

-- 7. STAFF PASSENGERS & COMMUTERS
CREATE TABLE IF NOT EXISTS passengers (
  id VARCHAR(64) PRIMARY KEY,
  employee_id VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(128),
  client_id VARCHAR(64) REFERENCES clients(id) ON DELETE SET NULL,
  client_company_name VARCHAR(255),
  department VARCHAR(128),
  pickup_point VARCHAR(255) NOT NULL,
  pickup_time VARCHAR(32) NOT NULL,
  drop_point VARCHAR(255) NOT NULL,
  drop_time VARCHAR(32) NOT NULL,
  route_id VARCHAR(64) REFERENCES routes(id) ON DELETE SET NULL,
  route_name VARCHAR(255),
  stop_id VARCHAR(64),
  shift VARCHAR(32) DEFAULT 'MORNING',
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE')),
  rfid_card_number VARCHAR(64),
  emergency_contact VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_passengers_client_id ON passengers (client_id);
CREATE INDEX IF NOT EXISTS idx_passengers_route_id ON passengers (route_id);
CREATE INDEX IF NOT EXISTS idx_passengers_status ON passengers (status);

-- 8. SCHEDULED & DISPATCHED TRIPS
CREATE TABLE IF NOT EXISTS trips (
  id VARCHAR(64) PRIMARY KEY,
  trip_number VARCHAR(64) UNIQUE NOT NULL,
  route_id VARCHAR(64) REFERENCES routes(id) ON DELETE SET NULL,
  route_name VARCHAR(255) NOT NULL,
  client_id VARCHAR(64) REFERENCES clients(id) ON DELETE SET NULL,
  client_company_name VARCHAR(255),
  vehicle_id VARCHAR(64) REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_number VARCHAR(64) NOT NULL,
  driver_id VARCHAR(64) REFERENCES drivers(id) ON DELETE SET NULL,
  driver_name VARCHAR(128) NOT NULL,
  driver_phone VARCHAR(32) NOT NULL,
  scheduled_date VARCHAR(16) NOT NULL,
  scheduled_start_time VARCHAR(32) NOT NULL,
  scheduled_end_time VARCHAR(32) NOT NULL,
  actual_start_time VARCHAR(32),
  actual_end_time VARCHAR(32),
  status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'BOARDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DELAYED')),
  passenger_count INTEGER DEFAULT 0,
  boarded_passenger_count INTEGER DEFAULT 0,
  current_stop_index INTEGER DEFAULT 0,
  delay_minutes INTEGER DEFAULT 0,
  delay_reason TEXT,
  cancellation_reason TEXT,
  shift VARCHAR(32) DEFAULT 'MORNING',
  notes TEXT,
  passenger_manifest JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trips_date ON trips (scheduled_date);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips (status);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips (driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_client_id ON trips (client_id);
CREATE INDEX IF NOT EXISTS idx_trips_route_id ON trips (route_id);

-- 9. VEHICLE TELEMATICS & GPS TRACKING
CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(64) PRIMARY KEY,
  vehicle_id VARCHAR(64) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  vehicle_number VARCHAR(64) NOT NULL,
  driver_id VARCHAR(64),
  trip_id VARCHAR(64),
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  speed_kmh NUMERIC(6, 2) DEFAULT 0,
  heading_degrees NUMERIC(6, 2) DEFAULT 0,
  engine_status VARCHAR(16) DEFAULT 'ON' CHECK (engine_status IN ('ON', 'IDLE', 'OFF')),
  fuel_level_percent INTEGER DEFAULT 80,
  ac_status VARCHAR(16) DEFAULT 'ON' CHECK (ac_status IN ('ON', 'OFF')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated_text VARCHAR(64) DEFAULT 'Just now'
);

CREATE INDEX IF NOT EXISTS idx_locations_vehicle_id ON locations (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_locations_trip_id ON locations (trip_id);

-- 10. FLEET MAINTENANCE & WORK ORDERS
CREATE TABLE IF NOT EXISTS maintenance (
  id VARCHAR(64) PRIMARY KEY,
  vehicle_id VARCHAR(64) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  vehicle_number VARCHAR(64) NOT NULL,
  service_type VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
  date DATE NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  cost_aed NUMERIC(10, 2) DEFAULT 0,
  mileage_km NUMERIC(10, 2) NOT NULL DEFAULT 0,
  next_service_date DATE,
  next_service_mileage_km NUMERIC(10, 2),
  workshop_name VARCHAR(255) NOT NULL,
  vendor VARCHAR(255),
  technician_name VARCHAR(128),
  invoice_number VARCHAR(64),
  status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_id ON maintenance (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance (status);
CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled_date ON maintenance (date);

-- 11. REGULATORY COMPLIANCE & DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255),
  title VARCHAR(255),
  document_number VARCHAR(128) NOT NULL,
  type VARCHAR(64),
  document_type VARCHAR(64),
  owner_type VARCHAR(64),
  entity_type VARCHAR(64),
  owner_id VARCHAR(64),
  entity_id VARCHAR(64),
  owner_name VARCHAR(255),
  entity_name VARCHAR(255),
  related_entity_id VARCHAR(64),
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  issuing_authority VARCHAR(128) NOT NULL,
  file_reference VARCHAR(512),
  file_url VARCHAR(512),
  status VARCHAR(32) NOT NULL DEFAULT 'VALID' CHECK (status IN ('VALID', 'EXPIRING_SOON', 'EXPIRED', 'PENDING_RENEWAL')),
  days_remaining INTEGER,
  days_until_expiry INTEGER,
  notes TEXT,
  file_size_mb NUMERIC(8, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON documents (expiry_date);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status);

-- 12. OPERATIONAL BROADCASTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32),
  category VARCHAR(32),
  read BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
  target_role VARCHAR(64),
  action_url VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  related_entity_type VARCHAR(64),
  related_entity_id VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at DESC);

-- 13. CORPORATE INQUIRIES & QUOTE LEADS
CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  company VARCHAR(255) NOT NULL,
  email VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  industry VARCHAR(128),
  required_vehicles_count INTEGER DEFAULT 1,
  estimated_passengers INTEGER,
  service_type VARCHAR(64) DEFAULT 'DAILY_STAFF_COMMUTE',
  route_details TEXT,
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'PROPOSAL_SENT', 'QUOTED', 'WON', 'ARCHIVED')),
  source VARCHAR(64) DEFAULT 'WEBSITE_CONTACT',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries (status);

-- 14. SALIK TOLL TRANSACTIONS (DUBAI ROADS)
CREATE TABLE IF NOT EXISTS salik_transactions (
  id VARCHAR(64) PRIMARY KEY,
  toll_gate_name VARCHAR(128) NOT NULL,
  toll_gate_code VARCHAR(64) NOT NULL,
  corridor VARCHAR(128) NOT NULL,
  vehicle_id VARCHAR(64) REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_number VARCHAR(64) NOT NULL,
  driver_id VARCHAR(64) REFERENCES drivers(id) ON DELETE SET NULL,
  driver_name VARCHAR(128),
  trip_id VARCHAR(64) REFERENCES trips(id) ON DELETE SET NULL,
  route_id VARCHAR(64) REFERENCES routes(id) ON DELETE SET NULL,
  route_name VARCHAR(255),
  client_id VARCHAR(64) REFERENCES clients(id) ON DELETE SET NULL,
  client_company_name VARCHAR(255),
  amount_aed NUMERIC(8, 2) NOT NULL DEFAULT 4.00,
  tag_number VARCHAR(64) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  is_simulated BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_salik_vehicle_id ON salik_transactions (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_salik_trip_id ON salik_transactions (trip_id);
CREATE INDEX IF NOT EXISTS idx_salik_timestamp ON salik_transactions (timestamp DESC);
