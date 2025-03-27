package org.example.cryptocurrency.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


public class UserAccount {
    private Integer userId;
    private BigDecimal balance;
    private String username;
    private List<Transaction> transactions = new ArrayList<>();
    private List<UserHoldings> holdings = new ArrayList<>();
    public UserAccount() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public BigDecimal  getBalance() {
        return balance;
    }
    public void setBalance(BigDecimal  balance) {
        this.balance = balance;
    }
    public List<Transaction> getTransactions() {
        return transactions;
    }
    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public List<UserHoldings> getHoldings() {
        return holdings;
    }

    public void setHoldings(List<UserHoldings> holdings) {
        this.holdings = holdings;
    }
}
