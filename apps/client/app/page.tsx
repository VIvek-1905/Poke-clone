export default function BattleArena() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 select-none selection:bg-cyan-500/30">
      {/* Game Header */}
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center px-2">
        <h1 className="text-2xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase">
          Poke-clone <span className="text-xs font-light text-neutral-500 normal-case tracking-normal">Gen 9 Engine</span>
        </h1>
        <div className="flex items-center gap-4 text-sm font-semibold text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Server Connected
          </span>
        </div>
      </div>

      {/* Main High-End Visual Arena Container */}
      <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] flex flex-col h-[640px]">
        
        {/* --- BATTLE FIELD (Top 65%) --- */}
        <div className="flex-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/40 via-neutral-900 to-neutral-950 relative p-8 flex flex-col justify-between overflow-hidden border-b border-neutral-800/80">
          
          {/* Subtle Grid overlay for that futuristic look */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

          {/* Top Row: Enemy HUD & Player Status Summary */}
          <div className="flex justify-between items-start z-10">
            {/* Enemy Status Panel */}
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-4 rounded-xl w-80 shadow-2xl">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-neutral-400 text-xs font-bold tracking-widest uppercase">Opponent</span>
                <span className="text-cyan-400 text-xs font-black tracking-wider uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">Water</span>
              </div>
              <div className="flex justify-between font-extrabold text-lg mb-1 tracking-wide items-baseline">
                <h2 className="uppercase text-white">Blastoise</h2>
                <span className="text-neutral-500 text-sm">Lv. 50</span>
              </div>
              {/* Modern Neon Health Bar */}
              <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden border border-neutral-700/50 flex items-center p-[2px]">
                <div className="bg-gradient-to-r from-emerald-500 to-green-400 w-[100%] h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              </div>
              <div className="flex justify-between items-center mt-1.5 text-xs font-bold text-neutral-400">
                <span className="text-green-400 font-extrabold uppercase">Normal</span>
                <span>100%</span>
              </div>
            </div>

            {/* Empty space/Visual balance or extra battle info */}
            <div className="text-xs text-neutral-600 font-mono tracking-wider">TURN 1</div>
          </div>

          {/* Bottom Row: Player HUD & Action Visuals */}
          <div className="flex justify-between items-end z-10">
            {/* Player Sprite Position Placeholder */}
            <div className="relative flex justify-center items-center w-64 h-48 border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40 hover:border-neutral-700 transition-all group duration-300">
              <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-400 tracking-widest uppercase transition-colors">Player Sprite</span>
            </div>

            {/* Player Status Panel */}
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-4 rounded-xl w-80 shadow-2xl">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-neutral-400 text-xs font-bold tracking-widest uppercase">Player</span>
                <span className="text-orange-400 text-xs font-black tracking-wider uppercase bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Fire</span>
              </div>
              <div className="flex justify-between font-extrabold text-lg mb-1 tracking-wide items-baseline">
                <h2 className="uppercase text-white">Charizard</h2>
                <span className="text-neutral-500 text-sm">Lv. 50</span>
              </div>
              {/* HP Bar */}
              <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden border border-neutral-700/50 flex items-center p-[2px]">
                <div className="bg-gradient-to-r from-emerald-500 to-green-400 w-[100%] h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              </div>
              <div className="flex justify-between items-center mt-1 text-xs font-bold text-neutral-400">
                <span className="text-green-400 font-extrabold uppercase">Healthy</span>
                <span className="text-white tracking-wider">153 / 153</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- CONTROLS / INTERACTION PANEL (Bottom 35%) --- */}
        <div className="h-[224px] bg-neutral-900/50 backdrop-blur-xl p-4 flex gap-4 border-t border-neutral-800/60">
          
          {/* Action Readout Message Box */}
          <div className="flex-1 bg-neutral-950/60 rounded-xl border border-neutral-800 p-4 flex flex-col justify-between shadow-inner">
            <div className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Action Status</div>
            <p className="text-neutral-200 text-xl font-medium leading-relaxed tracking-wide">
              What will <span className="text-orange-400 font-extrabold uppercase">Charizard</span> do?
            </p>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500/80 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
            </div>
          </div>

          {/* Clean Modern Move Grid */}
          <div className="w-[50%] grid grid-cols-2 gap-3">
            <button className="relative bg-gradient-to-br from-neutral-800/80 to-neutral-900 border border-orange-500/30 hover:border-orange-400 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:bg-neutral-800 flex flex-col justify-between shadow-lg group overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-xs font-black text-orange-400 tracking-widest uppercase">Fire</span>
              <span className="text-lg font-bold text-white tracking-wide">Flamethrower</span>
              <span className="text-xs font-medium text-neutral-500 mt-1 uppercase">100% Acc • 90 Pwr</span>
            </button>

            <button className="relative bg-gradient-to-br from-neutral-800/80 to-neutral-900 border border-orange-500/30 hover:border-orange-400 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:bg-neutral-800 flex flex-col justify-between shadow-lg group overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-xs font-black text-orange-400 tracking-widest uppercase">Fire</span>
              <span className="text-lg font-bold text-white tracking-wide">Fire Blast</span>
              <span className="text-xs font-medium text-neutral-500 mt-1 uppercase">85% Acc • 110 Pwr</span>
            </button>

            <button className="relative bg-gradient-to-br from-neutral-800/80 to-neutral-900 border border-neutral-700/80 hover:border-neutral-500 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:bg-neutral-800 flex flex-col justify-between shadow-lg group overflow-hidden active:scale-[0.98]">
              <span className="text-xs font-black text-neutral-400 tracking-widest uppercase">Normal</span>
              <span className="text-lg font-bold text-white tracking-wide">Slash</span>
              <span className="text-xs font-medium text-neutral-500 mt-1 uppercase">100% Acc • 70 Pwr</span>
            </button>

            <button className="relative bg-gradient-to-br from-neutral-800/80 to-neutral-900 border border-yellow-500/30 hover:border-yellow-400 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:bg-neutral-800 flex flex-col justify-between shadow-lg group overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-xs font-black text-yellow-400 tracking-widest uppercase">Electric</span>
              <span className="text-lg font-bold text-white tracking-wide">Thunder Punch</span>
              <span className="text-xs font-medium text-neutral-500 mt-1 uppercase">100% Acc • 75 Pwr</span>
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}