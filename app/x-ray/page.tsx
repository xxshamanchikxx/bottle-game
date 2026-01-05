"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HostLogin() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!login.trim() || !password.trim()) {
      setError("Заполни все поля");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/host-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("hostToken", data.token);
        localStorage.setItem("isHost", "true");
        router.push("/game");
      } else {
        setError(data.message || "Неверный логин или пароль");
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Панель ведущего
          </h1>
          <p className="text-gray-300">Введи данные для входа</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Логин
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 focus:border-pink-500 focus:outline-none text-white placeholder-gray-400"
              placeholder="x-ray"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 focus:border-pink-500 focus:outline-none text-white placeholder-gray-400"
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Проверка..." : "🚪 Войти"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition border border-white/20"
          >
            ← Назад
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Доступ только для администратора
        </div>
      </div>
    </div>
  );
}
