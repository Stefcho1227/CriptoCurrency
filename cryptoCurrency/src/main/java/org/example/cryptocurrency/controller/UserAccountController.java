package org.example.cryptocurrency.controller;

import jakarta.validation.Valid;
import org.example.cryptocurrency.dtos.UserInDto;
import org.example.cryptocurrency.mapper.UserMapper;
import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.service.contracts.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserAccountController {
    private final UserAccountService userAccountService;
    private final UserMapper userMapper;
    @Autowired
    UserAccountController(UserAccountService userAccountService, UserMapper userMapper){
        this.userAccountService = userAccountService;
        this.userMapper = userMapper;
    }
    @GetMapping
    public ResponseEntity<List<UserAccount>> getAllUsers() {
        List<UserAccount> userAccounts = userAccountService.findAllUsers();
        return ResponseEntity.ok(userAccounts);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserAccount> getUser(@PathVariable Integer id) {
        UserAccount userAccount = userAccountService.findUser(id);
        return ResponseEntity.ok(userAccount);
    }
    @PostMapping
    public ResponseEntity<UserAccount> createUser(@RequestBody @Valid UserInDto userInDto) {
        UserAccount newUser = userMapper.fromDto(userInDto);
        UserAccount savedUser = userAccountService.createUser(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    @PutMapping("/{id}")
    public ResponseEntity<UserAccount> updateUserBalance(@PathVariable Integer id, @RequestBody @Valid UserInDto userInDto) {
        UserAccount updated = userAccountService.updateUserBalance(id, userInDto.getBalance());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(updated);
    }
}
