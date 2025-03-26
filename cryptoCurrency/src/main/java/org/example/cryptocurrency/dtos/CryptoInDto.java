package org.example.cryptocurrency.dtos;

import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class CryptoInDto {
    @Size(min = 2, max = 5, message = "Crypto symbol should be between 2 and 5 characters long")
    private String symbol;
    @Size(min = 2, max = 30, message = "Crypto name should be between 2 and 30 characters long")
    private String name;
    private BigDecimal currentPrice;
    public CryptoInDto() {
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

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }
}
