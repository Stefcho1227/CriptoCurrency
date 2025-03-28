/*
//import {createBrowserRouter, RouterProvider}  from "react-router";

import './App.css'

function App() {

  return (
    <>

    </>
  )
}

export default App
*/
import React, { useEffect, useState } from "react";

function App() {
  // -------------- State --------------
  const [top20, setTop20] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [transactions, setTransactions] = useState([]);
  const [userId] = useState(1);

  const [cryptoId, setCryptoId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchTop20();
    fetchBalance();
    fetchTransactions();
  }, []);

  async function fetchTop20() {
    try {
      const res = await fetch("http://localhost:8080/api/kraken/prices/top20");
      if (!res.ok) throw new Error("Failed to fetch top 20 cryptos");
      const data = await res.json();

      const arr = Object.entries(data).map(([symbol, price]) => ({ symbol, price }));
      setTop20(arr);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchBalance() {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user balance");
      const user = await res.json();
      setBalance(user.balance);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchTransactions() {
    try {
      const res = await fetch(`http://localhost:8080/api/transactions/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleBuy() {
    try {

      const res = await fetch("http://localhost:8080/api/transactions/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cryptoId: Number(cryptoId),
          quantity: parseFloat(quantity),
        }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }
      fetchBalance();
      fetchTransactions();
      alert("Buy transaction successful!");
    } catch (err) {
      alert("Error buying crypto: " + err.message);
    }
  }

  async function handleSell() {
    try {
      // Example: POST /api/transactions/sell
      const res = await fetch("http://localhost:8080/api/transactions/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cryptoId: Number(cryptoId),
          quantity: parseFloat(quantity),
        }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }
      fetchBalance();
      fetchTransactions();
      alert("Sell transaction successful!");
    } catch (err) {
      alert("Error selling crypto: " + err.message);
    }
  }

  async function handleReset() {
    try {
      const res = await fetch(`http://localhost:8080/api/transactions/reset?userId=${userId}`, {
        method: "POST"
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }
      // Refresh user data
      fetchBalance();
      fetchTransactions();
      alert("Balance reset to $10,000 and holdings cleared.");
    } catch (err) {
      alert("Error resetting: " + err.message);
    }
  }

  return (
      <div style={{ margin: "20px" }}>
        <h1>Crypto Trading Simulator</h1>

        {/* Top 20 Table */}
        <section>
          <h2>Top 20 Cryptocurrencies</h2>
          <button onClick={fetchTop20}>Refresh Prices</button>
          <table border="1" cellPadding="8">
            <thead>
            <tr>
              <th>Symbol</th>
              <th>Price (USD)</th>
            </tr>
            </thead>
            <tbody>
            {top20.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.symbol}</td>
                  <td>{item.price}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: "20px" }}>
          <h2>Account</h2>
          <p>User ID: {userId}</p>
          <p>Balance: ${balance}</p>
          <button onClick={handleReset}>Reset Balance</button>
        </section>

        {/* Buy/Sell Form */}
        <section style={{ marginTop: "20px" }}>
          <h2>Buy / Sell Crypto</h2>
          <div>
            <label>Crypto ID: </label>
            <input
                type="text"
                value={cryptoId}
                onChange={(e) => setCryptoId(e.target.value)}
            />
          </div>
          <div>
            <label>Quantity: </label>
            <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <button onClick={handleBuy}>Buy</button>
          <button onClick={handleSell}>Sell</button>
        </section>

        {/* Transactions */}
        <section style={{ marginTop: "20px" }}>
          <h2>Transaction History</h2>
          <button onClick={fetchTransactions}>Refresh Transactions</button>
          <table border="1" cellPadding="8">
            <thead>
            <tr>
              <th>Tx ID</th>
              <th>Crypto ID</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Type</th>
              <th>Time</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((tx) => (
                <tr key={tx.transactionId}>
                  <td>{tx.transactionId}</td>
                  <td>{tx.cryptoId}</td>
                  <td>{tx.quantity}</td>
                  <td>{tx.transactionPrice}</td>
                  <td>{tx.transactionType}</td>
                  <td>{tx.transactionTime}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </section>
      </div>
  );
}

export default App;
