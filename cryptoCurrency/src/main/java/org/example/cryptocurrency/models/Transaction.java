package org.example.cryptocurrency.models;


import java.math.BigDecimal;
import java.time.LocalDateTime;


public class Transaction {


    private Integer transactionId;

    private UserAccount user;


    private Crypto crypto;


    private BigDecimal quantity;

    private BigDecimal  transactionPrice;

    private String transactionType;

    private LocalDateTime transactionTime;

    public Transaction() {
        this.transactionTime = LocalDateTime.now();
    }

    public Integer getTransactionId() {
        return transactionId;
    }
    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public UserAccount getUser() {
        return user;
    }
    public void setUser(UserAccount user) {
        this.user = user;
    }

    public Crypto getCrypto() {
        return crypto;
    }
    public void setCrypto(Crypto crypto) {
        this.crypto = crypto;
    }

    public BigDecimal  getQuantity() {
        return quantity;
    }
    public void setQuantity(BigDecimal  quantity) {
        this.quantity = quantity;
    }

    public BigDecimal  getTransactionPrice() {
        return transactionPrice;
    }
    public void setTransactionPrice(BigDecimal  transactionPrice) {
        this.transactionPrice = transactionPrice;
    }

    public String getTransactionType() {
        return transactionType;
    }
    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public LocalDateTime getTransactionTime() {
        return transactionTime;
    }
    public void setTransactionTime(LocalDateTime transactionTime) {
        this.transactionTime = transactionTime;
    }
}
