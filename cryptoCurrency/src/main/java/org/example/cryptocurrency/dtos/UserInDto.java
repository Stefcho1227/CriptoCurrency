package org.example.cryptocurrency.dtos;

import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class UserInDto {
    @Size(min = 2, max = 50, message = "Username should be between 2 and 50 characters long")
    private String userName;
    private BigDecimal balance;
    public UserInDto() {
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
