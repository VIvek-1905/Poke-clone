"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticateTrainer } from "./actions";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    const response = await authenticateTrainer(username, password);

    if (response.success) {
      router.push("/");
    } else {
      setErrorMsg(response.error || "Authentication failed.");
      setIsLoading(false);
    }
  };

  const handleSocialMock = (provider: string) => {
    alert(`${provider} OAuth requires external API keys to be generated first. This module is pending activation!`);
  };

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 select-none font-sans text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 p-6 rounded shadow-sm">
        
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-black tracking-tight text-slate-800 uppercase">
            Trainer Auth
          </h1>
          <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-wider font-bold">Secure Access Node</p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm">
            {errorMsg}
          </div>
        )}

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

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-700 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-bold py-3 mt-2 rounded-sm uppercase tracking-wider text-xs shadow-sm transition-all"
          >
            {isLoading ? "Authenticating..." : "Initialize Connection"}
          </button>
        </form>

        {/* SOCIAL LOGIN SECTION */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
              <span className="bg-white px-3 text-slate-400">Or Authenticate With</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleSocialMock("Google")}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-2.5 rounded-sm uppercase tracking-wider text-[10px] shadow-sm transition-all"
            >
              Google
            </button>
            <button 
              type="button"
              onClick={() => handleSocialMock("Discord")}
              className="w-full flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2.5 rounded-sm uppercase tracking-wider text-[10px] shadow-sm transition-all"
            >
              Discord
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}