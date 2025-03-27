package org.example.cryptocurrency.controller;

import jakarta.validation.Valid;
import org.example.cryptocurrency.dtos.CryptoInDto;
import org.example.cryptocurrency.mapper.CryptoMapper;
import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.service.contracts.CryptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cryptos")
public class CryptoController {

    private final CryptoService cryptoService;
    private final CryptoMapper cryptoMapper;

    @Autowired
    public CryptoController(CryptoService cryptoService, CryptoMapper cryptoMapper) {
        this.cryptoService = cryptoService;
        this.cryptoMapper = cryptoMapper;
    }

    @GetMapping
    public List<Crypto> getAllCryptos() {
        return cryptoService.getAll();
    }

    @GetMapping("/{id}")
    public Crypto getCryptoById(@PathVariable Integer id) {
        return cryptoService.getById(id);
    }
    @GetMapping("/symbol/{symbol}")
    public Crypto getCryptoBySymbol(@PathVariable String symbol) {
        return cryptoService.getBySymbol(symbol);
    }

    @PostMapping
    public ResponseEntity<Crypto> createCrypto(@RequestBody @Valid CryptoInDto cryptoInDto) {
        Crypto newCrypto = cryptoMapper.fromDto(cryptoInDto);
        Crypto created = cryptoService.create(newCrypto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{symbol}")
    public ResponseEntity<Crypto> updateCrypto(@PathVariable String symbol, @RequestBody @Valid CryptoInDto cryptoInDto) {
        Crypto updated = cryptoService.update(symbol, cryptoInDto.getName(), cryptoInDto.getCurrentPrice());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(updated);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCrypto(@PathVariable Integer id) {
        cryptoService.deleteCrypto(id);
        return ResponseEntity.ok("Crypto " + id + " deleted successfully.");
    }
}
