CREATE DATABASE IF NOT EXISTS rwanda_population_react CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rwanda_population_react;

CREATE TABLE IF NOT EXISTS locations (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 parent_id INT UNSIGNED NULL,
 name VARCHAR(120) NOT NULL,
 location_type ENUM('province','district','sector','cell','village') NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_location_parent FOREIGN KEY(parent_id) REFERENCES locations(id) ON DELETE RESTRICT,
 UNIQUE KEY uq_location_parent_name(parent_id,name),
 INDEX idx_location_type(location_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 full_name VARCHAR(150) NOT NULL,
 username VARCHAR(100) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('admin','national_admin','local_admin','data_entry','verifier','health_worker','viewer') NOT NULL DEFAULT 'viewer',
 location_id INT UNSIGNED NULL,
 is_active TINYINT(1) NOT NULL DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_user_location FOREIGN KEY(location_id) REFERENCES locations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS residents (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 resident_code VARCHAR(40) NOT NULL UNIQUE,
 national_id VARCHAR(32) NULL UNIQUE,
 first_name VARCHAR(80) NOT NULL,
 last_name VARCHAR(80) NOT NULL,
 sex ENUM('Male','Female','Other') NOT NULL,
 date_of_birth DATE NULL,
 phone VARCHAR(30) NULL,
 marital_status VARCHAR(30) NULL,
 village_id INT UNSIGNED NULL,
 status ENUM('Active','Moved','Deceased') NOT NULL DEFAULT 'Active',
 verification_status ENUM('Draft','Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
 created_by INT UNSIGNED NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 archived_at TIMESTAMP NULL DEFAULT NULL,
 CONSTRAINT fk_resident_village FOREIGN KEY(village_id) REFERENCES locations(id) ON DELETE SET NULL,
 CONSTRAINT fk_resident_creator FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL,
 INDEX idx_resident_name(last_name,first_name),
 INDEX idx_resident_status(status),
 INDEX idx_resident_verification(verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS health_facilities (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(150) NOT NULL,
 facility_type VARCHAR(80) NOT NULL DEFAULT 'Health Centre',
 district_id INT UNSIGNED NULL,
 phone VARCHAR(30) NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_facility_district FOREIGN KEY(district_id) REFERENCES locations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id INT UNSIGNED NULL,
 action VARCHAR(100) NOT NULL,
 entity_type VARCHAR(80) NULL,
 entity_id VARCHAR(80) NULL,
 details TEXT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_audit_created(created_at),
 CONSTRAINT fk_audit_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
