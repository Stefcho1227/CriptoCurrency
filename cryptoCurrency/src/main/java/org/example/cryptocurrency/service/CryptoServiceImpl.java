package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.repository.CryptoRepository;
import org.example.cryptocurrency.repository.UserAccountRepository;
import org.example.cryptocurrency.service.contracts.CryptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CryptoServiceImpl implements CryptoService {
    private final CryptoRepository cryptoRepository;
    private static final double STARTING_PRICE = 10000.0;
    @Autowired
    CryptoServiceImpl(CryptoRepository cryptoRepository){
        this.cryptoRepository = cryptoRepository;
    }
    @Override
    public List<Crypto> getAll() {
        return cryptoRepository.findAll();
    }

    @Override
    public Crypto getById(Integer id) {
        return cryptoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crypto not found with id =" + id));
    }

    @Override
    public Crypto getBySymbol(String symbol) {
        return cryptoRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Crypto not found with symbol =" + symbol));
    }

    @Override
    public Crypto create(Crypto crypto) {
        if(cryptoRepository.findBySymbol(crypto.getSymbol()).isPresent()){
            throw new IllegalArgumentException("Crypto with symbol " + crypto.getSymbol() + " already exists.");
        }
        return cryptoRepository.save(crypto);
    }

    @Override
    public Crypto update(String symbol, String name, double price) {
        Crypto existing = getBySymbol(symbol);
        existing.setName(name);
        existing.setCurrentPrice(price);
        return cryptoRepository.save(existing);
    }

    @Override
    public void deleteCrypto(Integer id) {
        if (cryptoRepository.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Crypto with ID " + id + " does not exist.");
        }
        cryptoRepository.deleteById(id);
    }
}
