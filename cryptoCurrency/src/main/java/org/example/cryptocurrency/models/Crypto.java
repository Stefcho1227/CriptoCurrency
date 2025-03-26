package org.example.cryptocurrency.models;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Crypto {
    private Integer id;
    private String symbol;
    private String name;
    private BigDecimal currentPrice;
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
}