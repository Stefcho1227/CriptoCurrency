CREATE TABLE user_account (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              balance NUMERIC(15, 2) NOT NULL
);

CREATE TABLE crypto (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        symbol VARCHAR(50) UNIQUE NOT NULL,
                        name VARCHAR(50),
                        current_price NUMERIC(15, 8)
);

CREATE TABLE transaction (
                             transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                             user_id INT NOT NULL,
                             crypto_id INT NOT NULL,
                             quantity DECIMAL(15, 8) NOT NULL,
                             transaction_price DECIMAL(15, 8) NOT NULL,
                             transaction_type VARCHAR(4) NOT NULL,
                             transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_user_account
                                 FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE,

                             CONSTRAINT fk_crypto
                                 FOREIGN KEY (crypto_id) REFERENCES crypto(id) ON DELETE CASCADE
);