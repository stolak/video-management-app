-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@example.com', '$2b$10$example_hash_here', 'Admin User', 'admin'),
('demo@example.com', '$2b$10$example_hash_here', 'Demo User', 'user')
ON CONFLICT (email) DO NOTHING;
