package org.example.cryptocurrency.service.contracts;

import org.example.cryptocurrency.models.Transaction;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionService {
    List<Transaction> getAllTransactions();
    List<Transaction> getUserTransactions(Integer userId);
    void buyCrypto(Integer userId, Integer cryptoId, BigDecimal quantity, BigDecimal  price);
    void sellCrypto(Integer userId, Integer cryptoId, BigDecimal  quantity, BigDecimal  price);
    void resetUserBalance(Integer userId);
}
