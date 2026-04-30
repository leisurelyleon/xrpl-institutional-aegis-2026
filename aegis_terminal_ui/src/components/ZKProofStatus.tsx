import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

const ZKProofStatus: React.FC = () => {
  const [proofState, setProofState] = useState<'IDLE' | 'PROVING' | 'VERIFIED'>('IDLE');

  // Simulating the bridge picking up an institutional cross-chain intent
  useEffect(() => {
    const interval = setInterval(() => {
      setProofState('PROVING');
      setTimeout(() => setProofState('VERIFIED'), 2000); // Takes 2 seconds to generate ZK proof
      setTimeout(() => setProofState('IDLE'), 5000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-panel flex flex-col justify-between">
      <h2 className="text-lg tracking-widest font-bold text-zinc-100 mb-4 flex items-center gap-2">
        <ShieldCheck className="text-purple-500" size={20}/>
        ZK-EVM BRIDGE TELEMETRY
      </h2>

      <div className="space-y-4">
        {/* State 1: XRPL Burn Monitoring */}
        <div className="flex items-center gap-4">
          <Activity size={16} className="text-zinc-500" />
          <span className="text-sm text-zinc-400">Mainnet Burn Listener</span>
          <span className="ml-auto text-xs text-emerald-500">ACTIVE</span>
        </div>

        {/* State 2: PLONK Circuit Evaluation */}
        <div className={`flex items-center gap-4 p-3 rounded border ${proofState === 'PROVING' ? 'bg-purple-900/20 border-purple-500/50' : 'border-zinc-800'}`}>
          <Cpu size={16} className={proofState === 'PROVING' ? 'text-purple-400 animate-zk-pulse' : 'text-zinc-600'} />
          <span className={`text-sm ${proofState === 'PROVING' ? 'text-purple-300 font-semibold' : 'text-zinc-500'}`}>
            PLONK State Prover (SNARK)
          </span>
          <span className="ml-auto text-xs font-mono">
            {proofState === 'PROVING' ? 'SYNTHESIZING WITNESS...' : 'IDLE'}
          </span>
        </div>

        {/* State 3: EVM Dispatch */}
        <div className="flex items-center gap-4">
          <div className={`w-2 h-2 rounded-full ${proofState === 'VERIFIED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-700'}`} />
          <span className="text-sm text-zinc-400">Sidechain Dispatcher</span>
          <span className="ml-auto text-xs text-zinc-500 font-mono">
            {proofState === 'VERIFIED' ? 'TX CONFIRMED: 0x7a2...8D' : 'AWAITING PAYLOAD'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ZKProofStatus;
