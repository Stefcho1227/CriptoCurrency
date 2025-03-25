package org.example.cryptocurrency.models;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "crypto")
public class Crypto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "symbol")
    private String symbol;
    @Column(name = "name")
    private String name;
    @Column(name = "current_price")
    private BigDecimal currentPrice;
    @OneToMany(mappedBy = "crypto", cascade = CascadeType.ALL)
    private List<Transaction> transactions = new ArrayList<>();
    @OneToMany(mappedBy = "crypto", cascade = CascadeType.ALL)
    private List<UserHoldings> holdings = new ArrayList<>();
    public Crypto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal  getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal  currentPrice) {
        this.currentPrice = currentPrice;
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