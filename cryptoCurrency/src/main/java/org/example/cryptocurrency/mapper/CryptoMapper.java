package org.example.cryptocurrency.mapper;

import org.example.cryptocurrency.dtos.CryptoInDto;
import org.example.cryptocurrency.dtos.UserInDto;
import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.models.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class CryptoMapper {
    public CryptoMapper() {
    }
    public Crypto fromDto(CryptoInDto cryptoInDto){
        Crypto crypto = new Crypto();
        crypto.setName(cryptoInDto.getName());
        crypto.setSymbol(cryptoInDto.getSymbol());
        crypto.setCurrentPrice(cryptoInDto.getCurrentPrice());
        return crypto;
    }
}
