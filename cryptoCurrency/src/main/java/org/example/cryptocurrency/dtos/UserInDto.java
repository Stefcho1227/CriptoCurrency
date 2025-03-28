package org.example.cryptocurrency.dtos;

import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class UserInDto {
    @Size(min = 2, max = 50, message = "Username should be between 2 and 50 characters long")
    private String userName;
    private BigDecimal balance;
    @Size(min = 8, max = 30, message = "Password should be between 8 and 30 characters long")
    private String password;
    @Size(min = 20, max = 50, message = "Email should be between 20 and 50 characters long")
    private String email;
    public UserInDto() {
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
