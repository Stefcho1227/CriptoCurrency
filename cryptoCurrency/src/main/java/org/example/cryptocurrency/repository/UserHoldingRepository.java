package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.UserHoldings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserHoldingRepository extends JpaRepository<UserHoldings, Long> {
    Optional<UserHoldings> findByUserIdAndCryptoId(Integer userId, Integer cryptoId);
    List<UserHoldings> findByUserId(Integer userId);
}
