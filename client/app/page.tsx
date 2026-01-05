"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [avatar, setAvatar] = useState("👤");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const avatars = ["👤", "😎", "🤵", "👨", "🧔", "👩", "👱‍♀️", "👸", "🦸‍♂️", "🦸‍♀️"];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setAvatar(""); // Очищаем эмодзи если загрузили файл
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJoin = () => {
    if (name.trim()) {
      // Очищаем данные ведущего
      localStorage.removeItem("hostToken");
      localStorage.removeItem("isHost");
      
      // Сохраняем данные игрока
      localStorage.setItem("playerName", name);
      localStorage.setItem("playerGender", gender);
      
      // Сохраняем аватар (либо эмодзи, либо base64)
      if (avatarPreview) {
        localStorage.setItem("playerAvatar", avatarPreview);
        localStorage.setItem("playerAvatarType", "image");
      } else {
        localStorage.setItem("playerAvatar", avatar);
        localStorage.setItem("playerAvatarType", "emoji");
      }
      
      router.push("/game");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          🍾 Бутылочка
        </h1>
        <p className="text-center text-gray-600 mb-6">Пикантная онлайн игра</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Твое имя
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-lg text-gray-900"
              placeholder="Введи имя..."
              maxLength={15}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Пол
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender("male")}
                className={`py-3 rounded-xl font-semibold transition ${
                  gender === "male"
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                👨 Парень
              </button>
              <button
                onClick={() => setGender("female")}
                className={`py-3 rounded-xl font-semibold transition ${
                  gender === "female"
                    ? "bg-pink-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                👩 Девушка
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Выбери аватар
            </label>
            
            {/* Превью загруженного аватара */}
            {avatarPreview && (
              <div className="mb-3 flex justify-center">
                <div className="relative">
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-pink-500 shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setAvatarPreview("");
                      setAvatarFile(null);
                      setAvatar("👤");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            
            {/* Кнопка загрузки */}
            <label className="block mb-3">
              <div className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-center rounded-xl cursor-pointer hover:scale-105 transition shadow-lg">
                📷 Загрузить свое фото
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
            
            {/* Эмодзи аватары */}
            {!avatarPreview && (
              <div className="grid grid-cols-5 gap-2">
                {avatars.map((av) => (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`text-4xl py-3 rounded-xl transition ${
                      avatar === av
                        ? "bg-pink-500 scale-110 shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleJoin}
            disabled={!name.trim()}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            🎮 Войти в игру
          </button>
        </div>
      </div>
    </div>
  );
}
