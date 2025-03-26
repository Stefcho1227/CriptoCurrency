package org.example.cryptocurrency.controller;

import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.service.contracts.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserAccountController {
    private final UserAccountService userAccountService;
    @Autowired
    UserAccountController(UserAccountService userAccountService){
        this.userAccountService = userAccountService;
    }
    @GetMapping
    public List<UserAccount> getAllUsers() {
        return userAccountService.findAllUsers();
    }
    @GetMapping("/{id}")
    public UserAccount getUser(@PathVariable Integer id) {
        return userAccountService.findUser(id);
    }
    @PostMapping
    public ResponseEntity<UserAccount> createUser() {
        UserAccount newUser = new UserAccount();
        UserAccount savedUser = userAccountService.createUser(newUser);
        return ResponseEntity.ok(savedUser);
    }
}
