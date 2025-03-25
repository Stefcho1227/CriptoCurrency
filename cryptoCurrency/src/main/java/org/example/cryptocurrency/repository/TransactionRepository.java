package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByUserIdOrderByTransactionTimeDesc(Integer userId);
}