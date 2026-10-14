-- Créer la base de données
CREATE DATABASE IF NOT EXISTS banking_db;
USE banking_db;

-- Table Customer
CREATE TABLE IF NOT EXISTS customer (
                                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                        first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Account
CREATE TABLE IF NOT EXISTS account (
                                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                       account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- CHECKING, SAVINGS, INVESTMENT
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    customer_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_account_number (account_number)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table Transaction
CREATE TABLE IF NOT EXISTS transaction (
                                           id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                           transaction_type VARCHAR(50) NOT NULL, -- DEPOSIT, WITHDRAW, TRANSFER
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    from_account_id BIGINT,
    to_account_id BIGINT,
    status VARCHAR(50) DEFAULT 'SUCCESS', -- SUCCESS, FAILED, PENDING
    description VARCHAR(255),
    reference_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_account_id) REFERENCES account(id) ON DELETE SET NULL,
    FOREIGN KEY (to_account_id) REFERENCES account(id) ON DELETE SET NULL,
    INDEX idx_from_account (from_account_id),
    INDEX idx_to_account (to_account_id),
    INDEX idx_created_at (created_at),
    INDEX idx_type (transaction_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de test
INSERT INTO customer (first_name, last_name, email, phone, address, city, country) VALUES
                                                                                       ('John', 'Doe', 'john.doe@example.com', '0612345678', '123 Main St', 'Paris', 'France'),
                                                                                       ('Jane', 'Smith', 'jane.smith@example.com', '0687654321', '456 Oak Ave', 'Lyon', 'France'),
                                                                                       ('Ahmed', 'Ben', 'ahmed.ben@example.com', '0699998888', '789 Elm St', 'Casablanca', 'Morocco');

INSERT INTO account (account_number, account_type, balance, currency, customer_id, status) VALUES
                                                                                               ('ACC001', 'CHECKING', 5000.00, 'USD', 1, 'ACTIVE'),
                                                                                               ('ACC002', 'SAVINGS', 15000.00, 'USD', 1, 'ACTIVE'),
                                                                                               ('ACC003', 'CHECKING', 3000.00, 'USD', 2, 'ACTIVE'),
                                                                                               ('ACC004', 'SAVINGS', 25000.00, 'USD', 3, 'ACTIVE');