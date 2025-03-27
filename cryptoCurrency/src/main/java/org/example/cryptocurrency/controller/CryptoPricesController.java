package org.example.cryptocurrency.controller;

import org.example.cryptocurrency.service.KrakenWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/kraken")
public class CryptoPricesController {
    private final KrakenWebSocketService krakenWebSocketService;

    @Autowired
    public CryptoPricesController(KrakenWebSocketService krakenWebSocketService) {
        this.krakenWebSocketService = krakenWebSocketService;
    }

    @GetMapping("/prices")
    public Map<String, String> getCryptoPrices() {
        return krakenWebSocketService.getCryptoPrices();
    }
    @GetMapping("/prices/top20")
    public Map<String, String> getTop20Prices() {
        return krakenWebSocketService.getTop20();
    }
}
