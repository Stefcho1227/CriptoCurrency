package org.example.cryptocurrency.service;

import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.repository.contracts.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserAccountRepository userAccountRepository;
    @Autowired
    UserDetailsServiceImpl(UserAccountRepository userAccountRepository){
        this.userAccountRepository = userAccountRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount userAccount = userAccountRepository.findByUsername(username);
        if(userAccount == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found user with username: " + username);
        }
        return User.builder()
                .username(userAccount.getUsername())
                .password(userAccount.getPassword())
                .build();
    }
}
