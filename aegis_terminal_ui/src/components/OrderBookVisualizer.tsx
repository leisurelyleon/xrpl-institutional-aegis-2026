import React from 'react';
import { useXrplWebsocket } from '../hooks/useXrplWebsocket';

const OrderBookVisualizer: React.FC = () => {
  const { orderBook, isConnected } = useXrplWebsocket();

  return (
    <div className="terminal-panel h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
        <h2 className="text-xl tracking-widest font-bold text-zinc-100">
          RLUSD / XRP <span className="text-xs text-zinc-500 font-normal ml-2">XRPL DEX NATIVE</span>
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <span className={isConnected ? "text-emerald-500" : "text-rose-500"}>●</span>
          {isConnected ? "WSS CONNECTED" : "RECONNECTING..."}
        </div>
      </div>

      <div className="grid grid-cols-3 text-xs text-zinc-500 pb-2 font-semibold">
        <span>PRICE (RLUSD)</span>
        <span className="text-right">VOLUME (XRP)</span>
        <span className="text-right">TOTAL (RLUSD)</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {orderBook.map((order, idx) => (
          <div key={idx} className="data-row text-sm">
            <span className={order.type === 'BID' ? 'text-bid' : 'text-ask'}>
              {order.price.toFixed(4)}
            </span>
            <span className="text-right text-zinc-300">
              {order.volume.toLocaleString()}
            </span>
            <span className="text-right text-zinc-400">
              {(order.price * order.volume).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
        
        {/* Placeholder if WebSocket is loading */}
        {orderBook.length === 0 && (
          <div className="flex items-center justify-center h-40 text-zinc-600 animate-pulse">
            AWAITING LIQUIDITY POOL DATA...
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderBookVisualizer;
