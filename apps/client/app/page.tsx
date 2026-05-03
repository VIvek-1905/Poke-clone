"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutTrainer } from "./login/actions";

const PRESETS = {
  nature: {
    name: "Nature Stadium",
    bg: "url('/backgrounds/nature.jpg')",
    text: "text-emerald-950",
    cardBg: "bg-white/90"
  },
  cyber: {
    name: "Neon Cyber",
    bg: "url('/backgrounds/cyber.jpg')",
    text: "text-indigo-950",
    cardBg: "bg-white/85"
  },
  sunset: {
    name: "Sunset Coast",
    bg: "url('/backgrounds/sunset.jpg')",
    text: "text-orange-950",
    cardBg: "bg-white/85"
  }
};

export default function HomePortal() {
  const [theme, setTheme] = useState<string>("nature");
  const [customBg, setCustomBg] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    const savedCustom = localStorage.getItem("custom-bg");
    if (savedTheme && PRESETS[savedTheme as keyof typeof PRESETS]) {
      setTheme(savedTheme);
    }
    if (savedCustom) {
      setCustomBg(savedCustom);
    }
  }, []);

  const changeTheme = (themeKey: string) => {
    setTheme(themeKey);
    setCustomBg(null);
    localStorage.setItem("app-theme", themeKey);
    localStorage.removeItem("custom-bg");
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomBg(base64String);
        localStorage.setItem("custom-bg", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const backgroundStyle = customBg 
    ? { backgroundImage: `url(${customBg})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundImage: PRESETS[theme as keyof typeof PRESETS]?.bg || "none", backgroundSize: "cover", backgroundPosition: "center" };

  const activePreset = PRESETS[theme as keyof typeof PRESETS] || PRESETS.nature;

  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center p-6 select-none font-sans transition-all duration-300 relative"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[1px] pointer-events-none"></div>

      {/* Header Panel */}
      <div className={`w-full max-w-5xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 z-10 ${activePreset.text}`}>
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 bg-clip-text text-transparent uppercase flex items-center gap-3">
            Poke-clone <span className="text-xs font-bold px-2.5 py-1 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-sm tracking-normal normal-case shadow-sm text-slate-800">v1.0-alpha</span>
          </h1>
          <p className="font-semibold text-xs mt-1 mb-4 tracking-wider uppercase opacity-75">Competitive Battle Client</p>
          
          {/* LOGOUT BUTTON */}
          <button 
            onClick={async () => {
              await logoutTrainer();
              router.push("/login");
            }}
            className="inline-flex items-center justify-center bg-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-700 text-[10px] font-bold px-4 py-2 rounded-sm uppercase tracking-widest transition-all shadow-sm border border-slate-300"
          >
            Disconnect Session ⏏
          </button>
        </div>

        {/* Customization controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 p-2.5 rounded shadow-sm w-full md:w-auto">
          <div className="flex items-center gap-1.5 w-full justify-between sm:justify-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1">Client Theme:</span>
            {Object.keys(PRESETS).map((p) => (
              <button 
                key={p} 
                onClick={() => changeTheme(p)}
                className={`text-[10px] px-2.5 py-1.5 rounded-sm font-bold uppercase tracking-wider border transition-all ${
                  theme === p && !customBg 
                  ? "bg-indigo-700 text-white border-indigo-600 shadow-sm" 
                  : "bg-white/60 text-slate-700 hover:bg-white border-slate-200"
                }`}
              >
                {PRESETS[p as keyof typeof PRESETS].name.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="h-px sm:h-5 w-full sm:w-px bg-slate-200"></div>

          <label className="text-[10px] font-bold bg-white/60 hover:bg-white text-slate-700 px-3 py-1.5 rounded-sm border border-slate-200 cursor-pointer uppercase tracking-wider transition-all hover:shadow-sm w-full sm:w-auto text-center">
            Upload Wallpaper
            <input type="file" accept="image/*" onChange={handleCustomBgUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Primary Grid Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 z-10">
        
        {/* Card 1: Matchmaking */}
        <div className={`${activePreset.cardBg} backdrop-blur-sm border border-slate-200/60 p-6 rounded flex flex-col justify-between h-64 transition-all hover:shadow-md group relative overflow-hidden`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">Ranked Matchmaking</span>
              <span className="text-slate-400 font-mono text-[10px] font-bold tracking-wider">STATUS: ONLINE</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide group-hover:text-indigo-700 transition-colors">Battle Arena</h2>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed font-medium">
              Join immediate matches across standard competitive regulation formats utilizing randomized or custom battle squads.
            </p>
          </div>
          <Link href="/battle" className="mt-4 bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-3 rounded-sm text-center transition-all uppercase tracking-wider text-xs shadow-sm">
            Find Match
          </Link>
        </div>

        {/* Card 2: Teambuilder */}
        <div className={`${activePreset.cardBg} backdrop-blur-sm border border-slate-200/60 p-6 rounded flex flex-col justify-between h-64 transition-all hover:shadow-md group relative overflow-hidden`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">Strategy Configuration</span>
              <span className="text-slate-400 font-mono text-[10px] font-bold tracking-wider">SHARED INSTANCE</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide group-hover:text-blue-700 transition-colors">Team Builder</h2>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed font-medium">
              Construct and modify battle-ready squads. Select custom abilities, items, EVs/IVs, movesets, and Tera classifications.
            </p>
          </div>
          <Link href="/teambuilder" className="mt-4 bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-sm text-center transition-all uppercase tracking-wider text-xs shadow-sm">
            Construct Squad
          </Link>
        </div>

        {/* Card 3: Chat Room */}
        <div className={`${activePreset.cardBg} backdrop-blur-sm border border-slate-200/60 p-6 rounded flex flex-col justify-between h-64 transition-all hover:shadow-md group relative overflow-hidden`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase">Social Relay</span>
              <span className="text-slate-400 font-mono text-[10px] font-bold tracking-wider">PUBLIC LOBBY</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide group-hover:text-purple-700 transition-colors">Chat Room</h2>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed font-medium">
              Collaborate and network directly with other trainers within the centralized public lobby.
            </p>
          </div>
          <Link href="/chat" className="mt-4 bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 rounded-sm text-center transition-all uppercase tracking-wider text-xs shadow-sm">
            Join Channels
          </Link>
        </div>

      </div>
    </main>
  );
}