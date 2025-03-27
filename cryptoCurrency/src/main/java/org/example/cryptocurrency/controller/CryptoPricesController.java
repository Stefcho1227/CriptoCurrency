package org.example.cryptocurrency.controller;

import org.example.cryptocurrency.service.KrakenWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cryptos")
public class CryptoPricesController {

    private final KrakenWebSocketService krakenWebSocketService;

    @Autowired
    public CryptoPricesController(KrakenWebSocketService krakenWebSocketService) {
        this.krakenWebSocketService = krakenWebSocketService;
    }

    @GetMapping("/prices")
    public ResponseEntity<?> getCryptoPrices() {
        return ResponseEntity.ok(krakenWebSocketService.getCryptoPrices());
    }
}
