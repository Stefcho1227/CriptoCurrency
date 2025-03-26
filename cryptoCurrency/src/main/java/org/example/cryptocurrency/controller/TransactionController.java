package org.example.cryptocurrency.controller;

import org.example.cryptocurrency.models.Transaction;
import org.example.cryptocurrency.service.contracts.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }
    @GetMapping("/user/{userId}")
    public List<Transaction> getUserTransactions(@PathVariable Integer userId) {
        return transactionService.getUserTransactions(userId);
    }
    @PostMapping("/buy")
    public ResponseEntity<String> buyCrypto(@RequestParam Integer userId,
                                            @RequestParam Integer cryptoId,
                                            @RequestParam BigDecimal quantity,
                                            @RequestParam BigDecimal price) {
        transactionService.buyCrypto(userId, cryptoId, quantity, price);
        return ResponseEntity.ok("Buy transaction successful for user " + userId);
    }
    @PostMapping("/sell")
    public ResponseEntity<String> sellCrypto(
            @RequestParam Integer userId,
            @RequestParam Integer cryptoId,
            @RequestParam BigDecimal quantity,
            @RequestParam BigDecimal price) {
        transactionService.sellCrypto(userId, cryptoId, quantity, price);
        return ResponseEntity.ok("Sell transaction successful for user " + userId);
    }
    @PostMapping("/reset")
    public ResponseEntity<String> resetUserBalance(@RequestParam Integer userId) {
        transactionService.resetUserBalance(userId);
        return ResponseEntity.ok("User " + userId + " balance reset to $10,000.");
    }
}
