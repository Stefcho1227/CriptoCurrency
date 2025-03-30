package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.models.UserHoldings;
import org.example.cryptocurrency.repository.contracts.UserAccountRepository;
import org.example.cryptocurrency.repository.contracts.UserHoldingRepository;
import org.example.cryptocurrency.service.contracts.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
@Service
public class UserAccountServiceImpl implements UserAccountService {
    private final UserAccountRepository userAccountRepository;
    private final UserHoldingRepository userHoldingRepository;
    private static final BigDecimal STARTING_PRICE = new BigDecimal(10000);
    @Autowired
    UserAccountServiceImpl(UserAccountRepository userAccountRepository, UserHoldingRepository userHoldingRepository){
        this.userAccountRepository = userAccountRepository;
        this.userHoldingRepository = userHoldingRepository;
    }

    public UserAccount findUser(Integer id) {
        UserAccount user = userAccountRepository.findById(id);
        if (user == null) {
            throw new RuntimeException("User not found with id=" + id);
        }
        return user;
    }

    @Override
    public UserAccount findByUsername(String username) {
        UserAccount user = userAccountRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found with username =" + username);
        }
        return user;
    }

    @Override
    public List<UserAccount> findAllUsers() {
        return userAccountRepository.findAll();
    }

    @Override
    public UserAccount createUser(UserAccount user) {
        user.setBalance(STARTING_PRICE);
        return userAccountRepository.save(user);
    }

    @Override
    public UserAccount updateUserBalance(Integer userId, BigDecimal newBalance) {
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }
        UserAccount existingAccount = userAccountRepository.findById(userId);
        if (existingAccount == null) {
            throw new RuntimeException("User not found with id=" + userId);
        }
        existingAccount.setBalance(newBalance);
        return userAccountRepository.save(existingAccount);
    }

    @Override
    public List<UserHoldings> getHoldingsByUserId(Integer userId) {
        List<UserHoldings> holdings = userHoldingRepository.findByUserId(userId);
        if (holdings == null || holdings.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No holdings found for user id " + userId);
        }
        return holdings;
    }
}
