"use client";

import { useState } from "react";
import Link from "next/link";

// custom Elo-based Title Generator
function getPlayerTitle(rating: number, leaderboardRank: number | null) {
  // Leaderboard specific titles (Requires 2100+ rating)
  if (rating >= 2100 && leaderboardRank !== null && leaderboardRank <= 1000) {
    if (leaderboardRank === 1) return "World Champion";
    if (leaderboardRank <= 20) return "Royalty";
    if (leaderboardRank <= 100) return "High Ranker";
    return "Low Ranker";
  }
  
  // Standard Elo Titles
  if (rating >= 1800) return "Master";
  if (rating >= 1600) return "Expert";
  if (rating >= 1400) return "Seasoned";
  if (rating >= 1200) return "Decent Enough";
  if (rating >= 1000) return "Newbie";
  if (rating >= 500) return "Mehhh";
  return "Lmao you should quit";
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // States to simulate logging in and seeing your fetched profile
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mockRating, setMockRating] = useState(1000);
  const [mockRank, setMockRank] = useState<number | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulating fetching a high-ranked player from the database just for testing
    // Change these numbers to test the different titles!
    setMockRating(2250); 
    setMockRank(14); 

    setIsLoggedIn(true);
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 select-none font-sans text-slate-900">
      
      <div className="w-full max-w-md mb-4">
        <Link href="/" className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center gap-2">
          ← Return to Portal
        </Link>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200 p-6 rounded shadow-sm">
        
        {!isLoggedIn ? (
          <>
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h1 className="text-2xl font-black tracking-tight text-slate-800 uppercase">
                Trainer Auth
              </h1>
              <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-wider font-bold">Secure Access Node</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Trainer ID</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter ID..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-sm px-3 py-2 text-slate-800 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Security Key</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-sm px-3 py-2 text-slate-800 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
                />
              </div>

              <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-3 mt-2 rounded-sm uppercase tracking-wider text-xs shadow-sm transition-all">
                Initialize Connection
              </button>
            </form>
          </>
        ) : (
          // --- SIMULATED LOGGED IN DASHBOARD ---
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-indigo-700 uppercase">
                  {username || "Trainer"}
                </h1>
                <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-wider font-bold">Authentication Successful</p>
              </div>
              {mockRank && mockRank <= 1000 && (
                <div className="bg-amber-100 text-amber-700 border border-amber-200 px-2 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest text-right">
                  Global Rank <br/> #{mockRank}
                </div>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Rating</span>
                <span className="text-lg font-black text-slate-800 font-mono">{mockRating} Elo</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Title</span>
                <span className={`text-sm font-black uppercase tracking-wider ${mockRating < 500 ? "text-red-500" : "text-indigo-600"}`}>
                  {getPlayerTitle(mockRating, mockRank)}
                </span>
              </div>
            </div>

            <Link href="/" className="block text-center w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-sm uppercase tracking-wider text-xs shadow-sm transition-all">
              Enter Matchmaking
            </Link>
          </div>
        )}

      </div>

    </main>
  );
}