"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 1. UPGRADED DATA STRUCTURE FOR COMPETITIVE PLAY
interface TeamSlot {
  id: number;
  name: string | null;
  sprite: string | null;
  types: string[];
  baseStats: { name: string; value: number }[];
  ability: string;
  availableAbilities: string[];
  nature: string;
  item: string;
  evs: { [key: string]: number };
  ivs: { [key: string]: number };
  moves: string[];
  availableMoves: string[]; // From the database
}

const DEFAULT_EVS = { hp: 0, attack: 0, defense: 0, "special-attack": 0, "special-defense": 0, speed: 0 };
const DEFAULT_IVS = { hp: 31, attack: 31, defense: 31, "special-attack": 31, "special-defense": 31, speed: 31 };
const COMMON_NATURES = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];

export default function TeamBuilder() {
  const [activeSlot, setActiveSlot] = useState<number>(1);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize the 6 slots with our new complex structure
  const [team, setTeam] = useState<TeamSlot[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: null,
      sprite: null,
      types: [],
      baseStats: [],
      ability: "",
      availableAbilities: [],
      nature: "Serious",
      item: "",
      evs: { ...DEFAULT_EVS },
      ivs: { ...DEFAULT_IVS },
      moves: ["", "", "", ""],
      availableMoves: []
    }))
  );

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
        const data = await res.json();
        setAllPokemonNames(data.results.map((p: any) => p.name));
      } catch (err) {
        console.error("Failed to load Pokemon dictionary.");
      }
    };
    fetchDictionary();
  }, []);

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.length > 0) {
      setSuggestions(allPokemonNames.filter(name => name.startsWith(query)).slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const fetchPokemonData = async (pokemonName: string) => {
    setIsSearching(true);
    setShowSuggestions(false);
    setSearchQuery("");

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      
      // Extract abilities and moves
      const abilities = data.abilities.map((a: any) => a.ability.name);
      const moves = data.moves.map((m: any) => m.move.name).sort();

      // Immediately lock the fetched data into the active slot
      updateActiveSlot({
        name: data.name,
        sprite: data.sprites.front_default || data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        baseStats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
        ability: abilities[0] || "", // Default to first ability
        availableAbilities: abilities,
        availableMoves: moves,
        evs: { ...DEFAULT_EVS },
        ivs: { ...DEFAULT_IVS },
        moves: ["", "", "", ""],
        item: "",
        nature: "Serious"
      });

    } catch (err) {
      alert("Species not recognized.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) fetchPokemonData(searchQuery.trim());
  };

  // Helper to update specific fields on the currently active Pokemon
  const updateActiveSlot = (updates: Partial<TeamSlot>) => {
    setTeam(prev => prev.map(slot => slot.id === activeSlot ? { ...slot, ...updates } : slot));
  };

  const activePokemon = team.find(s => s.id === activeSlot);

  const clearSlot = (id: number) => {
    setTeam(prev => prev.map(slot => slot.id === id ? {
      id, name: null, sprite: null, types: [], baseStats: [], ability: "", availableAbilities: [],
      nature: "Serious", item: "", evs: { ...DEFAULT_EVS }, ivs: { ...DEFAULT_IVS }, moves: ["", "", "", ""], availableMoves: []
    } : slot));
  };

  // Render EV/IV Sliders
  const handleStatChange = (statName: string, type: "evs" | "ivs", value: number) => {
    if (!activePokemon) return;
    const currentStats = { ...activePokemon[type] };
    
    // Quick validation
    if (type === "evs") {
      value = Math.max(0, Math.min(252, value));
      const totalEVs = Object.entries(currentStats).reduce((acc, [k, v]) => acc + (k === statName ? value : v), 0);
      if (totalEVs > 510) return; // Prevent exceeding max EVs
    } else {
      value = Math.max(0, Math.min(31, value));
    }

    currentStats[statName] = value;
    updateActiveSlot({ [type]: currentStats });
  };

  const handleMoveChange = (index: number, moveName: string) => {
    if (!activePokemon) return;
    const newMoves = [...activePokemon.moves];
    newMoves[index] = moveName;
    updateActiveSlot({ moves: newMoves });
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col p-6 select-none font-sans text-slate-900">
      
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <Link href="/" className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center gap-2 mb-2">
            ← Return to Portal
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Team Builder</h1>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded-sm uppercase tracking-wider outline-none cursor-pointer shadow-sm">
            <option value="vgc_reg_f">VGC Regulation F</option>
            <option value="ou">Smogon OU</option>
            <option value="national_dex">National Dex AG</option>
          </select>
          <button className="bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold px-6 py-2 rounded-sm uppercase tracking-wider transition-all shadow-sm">
            Validate & Save
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex gap-6 h-[750px]">
        
        {/* Left Sidebar */}
        <div className="w-1/4 flex flex-col gap-3">
          {team.map((slot, index) => (
            <div key={slot.id} className="relative group flex-1">
              <button
                onClick={() => setActiveSlot(slot.id)}
                className={`w-full h-full text-left rounded border p-3 flex items-center gap-4 transition-all ${
                  activeSlot === slot.id ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500" : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                  {slot.sprite ? <img src={slot.sprite} alt={slot.name || ""} className="w-16 h-16 object-contain" /> : <span className="text-slate-300 text-2xl font-black">+</span>}
                </div>
                <div className="flex flex-col items-start overflow-hidden w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slot 0{index + 1}</span>
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wide truncate w-full">{slot.name || "Empty"}</span>
                  {slot.item && <span className="text-[9px] text-indigo-500 font-bold uppercase truncate w-full">@ {slot.item}</span>}
                </div>
              </button>
              {slot.name && (
                <button onClick={() => clearSlot(slot.id)} className="absolute -right-2 -top-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">✕</button>
              )}
            </div>
          ))}
        </div>

        {/* Right Area: The Configuration Editor */}
        <div className="w-3/4 bg-white border border-slate-200 rounded shadow-sm flex flex-col overflow-hidden">
          
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center z-20">
            <h2 className="text-sm font-black uppercase text-slate-800 tracking-wider">Configuring Slot 0{activeSlot}</h2>
            
            <form onSubmit={handleSearchSubmit} className="flex gap-2 relative">
              <div className="relative">
                <input 
                  type="text" placeholder="Search Species..." value={searchQuery} onChange={handleType}
                  onFocus={() => { if(searchQuery.length > 0) setShowSuggestions(true) }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="border border-slate-300 rounded-sm px-3 py-1.5 text-xs font-bold outline-none focus:border-indigo-500 uppercase w-56"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 shadow-lg rounded-sm overflow-hidden">
                    {suggestions.map((sug) => (
                      <div key={sug} onClick={() => fetchPokemonData(sug)} className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer uppercase tracking-wider border-b border-slate-100 last:border-0">{sug}</div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={isSearching} className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider">
                {isSearching ? "..." : "Fetch"}
              </button>
            </form>
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-white relative">
            {!activePokemon?.name ? (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Search a species to begin configuration.</p>
              </div>
            ) : (
              <div className="flex gap-8 h-full animate-in fade-in duration-300">
                
                {/* Left Column: Sprite, Item, Ability, Nature, Moves */}
                <div className="w-1/3 flex flex-col gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 flex flex-col items-center shadow-sm">
                    <img src={activePokemon.sprite!} alt={activePokemon.name!} className="w-32 h-32 object-contain drop-shadow-md mb-2" />
                    <h3 className="text-2xl font-black uppercase tracking-widest text-slate-800">{activePokemon.name}</h3>
                    <div className="flex gap-1 mt-2">
                      {activePokemon.types.map(t => <span key={t} className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">{t}</span>)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Held Item</label>
                      <input type="text" placeholder="e.g. Leftovers" value={activePokemon.item} onChange={(e) => updateActiveSlot({ item: e.target.value })} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500 uppercase" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Ability</label>
                      <select value={activePokemon.ability} onChange={(e) => updateActiveSlot({ ability: e.target.value })} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500 uppercase cursor-pointer">
                        {activePokemon.availableAbilities.map(a => <option key={a} value={a}>{a.replace('-', ' ')}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nature</label>
                      <select value={activePokemon.nature} onChange={(e) => updateActiveSlot({ nature: e.target.value })} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500 uppercase cursor-pointer">
                        {COMMON_NATURES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mt-2 border-t border-slate-200 pt-4 flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Moveset</label>
                    {[0, 1, 2, 3].map(index => (
                      <select key={index} value={activePokemon.moves[index]} onChange={(e) => handleMoveChange(index, e.target.value)} className="w-full border border-slate-300 rounded-sm px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500 uppercase cursor-pointer bg-slate-50">
                        <option value="">- Select Move -</option>
                        {activePokemon.availableMoves.map(m => <option key={m} value={m}>{m.replace('-', ' ')}</option>)}
                      </select>
                    ))}
                  </div>
                </div>

                {/* Right Column: EV / IV Configuration Matrix */}
                <div className="w-2/3 bg-slate-50 border border-slate-200 rounded p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Stat Distribution</h3>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      EVs Remaining: <span className="text-indigo-600">{510 - Object.values(activePokemon.evs).reduce((a, b) => a + b, 0)}</span>
                    </div>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    <div className="col-span-3">Stat</div>
                    <div className="col-span-1 text-center">Base</div>
                    <div className="col-span-4 text-center">EV Slider (0-252)</div>
                    <div className="col-span-2 text-center">EVs</div>
                    <div className="col-span-2 text-center">IVs (31)</div>
                  </div>

                  {/* Stat Rows */}
                  <div className="flex flex-col gap-3">
                    {activePokemon.baseStats.map((stat) => (
                      <div key={stat.name} className="grid grid-cols-12 gap-2 items-center bg-white border border-slate-200 p-2 rounded-sm shadow-sm">
                        <div className="col-span-3 text-[10px] font-black uppercase text-slate-700 truncate">{stat.name.replace('-', ' ')}</div>
                        <div className="col-span-1 text-xs font-bold text-slate-500 text-center">{stat.value}</div>
                        
                        {/* EV Slider */}
                        <div className="col-span-4 flex items-center">
                          <input 
                            type="range" min="0" max="252" step="4" 
                            value={activePokemon.evs[stat.name]} 
                            onChange={(e) => handleStatChange(stat.name, "evs", parseInt(e.target.value))}
                            className="w-full accent-indigo-600 cursor-pointer"
                          />
                        </div>

                        {/* EV Number Input */}
                        <div className="col-span-2">
                          <input 
                            type="number" min="0" max="252" 
                            value={activePokemon.evs[stat.name]} 
                            onChange={(e) => handleStatChange(stat.name, "evs", parseInt(e.target.value))}
                            className="w-full border border-slate-300 rounded-sm text-center py-1 text-xs font-bold outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* IV Number Input */}
                        <div className="col-span-2">
                          <input 
                            type="number" min="0" max="31" 
                            value={activePokemon.ivs[stat.name]} 
                            onChange={(e) => handleStatChange(stat.name, "ivs", parseInt(e.target.value))}
                            className="w-full border border-slate-300 rounded-sm text-center py-1 text-xs font-bold outline-none focus:border-indigo-500 bg-slate-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}