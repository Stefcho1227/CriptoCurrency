package org.example.cryptocurrency.service.contracts;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.models.UserAccount;

import java.util.List;

public interface CryptoService {
    List<Crypto> getAll();
    Crypto getById(Integer id);
    Crypto getBySymbol(String symbol);
    Crypto create(Crypto crypto);
    Crypto update(String symbol, String name, double price);
    void deleteCrypto(Integer id);
}
