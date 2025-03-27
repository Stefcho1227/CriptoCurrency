package org.example.cryptocurrency.controller;

import jakarta.validation.Valid;
import org.example.cryptocurrency.dtos.TransactionRequestDto;
import org.example.cryptocurrency.models.Transaction;
import org.example.cryptocurrency.service.contracts.TransactionService;
import org.example.cryptocurrency.service.contracts.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    private final UserAccountService userAccountService;
    @Autowired
    public TransactionController(TransactionService transactionService, UserAccountService userAccountService) {
        this.transactionService = transactionService;
        this.userAccountService = userAccountService;
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
    public ResponseEntity<String> buyCrypto(@RequestBody @Valid TransactionRequestDto dto) {
        transactionService.buyCrypto(dto.getUserId(), dto.getCryptoId(), dto.getQuantity());
        return ResponseEntity.ok("Buy transaction successful for user " + userAccountService.findUser(dto.getUserId()).getUsername());
    }
    @PostMapping("/sell")
    public ResponseEntity<String> sellCrypto(@RequestBody @Valid TransactionRequestDto dto) {
        transactionService.sellCrypto(dto.getUserId(), dto.getCryptoId(), dto.getQuantity());
        return ResponseEntity.ok("Sell transaction successful for user " + userAccountService.findUser(dto.getUserId()).getUsername());
    }
    @PostMapping("/reset")
    public ResponseEntity<String> resetUserBalance(@RequestParam Integer userId) {
        transactionService.resetUserBalance(userId);
        return ResponseEntity.ok("User " + userId + " balance reset to $10,000.");
    }
}
