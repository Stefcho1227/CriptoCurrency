package org.example.cryptocurrency.mapper;

import org.example.cryptocurrency.dtos.UserInDto;
import org.example.cryptocurrency.models.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserMapper() {
    }
    public UserAccount fromDto(UserInDto userInDto){
        UserAccount userAccount = new UserAccount();
        userAccount.setUsername(userInDto.getUserName());
        userAccount.setPassword(userInDto.getPassword());
        userAccount.setEmail(userInDto.getEmail());
        return userAccount;
    }
}
