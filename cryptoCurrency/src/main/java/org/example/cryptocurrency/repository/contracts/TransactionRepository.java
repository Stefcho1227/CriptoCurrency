package org.example.cryptocurrency.repository.contracts;

import org.example.cryptocurrency.models.Transaction;

import java.util.List;
public interface TransactionRepository  {
    Transaction findById(Integer transactionId);
    List<Transaction> findByCryptoId(Integer cryptoId);
    List<Transaction> findAll();
    List<Transaction> findByUserIdOrderByTransactionTimeDesc(Integer userId);
    Transaction save(Transaction tx); // insert or update
    void delete(Integer transactionId);}