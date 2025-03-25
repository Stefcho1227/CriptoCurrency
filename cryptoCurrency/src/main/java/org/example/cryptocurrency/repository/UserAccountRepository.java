package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Integer> {

}
