package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.repository.contracts.UserAccountRepository;
import org.example.cryptocurrency.service.contracts.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
@Service
public class UserAccountServiceImpl implements UserAccountService {
    private final UserAccountRepository userAccountRepository;
    private static final BigDecimal STARTING_PRICE = new BigDecimal(10000);
    @Autowired
    UserAccountServiceImpl(UserAccountRepository userAccountRepository){
        this.userAccountRepository = userAccountRepository;
    }

    public UserAccount findUser(Integer id) {
        UserAccount user = userAccountRepository.findById(id);
        if (user == null) {
            throw new RuntimeException("User not found with id=" + id);
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
}
