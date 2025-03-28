package org.example.cryptocurrency.controller;

import jakarta.validation.Valid;
import org.example.cryptocurrency.dtos.CryptoInDto;
import org.example.cryptocurrency.mapper.CryptoMapper;
import org.example.cryptocurrency.models.Crypto;
import org.example.cryptocurrency.service.KrakenWebSocketService;
import org.example.cryptocurrency.service.contracts.CryptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cryptos")
@CrossOrigin(origins = "http://localhost:5173")
public class CryptoController {

    private final CryptoService cryptoService;
    private final CryptoMapper cryptoMapper;

    @Autowired
    public CryptoController(CryptoService cryptoService, CryptoMapper cryptoMapper) {
        this.cryptoService = cryptoService;
        this.cryptoMapper = cryptoMapper;
    }

    @GetMapping
    public ResponseEntity<List<Crypto>> getAllCryptos() {
        List<Crypto> cryptos = cryptoService.getAll();
        return ResponseEntity.ok(cryptos);
    }
    @GetMapping("/top20")
    public ResponseEntity<Map<String, String>> getTop20Prices() {
        Map<String, String> top20Prices = cryptoService.getTop20();
        return ResponseEntity.ok(top20Prices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Crypto> getCryptoById(@PathVariable Integer id) {
        Crypto crypto = cryptoService.getById(id);
        return ResponseEntity.ok(crypto);
    }

    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<Crypto> getCryptoBySymbol(@PathVariable String symbol) {
        Crypto crypto = cryptoService.getBySymbol(symbol);
        return ResponseEntity.ok(crypto);
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
