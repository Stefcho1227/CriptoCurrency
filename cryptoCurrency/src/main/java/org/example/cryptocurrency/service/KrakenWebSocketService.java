package org.example.cryptocurrency.service;
import jakarta.annotation.PostConstruct;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

@Service
public class KrakenWebSocketService {

    private WebSocketClient webSocketClient;
    private final Map<String, String> cryptoPrices = new ConcurrentHashMap<>();

    private final String[] pairs = {
            "XBT/USD", "ETH/USD", "XRP/USD", "LTC/USD", "BCH/USD",
            "ADA/USD", "DOT/USD", "LINK/USD", "DOGE/USD", "SOL/USD",
            "MATIC/USD", "UNI/USD", "ICP/USD", "AVAX/USD", "XLM/USD",
            "ETC/USD", "ATOM/USD", "VET/USD", "TRX/USD", "EOS/USD"
    };

    public Map<String, String> getCryptoPrices() {
        return cryptoPrices;
    }

    @PostConstruct
    public void start() {
        try {
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
}

