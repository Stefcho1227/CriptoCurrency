package org.example.cryptocurrency.repository.contracts;

import org.example.cryptocurrency.models.Crypto;

import java.util.List;
public interface CryptoRepository {
    Crypto findById(Integer id);
    List<Crypto> findAll();
    Crypto findBySymbol(String symbol);
    Crypto save(Crypto crypto);
    void delete(Integer id);}
