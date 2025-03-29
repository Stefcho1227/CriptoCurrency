package org.example.cryptocurrency.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.example.cryptocurrency.dtos.LogInDto;
import org.example.cryptocurrency.dtos.RegisterDto;
import org.example.cryptocurrency.exceptions.AuthenticationFailureException;
import org.example.cryptocurrency.exceptions.DuplicateEntityException;
import org.example.cryptocurrency.exceptions.EmailException;
import org.example.cryptocurrency.helpers.AuthenticationHelper;
import org.example.cryptocurrency.mapper.UserMapper;
import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.service.contracts.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserMapper userMapper;
    private final UserAccountService userService;
    private final AuthenticationHelper authenticationHelper;

    @Autowired
    public AuthController(UserMapper userMapper, UserAccountService userService, AuthenticationHelper authenticationHelper) {
        this.userMapper = userMapper;
        this.userService = userService;
        this.authenticationHelper = authenticationHelper;
    }

    @GetMapping("/login")
    public ResponseEntity<?> getLoginInfo() {
        return ResponseEntity.ok("Please POST your credentials to /api/auth/login to login.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> handleLogin(@Valid @RequestBody LogInDto loginDto,
                                         BindingResult bindingResult,
                                         HttpSession session) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(bindingResult.getAllErrors());
        }
        try {
            UserAccount user = authenticationHelper.throwIfWrongAuthentication(
                    loginDto.getUsername(), loginDto.getPassword());
            session.setAttribute("currentUser", user);
            session.setAttribute("userId", user.getUserId());
            return ResponseEntity.ok(user);
        } catch (AuthenticationFailureException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/register")
    public ResponseEntity<?> getRegisterInfo() {
        return ResponseEntity.ok("Please POST your registration details to /api/auth/register.");
    }

    @PostMapping("/register")
    public ResponseEntity<?> handleRegister(@Valid @RequestBody RegisterDto registerDto,
                                            BindingResult bindingResult,
                                            HttpSession session) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(bindingResult.getAllErrors());
        }
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Passwords should match.");
        }
        try {
            UserAccount user = userMapper.fromRegisterDto(registerDto);
            userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (DuplicateEntityException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (EmailException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully.");
    }
}
