package org.example.cryptocurrency.service.contracts;

import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.models.UserHoldings;

import java.math.BigDecimal;
import java.util.List;

public interface UserAccountService {
    UserAccount findUser(Integer id);
    UserAccount findByUsername(String username);
    List<UserAccount> findAllUsers();
    UserAccount createUser(UserAccount user);
    public UserAccount updateUserBalance(Integer userId, BigDecimal newBalance);
    List<UserHoldings> getHoldingsByUserId(Integer userId);

}
