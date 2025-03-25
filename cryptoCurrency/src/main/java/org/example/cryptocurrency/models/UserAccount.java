package org.example.cryptocurrency.models;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_account")
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer userId;
    @Column(name = "balance")
    private BigDecimal balance;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Transaction> transactions = new ArrayList<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserHoldings> holdings = new ArrayList<>();
    public UserAccount() {
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
