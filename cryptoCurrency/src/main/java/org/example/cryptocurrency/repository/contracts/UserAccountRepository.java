package org.example.cryptocurrency.repository.contracts;

import org.example.cryptocurrency.models.UserAccount;

import java.util.List;

public interface UserAccountRepository {
    UserAccount findById(Integer userId);
    List<UserAccount> findAll();
    UserAccount save(UserAccount user);
    void delete(Integer userId);

}
