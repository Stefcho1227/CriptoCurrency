package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.models.Transaction;
import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.models.UserHoldings;
import org.example.cryptocurrency.repository.CryptoRepository;
import org.example.cryptocurrency.repository.TransactionRepository;
import org.example.cryptocurrency.repository.UserAccountRepository;
import org.example.cryptocurrency.repository.UserHoldingRepository;
import org.example.cryptocurrency.service.contracts.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepo;
    private final CryptoRepository cryptoRepo;
    private final UserAccountRepository userRepo;
    private final UserHoldingRepository userHoldingRepo;
    @Autowired
    TransactionServiceImpl(TransactionRepository transactionRepo,
                           CryptoRepository cryptoRepo,
                           UserAccountRepository userRepo,
                           UserHoldingRepository userHoldingRepo){
        this.transactionRepo = transactionRepo;
        this.cryptoRepo = cryptoRepo;
        this.userRepo = userRepo;
        this.userHoldingRepo = userHoldingRepo;
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
    public void buyCrypto(Integer userId, Integer cryptoId, BigDecimal  quantity, BigDecimal price) {
        if (quantity.compareTo(BigDecimal.ZERO) <= 0 || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity and price must be positive");
        }
        UserAccount user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Crypto crypto = cryptoRepo.findById(cryptoId).orElseThrow(() -> new RuntimeException("Crypto not found"));
        BigDecimal  total = quantity.multiply(price);
        if(user.getBalance().compareTo(total) < 0){
            throw new RuntimeException("Insufficient balance to buy");
        }
        user.setBalance(user.getBalance().subtract(total));
        userRepo.save(user);
        UserHoldings holding = userHoldingRepo
                .findByUserIdAndCryptoId(userId, cryptoId)
                .orElseGet(() -> {
                    UserHoldings newHolding = new UserHoldings();
                    newHolding.setUser(user);
                    newHolding.setCrypto(crypto);
                    newHolding.setQuantity(BigDecimal.ZERO);
                    user.getHoldings().add(newHolding);
                    crypto.getHoldings().add(newHolding);
                    return newHolding;
                });
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
    public void sellCrypto(Integer userId, Integer cryptoId, BigDecimal  quantity, BigDecimal  price) {
        if (quantity.compareTo(BigDecimal.ZERO) <= 0 || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity and price must be positive");
        }
        UserAccount user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id = " + userId));

        Crypto crypto = cryptoRepo.findById(cryptoId)
                .orElseThrow(() -> new RuntimeException("Crypto not found with id = " + cryptoId));

        UserHoldings holding = userHoldingRepo
                .findByUserIdAndCryptoId(userId, cryptoId)
                .orElseThrow(() -> new RuntimeException("No holdings of this crypto to sell"));

        if (holding.getQuantity().compareTo(quantity) < 0) {
            throw new RuntimeException(
                    "Not enough holdings to sell. You have "
                            + holding.getQuantity() + " units, tried to sell " + quantity);
        }

        BigDecimal updatedQty = holding.getQuantity().subtract(quantity);
        holding.setQuantity(updatedQty);
        if (updatedQty.compareTo(BigDecimal.ZERO) == 0) {
            user.getHoldings().remove(holding);
            crypto.getHoldings().remove(holding);
            userHoldingRepo.delete(holding);
        } else {
            userHoldingRepo.save(holding);
        }
        BigDecimal proceeds = quantity.multiply(price);
        user.setBalance(user.getBalance().add(proceeds));
        userRepo.save(user);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCrypto(crypto);
        transaction.setQuantity(quantity);
        transaction.setTransactionPrice(price);
        transaction.setTransactionType("SELL");
        transaction.setTransactionTime(LocalDateTime.now());
        transactionRepo.save(transaction);
    }

    @Override
    public void resetUserBalance(Integer userId) {
        UserAccount user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBalance(BigDecimal.valueOf(10000.00));
        userRepo.save(user);
    }
}
