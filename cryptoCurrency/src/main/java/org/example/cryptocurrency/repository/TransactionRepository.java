package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByUserIdOrderByTransactionTimeDesc(Long userId);
}