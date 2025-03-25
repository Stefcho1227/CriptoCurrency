package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.repository.UserAccountRepository;
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

    @Override
    public UserAccount findUser(Integer id) {
        return userAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id =" + id));
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
    public UserAccount updateUserBalance(Integer userId, BigDecimal  newBalance) {
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }
        UserAccount existingAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id =" + userId));
        existingAccount.setBalance(newBalance);
        return userAccountRepository.save(existingAccount);
    }
}
