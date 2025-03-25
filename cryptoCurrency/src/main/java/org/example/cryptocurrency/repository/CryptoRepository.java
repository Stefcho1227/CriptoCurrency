package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.Crypto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface CryptoRepository extends JpaRepository<Crypto, Integer> {
    Optional<Crypto> findBySymbol(String symbol);
}
