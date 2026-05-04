"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface TeamSlot {
  id: number;
  name: string | null;
  sprite: string | null;
  types: string[];
}

export default function TeamBuilder() {
  const [activeSlot, setActiveSlot] = useState<number>(1);
  
  // Search & Autocomplete State
  const [searchQuery, setSearchQuery] = useState("");
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState("");

  const [team, setTeam] = useState<TeamSlot[]>([
    { id: 1, name: null, sprite: null, types: [] },
    { id: 2, name: null, sprite: null, types: [] },
    { id: 3, name: null, sprite: null, types: [] },
    { id: 4, name: null, sprite: null, types: [] },
    { id: 5, name: null, sprite: null, types: [] },
    { id: 6, name: null, sprite: null, types: [] },
  ]);

  // 1. Fetch the master list of names ONCE when the page loads
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

  // 2. Filter the dictionary every time the user types a letter
  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.length > 0) {
      const matches = allPokemonNames.filter(name => name.startsWith(query)).slice(0, 5); // Show top 5 matches
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // 3. Fetch the actual stats when a name is submitted or clicked
  const fetchPokemonData = async (pokemonName: string) => {
    setIsSearching(true);
    setSearchError("");
    setSearchResult(null);
    setShowSuggestions(false); // Hide the dropdown
    setSearchQuery(pokemonName);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!res.ok) throw new Error("Database match not found.");
      
      const data = await res.json();
      setSearchResult({
        name: data.name,
        sprite: data.sprites.front_default || data.sprites.other['official-artwork'].front_default,
        types: data.types.map((t: any) => t.type.name),
        stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat }))
      });
    } catch (err) {
      setSearchError("Species not recognized.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) fetchPokemonData(searchQuery.trim());
  };

  const equipToSlot = () => {
    if (!searchResult) return;
    const updatedTeam = team.map((slot) => {
      if (slot.id === activeSlot) return { ...slot, name: searchResult.name, sprite: searchResult.sprite, types: searchResult.types };
      return slot;
    });
    setTeam(updatedTeam);
    setSearchResult(null);
    setSearchQuery("");
  };

  const clearSlot = (id: number) => {
    setTeam(team.map(slot => slot.id === id ? { id, name: null, sprite: null, types: [] } : slot));
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col p-6 select-none font-sans text-slate-900">
      
      <div className="w-full max-w-6xl mx-auto mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <Link href="/" className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center gap-2 mb-2">
            ← Return to Portal
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Team Builder</h1>
        </div>
        <div className="flex gap-3">
          {/* Format Selector Placeholder */}
          <select className="bg-white border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded-sm uppercase tracking-wider outline-none cursor-pointer">
            <option value="vgc_reg_f">VGC Regulation F</option>
            <option value="ou">Smogon OU</option>
            <option value="national_dex">National Dex AG</option>
          </select>
          <button className="bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold px-6 py-2 rounded-sm uppercase tracking-wider transition-all shadow-sm">
            Validate & Save
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex gap-6 h-[700px]">
        
        <div className="w-1/4 flex flex-col gap-3">
          {team.map((slot, index) => (
            <div key={slot.id} className="relative group">
              <button
                onClick={() => setActiveSlot(slot.id)}
                className={`w-full text-left rounded border p-3 flex items-center gap-4 transition-all ${
                  activeSlot === slot.id ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500" : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center overflow-hidden border border-slate-200">
                  {slot.sprite ? <img src={slot.sprite} alt={slot.name || ""} className="w-16 h-16 object-contain" /> : <span className="text-slate-300 text-2xl font-black">+</span>}
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slot 0{index + 1}</span>
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wide truncate w-full">{slot.name || "Empty"}</span>
                </div>
              </button>
              {slot.name && (
                <button onClick={() => clearSlot(slot.id)} className="absolute -right-2 -top-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="w-3/4 bg-white border border-slate-200 rounded shadow-sm flex flex-col">
          
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center relative">
            <h2 className="text-sm font-black uppercase text-slate-800 tracking-wider">Configuring Slot 0{activeSlot}</h2>
            
            <form onSubmit={handleSearchSubmit} className="flex gap-2 relative">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search Database..." 
                  value={searchQuery}
                  onChange={handleType}
                  onFocus={() => { if(searchQuery.length > 0) setShowSuggestions(true) }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay so clicks register
                  className="border border-slate-300 rounded-sm px-3 py-1.5 text-xs font-bold outline-none focus:border-indigo-500 uppercase w-56"
                />
                
                {/* AUTOCOMPLETE DROPDOWN */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 shadow-lg rounded-sm z-50 overflow-hidden">
                    {suggestions.map((sug) => (
                      <div 
                        key={sug} 
                        onClick={() => fetchPokemonData(sug)}
                        className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer uppercase tracking-wider border-b border-slate-100 last:border-0"
                      >
                        {sug}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={isSearching} className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider">
                {isSearching ? "..." : "Fetch"}
              </button>
            </form>
          </div>

          <div className="p-8 flex-1 flex flex-col items-center justify-center">
            {searchError && <div className="bg-red-50 text-red-600 px-4 py-2 border border-red-200 text-xs font-bold uppercase tracking-wider rounded-sm mb-4">{searchError}</div>}
            {!searchResult && !isSearching && <div className="text-center opacity-40"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Query a species to begin configuration.</p></div>}

            {searchResult && (
              <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded p-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <img src={searchResult.sprite} alt={searchResult.name} className="w-32 h-32 object-contain mb-4 drop-shadow-md" />
                <h3 className="text-2xl font-black uppercase tracking-widest text-slate-800 mb-2">{searchResult.name}</h3>
                <div className="flex gap-2 mb-6">
                  {searchResult.types.map((type: string) => (
                    <span key={type} className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-slate-300">{type}</span>
                  ))}
                </div>
                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 mb-6 text-xs border-t border-slate-200 pt-4">
                  {searchResult.stats.map((stat: any) => (
                    <div key={stat.name} className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">{stat.name.replace('-', ' ')}</span>
                      <span className="font-black text-slate-700">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={equipToSlot} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-sm uppercase tracking-widest text-xs shadow-sm transition-all">
                  Equip to Slot 0{activeSlot}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}