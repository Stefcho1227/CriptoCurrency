package org.example.cryptocurrency.models;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Integer transactionId;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @ManyToOne
    @JoinColumn(name = "crypto_id", nullable = false)
    private Crypto crypto;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "transaction_price")
    private BigDecimal  transactionPrice;

    @Column(name = "transaction_type")
    private String transactionType;

    @Column(name = "transaction_time", updatable = false)
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
