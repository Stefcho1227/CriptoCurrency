package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.models.Transaction;
import org.example.cryptocurrency.repository.contracts.CryptoRepository;
import org.example.cryptocurrency.repository.contracts.TransactionRepository;
import org.example.cryptocurrency.service.contracts.CryptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
@Service
public class CryptoServiceImpl implements CryptoService {
    private final CryptoRepository cryptoRepository;
    private final TransactionRepository transactionRepository;
    @Autowired
    CryptoServiceImpl(CryptoRepository cryptoRepository, TransactionRepository transactionRepository){
        this.cryptoRepository = cryptoRepository;
        this.transactionRepository = transactionRepository;
    }
    @Override
    public List<Crypto> getAll() {
        return cryptoRepository.findAll();
    }

    @Override
    public Crypto getById(Integer id) {
        Crypto c = cryptoRepository.findById(id);
        if (c == null) {
            throw new RuntimeException("Crypto not found with symbol=" + id);
        }
        return c;
    }

    @Override
    public Crypto getBySymbol(String symbol) {
        Crypto c = cryptoRepository.findBySymbol(symbol);
        if (c == null) {
            throw new RuntimeException("Crypto not found with symbol=" + symbol);
        }
        return c;
    }

    @Override
    public Crypto create(Crypto crypto) {
        Crypto existing = cryptoRepository.findBySymbol(crypto.getSymbol());
        if (existing != null) {
            throw new IllegalArgumentException("Crypto with symbol " + crypto.getSymbol() + " already exists.");
        }
        return cryptoRepository.save(crypto);
    }

    @Override
    public Crypto update(String symbol, String name, BigDecimal price) {
        Crypto existing = getBySymbol(symbol);
        existing.setName(name);
        existing.setCurrentPrice(price);
        return cryptoRepository.save(existing);
    }

    @Override
    public void deleteCrypto(Integer id) {
        Crypto crypto = cryptoRepository.findById(id);
        if(crypto == null){
            throw new RuntimeException("Crypto with ID " + id + " not found");
        }
        List<Transaction> existingTransactions = transactionRepository.findByCryptoId(id);
        if (!existingTransactions.isEmpty()) {
            throw new RuntimeException("Cannot delete crypto with existing transactions");
        }
        cryptoRepository.delete(id);
    }
}
