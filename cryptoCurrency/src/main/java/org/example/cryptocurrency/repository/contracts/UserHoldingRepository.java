package org.example.cryptocurrency.repository.contracts;

import org.example.cryptocurrency.models.UserHoldings;

import java.util.List;
import java.util.Optional;

public interface UserHoldingRepository  {
    UserHoldings findById(Integer id);
    List<UserHoldings> findAll();
    List<UserHoldings> findByUserId(Integer userId);
    UserHoldings findByUserIdAndCryptoId(Integer userId, Integer cryptoId);
    UserHoldings save(UserHoldings holding);
    void delete(Integer id);
}
