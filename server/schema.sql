-- Create database
CREATE DATABASE IF NOT EXISTS nist_controls;
USE nist_controls;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create controls table
CREATE TABLE IF NOT EXISTS controls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  controlId VARCHAR(50) NOT NULL UNIQUE,
  controlName VARCHAR(255) NOT NULL,
  family VARCHAR(100),
  class VARCHAR(100),
  controlText TEXT,
  supplementalGuidance TEXT,
  relatedControls TEXT,
  priority VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create default admin user (password: admin123)
INSERT INTO users (username, password) VALUES ('admin', '$2a$10$YourHashedPasswordHere');

-- Add indexes
CREATE INDEX idx_control_id ON controls(controlId);
CREATE INDEX idx_family ON controls(family);
CREATE INDEX idx_class ON controls(class);