# Crypto Trading Simulation Platform

This project is a cryptocurrency trading simulation platform. It allows users to view real-time prices for the top 20 cryptocurrencies (via Kraken’s WebSocket API), manage a virtual account balance, buy/sell crypto, and view a history of transactions. Users can also reset their account to a starting balance (default: $10,000).
## Overview

The platform simulates cryptocurrency trading by:
- **Displaying Real-Time Prices:**  
  Subscribes to Kraken’s WebSocket API to fetch and update real-time prices for crypto pairs (e.g. those ending in `/USD`). Only the top 20 pairs (by price or other criteria) are shown.
- **User Account Management:**  
  Users have a virtual account starting with $10,000, and can register, log in (using Basic Authentication), and view their account details.
- **Buying and Selling:**  
  Users can buy and sell cryptocurrencies. The system deducts or adds funds from the virtual account, updates holdings, and records every transaction.
- **Transaction History:**  
  All buy/sell actions are logged and can be viewed in a transaction history.
- **Holdings:**  
  All crypto currencies that the user owns are logged and can be viewed.
- **Reset Functionality:**  
  Users can reset their account to the initial balance and clear all crypto holdings.

## Technologies & Dependencies

- **Backend:**  
  - Java 17, Spring Boot
  - Plain JDBC for database operations  
  - Kraken V2 WebSocket API integration (via the `java-websocket` library)  
- **Database:**  
  - MariaDB used for storing user accounts, cryptocurrencies, transactions, and holdings.
- **Frontend:**  
  - React (or Vue.js) is recommended for a user-friendly interface.
- **Containerization:**  
  - Docker and Docker Compose


## APIs and Endpoints

### Authentication & Authorization

- **POST** `/api/auth/login`  
  - **Purpose:** Authenticates a user using Basic Authentication.
  - **Request Body:**  
    ```json
    {
      "username": "alice",
      "password": "secret"
    }
    ```
  - **Response:** A DTO (e.g. `AccountUser`) with non-sensitive user information such as user id, username, balance, transaction history, and holdings.  
- **POST** `/api/auth/register`  
  - **Purpose:** Register a user using Basic Authentication.
  - **Request Body:**  
    ```json
    {
      "username": "alice",
      "email": "alice12@gmail.com",
      "password": "secret",
      "confirmPassword": "secret",
    }
    ```

### User Management
- **GET** `/api/users/{id}`  
  - **Purpose:** Retrieve user details.
  - **Response:** A `UserAccount` object (or a DTO) with user data.
- **GET** `/api/users/{id}/holdings`  
  - **Purpose:** Retrieve user's holdings.
  - **Response:** A `UserHoldings` list.

### Crypto Data

- **GET** `/api/cryptos`  
  - **Purpose:** List all cryptocurrencies stored in the database.
- **GET** `/api/cryptos/top20`  
  - **Purpose:** Get the top 20 cryptocurrencies (based on real-time price updates) from the Kraken API.
- **GET** `/api/cryptos/{id}`  
  - **Purpose:** Get details of a specific cryptocurrency by ID.
- **GET** `/api/cryptos/symbol/{symbol}`  
  - **Purpose:** Get details of a specific cryptocurrency by symbol.
- **POST** `/api/cryptos`  
  - **Purpose:** Create a new cryptocurrency entry.
- **PUT** `/api/cryptos/{symbol}`  
  - **Purpose:** Update an existing cryptocurrency’s information.
- **DELETE** `/api/cryptos/{id}`  
  - **Purpose:** Delete a cryptocurrency (if there are no associated transactions).

### Transactions

- **GET** `/api/transactions`  
  - **Purpose:** Retrieve all transactions.
- **GET** `/api/transactions/user/{userId}`  
  - **Purpose:** Retrieve all transactions for a specific user.
- **POST** `/api/transactions/buy`  
  - **Purpose:** Buy cryptocurrency.
  - **Request Body:**  
    ```json
    {
      "userId": 1,
      "cryptoId": 2,
      "quantity": 0.5
    }
    ```
- **POST** `/api/transactions/sell`  
  - **Purpose:** Sell cryptocurrency.
  - **Request Body:** Similar to buy.
- **POST** `/api/transactions/reset/{userId}`  
  - **Purpose:** Reset the user’s account balance to $10,000 and clear holdings.

## Design Decisions

### Security

- **AccountUser DTO:**  
  Instead of returning the entire UserAccount (which might contain sensitive data like passwords), an `AccountUser` DTO is used to send only the necessary, non-sensitive user data to the front end.

### Data Model

- **UserAccount:**  
  Contains user details (id, username, email, password, balance), along with a list of transactions and user holdings.
- **Crypto:**  
  Represents a cryptocurrency with symbol, name, and current price.
- **Transaction:**  
  Logs each buy or sell transaction, including quantity, price, type (BUY/SELL), and timestamp.
- **UserHoldings:**  
  Tracks the quantity of each cryptocurrency that a user holds.

### Kraken API Integration

- **Real-Time Prices:**  
  A dedicated service (`KrakenWebSocketService`) subscribes to Kraken’s WebSocket ticker feed.  
  - It maintains an in-memory map of crypto prices.
  - A method updates the database with the current prices.
  - A separate endpoint returns the top 20 crypto prices for display.
- **Filtering:**  
  Only crypto pairs ending with `/USD` are considered.

## Running the Application

### Local Setup

1. **Database:**  
   Ensure your database (MariaDB/MySQL/PostgreSQL) is running and the credentials in `application.properties` are correct.
2. **Build and Run:**  
   ```bash
   ./gradlew build
   ./gradlew bootRun
### With Docker

**Prerequisites**

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- Git installed

---

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/cryptoCurrency
```

2. **Environment Configuration**

Create a `.env` file in the project root using the provided template:
```
//.env
DB_USER=your_db_username DB_PASS=your_db_password
```
3. **Build and run the application**

```
bash
docker compose up --build
```
4. **Run the front end**
---
## Without docker

You can run this manually in your IDE using the following SQL script:

```sql
CREATE TABLE crypto (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    symbol        VARCHAR(50) NOT NULL UNIQUE,
    name          VARCHAR(50),
    current_price DECIMAL(15, 8)
);

CREATE TABLE user_account (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)    NOT NULL,
    balance  DECIMAL(15, 2) NOT NULL,
    email    VARCHAR(50)    NOT NULL,
    password VARCHAR(30)    NOT NULL
);

CREATE TABLE transaction (
    transaction_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL,
    crypto_id         INT NOT NULL,
    quantity          DECIMAL(15, 8) NOT NULL,
    transaction_price DECIMAL(15, 8) NOT NULL,
    transaction_type  VARCHAR(4) NOT NULL,
    transaction_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_crypto FOREIGN KEY (crypto_id) REFERENCES crypto (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_account FOREIGN KEY (user_id) REFERENCES user_account (id) ON DELETE CASCADE
);

CREATE TABLE user_holdings (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   INT NOT NULL,
    crypto_id INT NOT NULL,
    quantity  DECIMAL(15, 8) DEFAULT 0.00000000 NOT NULL,
    CONSTRAINT fk_user_holdings_crypto FOREIGN KEY (crypto_id) REFERENCES crypto (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_holdings_user_account FOREIGN KEY (user_id) REFERENCES user_account (id) ON DELETE CASCADE
);
```
## SCREENSHOTS
**Dashboard**
![Screenshot 2025-03-31 160838](https://github.com/user-attachments/assets/9e2c80bc-b703-419b-81e6-0d2042844076)
![Screenshot 2025-03-31 160857](https://github.com/user-attachments/assets/b863537a-1db8-49e2-8e5a-55ab422ddf93)

**Login**
![Screenshot 2025-03-31 160914](https://github.com/user-attachments/assets/f2c5d4ad-33d3-4e23-9883-768c0f35519a)

**Register**
![Screenshot 2025-03-31 160927](https://github.com/user-attachments/assets/96f95a96-5779-40f0-9b32-4161d0233015)

**Dashboard after register**
![Screenshot 2025-03-31 160947](https://github.com/user-attachments/assets/4fe0e1e3-fa12-4a90-8fa6-8590893f88fd)

**My account**
![Screenshot 2025-03-31 160955](https://github.com/user-attachments/assets/0f667024-e3f9-462c-ae6a-88dbac4f92f8)

**Buy page**
![Screenshot 2025-03-31 161013](https://github.com/user-attachments/assets/5ea6b856-d29b-427b-9f44-aa739c51fbdf)

**Buy crypto**
![Screenshot 2025-03-31 161024](https://github.com/user-attachments/assets/b7c138a2-da08-47e9-b0cb-546016783203)

**Transactions**
![Screenshot 2025-03-31 161041](https://github.com/user-attachments/assets/cf7d314a-0a81-4239-b6d9-ce71cdb5408e)

**Holdings**
![Screenshot 2025-03-31 161053](https://github.com/user-attachments/assets/90e00e6e-7835-4d29-bfe5-c177cfe9754a)

**Sell page**
![Screenshot 2025-03-31 161109](https://github.com/user-attachments/assets/00373016-1fbc-4310-8a3c-7e5536748daf)



**Sell crypto**
![Screenshot 2025-03-31 161119](https://github.com/user-attachments/assets/ae99d179-7553-4977-82e0-4f8b36f3b11d)

**Video**
Sent on email to Iren
