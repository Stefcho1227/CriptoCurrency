package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.models.Transaction;
import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.models.UserHoldings;
import org.example.cryptocurrency.repository.contracts.CryptoRepository;
import org.example.cryptocurrency.repository.contracts.TransactionRepository;
import org.example.cryptocurrency.repository.contracts.UserAccountRepository;
import org.example.cryptocurrency.repository.contracts.UserHoldingRepository;
import org.example.cryptocurrency.service.contracts.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepo;
    private final CryptoRepository cryptoRepo;
    private final UserAccountRepository userRepo;
    private final UserHoldingRepository userHoldingRepo;
    private final KrakenWebSocketService krakenWebSocketService;
    private static final BigDecimal STARTING_PRICE = new BigDecimal(10000);

    @Autowired
    TransactionServiceImpl(TransactionRepository transactionRepo,
                           CryptoRepository cryptoRepo,
                           UserAccountRepository userRepo,
                           UserHoldingRepository userHoldingRepo,
                           KrakenWebSocketService krakenWebSocketService){
        this.transactionRepo = transactionRepo;
        this.cryptoRepo = cryptoRepo;
        this.userRepo = userRepo;
        this.userHoldingRepo = userHoldingRepo;
        this.krakenWebSocketService = krakenWebSocketService;
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAll();
    }

    @Override
    public List<Transaction> getUserTransactions(Integer userId) {
        return transactionRepo.findByUserIdOrderByTransactionTimeDesc(userId);
    }

    @Override
    public void buyCrypto(Integer userId, Integer cryptoId, BigDecimal  quantity) {
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity  must be positive");
        }
        krakenWebSocketService.updateCryptoPrices();
        UserAccount user = userRepo.findById(userId);
        if(user == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }
        Crypto crypto = cryptoRepo.findById(cryptoId);
        if(crypto == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Crypto not found");
        }
        BigDecimal price = crypto.getCurrentPrice();
        BigDecimal  total = quantity.multiply(price);
        if(user.getBalance().compareTo(total) < 0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance to buy");
        }
        user.setBalance(user.getBalance().subtract(total));
        userRepo.save(user);
        UserHoldings holding = userHoldingRepo.findByUserIdAndCryptoId(userId, cryptoId);
        if(holding == null){
            holding = new UserHoldings();
            holding.setUser(user);
            holding.setCrypto(crypto);
            holding.setQuantity(BigDecimal.ZERO);
            user.getHoldings().add(holding);
        }
        holding.setQuantity(holding.getQuantity().add(quantity));
        userHoldingRepo.save(holding);
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCrypto(crypto);
        transaction.setQuantity(quantity);
        transaction.setTransactionPrice(price);
        transaction.setTransactionType("BUY");
        transaction.setTransactionTime(LocalDateTime.now());
        transactionRepo.save(transaction);
    }

    @Override
    public void sellCrypto(Integer userId, Integer cryptoId, BigDecimal  quantity) {
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        krakenWebSocketService.updateCryptoPrices();
        UserAccount user = userRepo.findById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found with id=" + userId);
        }
        Crypto crypto = cryptoRepo.findById(cryptoId);
        if (crypto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Crypto not found with id=" + cryptoId);
        }
        BigDecimal price = crypto.getCurrentPrice();
        UserHoldings holding = userHoldingRepo.findByUserIdAndCryptoId(userId, cryptoId);
        if (holding == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No holdings of this crypto to sell");
        }
        if (holding.getQuantity().compareTo(quantity) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Not enough holdings to sell. You have " + holding.getQuantity() + " units, tried to sell " + quantity);
        }
        BigDecimal updatedQty = holding.getQuantity().subtract(quantity);
        holding.setQuantity(updatedQty);
        if (updatedQty.compareTo(BigDecimal.ZERO) == 0) {
            user.getHoldings().remove(holding);
            userHoldingRepo.delete(holding.getId());
        } else {
            userHoldingRepo.save(holding);
        }
        BigDecimal proceeds = quantity.multiply(price);
        user.setBalance(user.getBalance().add(proceeds));
        userRepo.save(user);
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setCrypto(crypto);
        tx.setQuantity(quantity);
        tx.setTransactionPrice(price);
        tx.setTransactionType("SELL");
        tx.setTransactionTime(LocalDateTime.now());
        transactionRepo.save(tx);
    }

    @Override
    public void resetUserBalance(Integer userId) {
        UserAccount user = userRepo.findById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found for reset");
        }
        user.setBalance(STARTING_PRICE);
        userRepo.save(user);
        List<UserHoldings> holdings = userHoldingRepo.findByUserId(userId);
        for (UserHoldings h : holdings) {
            userHoldingRepo.delete(h.getId());
        }
        user.setHoldings(new ArrayList<>());
    }
}
