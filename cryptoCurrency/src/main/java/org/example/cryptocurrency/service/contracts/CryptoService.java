package org.example.cryptocurrency.service.contracts;

import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.models.UserAccount;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface CryptoService {
    List<Crypto> getAll();
    Map<String, String> getTop20();
    Crypto getById(Integer id);
    Crypto getBySymbol(String symbol);
    Crypto create(Crypto crypto);
    Crypto update(String symbol, String name, BigDecimal price);
    void deleteCrypto(Integer id);
}
