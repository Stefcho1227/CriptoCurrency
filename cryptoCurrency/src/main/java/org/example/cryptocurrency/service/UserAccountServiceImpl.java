package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.repository.UserAccountRepository;
import org.example.cryptocurrency.service.contracts.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UserAccountServiceImpl implements UserAccountService {
    private final UserAccountRepository userAccountRepository;
    private static final double STARTING_PRICE = 10000.0;
    @Autowired
    UserAccountServiceImpl(UserAccountRepository userAccountRepository){
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public UserAccount findUser(Integer id) {
        return userAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id=" + id));
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
    public UserAccount updateUserBalance(Integer userId, double newBalance) {
        UserAccount existingAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id=" + userId));
        existingAccount.setBalance(newBalance);
        return null;
    }
}
