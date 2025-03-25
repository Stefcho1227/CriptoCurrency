package org.example.cryptocurrency.service.contracts;

import org.example.cryptocurrency.models.UserAccount;

import java.util.List;

public interface UserAccountService {
    UserAccount findUser(Integer id);
    List<UserAccount> findAllUsers();
    UserAccount createUser(UserAccount user);
    public UserAccount updateUserBalance(Integer userId, double newBalance);
}
