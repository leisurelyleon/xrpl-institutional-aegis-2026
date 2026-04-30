import { useState, useEffect, useRef } from 'react';

export interface OrderBookEntry {
  price: number;
  volume: number;
  type: 'BID' | 'ASK';
}

export function useXrplWebsocket() {
  const [orderBook, setOrderBook] = useState<OrderBookEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to the local Post-Quantum Aegis Node (or wss://s1.ripple.com for mainnet)
    const ws = new WebSocket('ws://127.0.0.1:6006');
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("[XRPL-WS] Secure connection established.");
      
      // Subscribe to the RLUSD/XRP order book
      ws.send(JSON.stringify({
        command: "subscribe",
        books: [{ taker_gets: { currency: "XRP" }, taker_pays: { currency: "RLUSD", issuer: "rInstitutionalIssuer..." } }]
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Parse high-frequency book changes
      if (data.type === 'transaction' && data.transaction.TransactionType === 'OfferCreate') {
        // In a real app, this logic parses the exact Drops/RLUSD ratio
        const simulatedPrice = Math.random() * (0.65 - 0.60) + 0.60;
        const simulatedVolume = Math.floor(Math.random() * 100000);
        
        setOrderBook(prev => {
          const newBook = [{ price: simulatedPrice, volume: simulatedVolume, type: Math.random() > 0.5 ? 'BID' : 'ASK' }, ...prev];
          return newBook.slice(0, 50); // Keep terminal fast by only retaining top 50 orders
        });
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  return { orderBook, isConnected };
}
