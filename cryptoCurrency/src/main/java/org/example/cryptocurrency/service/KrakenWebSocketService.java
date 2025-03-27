package org.example.cryptocurrency.service;
import jakarta.annotation.PostConstruct;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.web.client.RestTemplate;

@Service
public class KrakenWebSocketService {

    private WebSocketClient webSocketClient;
    private final Map<String, String> cryptoPrices = new ConcurrentHashMap<>();
    private List<String> pairs = new ArrayList<>();

    private RestTemplate restTemplate;
    @Autowired
    public KrakenWebSocketService(RestTemplate restTemplate){
        this.restTemplate = restTemplate;
    }

    public Map<String, String> getCryptoPrices() {
        return cryptoPrices;
    }
    public Map<String, String> getTop20(){
        return cryptoPrices.entrySet().stream().sorted((e1, e2) -> {
            BigDecimal price1 = new BigDecimal(e1.getValue());
            BigDecimal price2 = new BigDecimal(e2.getValue());
            return price2.compareTo(price1);
        })
                .limit(20).collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (old, newVal) -> old,
                        LinkedHashMap::new
                ));
    }

    @PostConstruct
    public void start() {
        try {
            this.pairs = fetchAllWsNamesFromKraken();
            webSocketClient = new WebSocketClient(new URI("wss://ws.kraken.com")) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    System.out.println("Connected to Kraken WebSocket");
                    JSONObject subscribeMessage = new JSONObject();
                    subscribeMessage.put("event", "subscribe");
                    subscribeMessage.put("subscription", new JSONObject().put("name", "ticker"));
                    JSONArray pairArray = new JSONArray();
                    for (String pair : pairs) {
                        pairArray.put(pair);
                    }
                    subscribeMessage.put("pair", pairArray);

                    send(subscribeMessage.toString());
                }

                @Override
                public void onMessage(String message) {
                    if (message.startsWith("[")) {
                        JSONArray jsonArray = new JSONArray(message);
                        if (jsonArray.length() >= 4) {
                            String pair = jsonArray.getString(3);
                            JSONObject tickerData = jsonArray.getJSONObject(1);
                            if (tickerData.has("c")) {
                                JSONArray lastTrade = tickerData.getJSONArray("c");
                                String price = lastTrade.getString(0);
                                cryptoPrices.put(pair, price);
                            }
                        }
                    } else {
                        System.out.println("Received: " + message);
                    }
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    System.out.println("WebSocket closed: " + reason);
                }

                @Override
                public void onError(Exception ex) {
                    ex.printStackTrace();
                }
            };
            webSocketClient.connect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private List<String> fetchAllWsNamesFromKraken() {
        String url = "https://api.kraken.com/0/public/AssetPairs";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to fetch asset pairs from Kraken");
        }

        List<String> wsNames = new ArrayList<>();
        try {
            JSONObject json = new JSONObject(response.getBody());
            JSONObject result = json.getJSONObject("result");
            for (String key : result.keySet()) {
                JSONObject pairObj = result.getJSONObject(key);
                if (pairObj.has("wsname")) {
                    String wsname = pairObj.getString("wsname");
                    if(wsname.endsWith("/USD")){
                        wsNames.add(wsname);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return wsNames;
    }
}

