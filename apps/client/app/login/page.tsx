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
      // Instantly redirect to the main portal upon success
      router.push("/");
    } else {
      setErrorMsg(response.error || "Authentication failed.");
      setIsLoading(false);
    }
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

      </div>
    </main>
  );
}