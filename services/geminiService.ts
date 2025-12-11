import { GoogleGenAI, Type } from "@google/genai";
import { WordChallenge } from "../types";

// Curated dataset for offline/fallback mode (20 words per difficulty) with Emojis
const LOCAL_DATASET: Record<'easy' | 'medium' | 'hard', WordChallenge[]> = {
  easy: [
    { word: "Mesa", syllables: ["Me", "sa"], stressIndex: 0, translation: "桌子", difficulty: "easy", type: "grave", emoji: "🪑" },
    { word: "Silla", syllables: ["Si", "lla"], stressIndex: 0, translation: "椅子", difficulty: "easy", type: "grave", emoji: "🪑" },
    { word: "Casa", syllables: ["Ca", "sa"], stressIndex: 0, translation: "房子", difficulty: "easy", type: "grave", emoji: "🏠" },
    { word: "Gato", syllables: ["Ga", "to"], stressIndex: 0, translation: "貓", difficulty: "easy", type: "grave", emoji: "🐱" },
    { word: "Perro", syllables: ["Pe", "rro"], stressIndex: 0, translation: "狗", difficulty: "easy", type: "grave", emoji: "🐶" },
    { word: "Pato", syllables: ["Pa", "to"], stressIndex: 0, translation: "鴨子", difficulty: "easy", type: "grave", emoji: "🦆" },
    { word: "Vaca", syllables: ["Va", "ca"], stressIndex: 0, translation: "乳牛", difficulty: "easy", type: "grave", emoji: "🐄" },
    { word: "Leche", syllables: ["Le", "che"], stressIndex: 0, translation: "牛奶", difficulty: "easy", type: "grave", emoji: "🥛" },
    { word: "Agua", syllables: ["A", "gua"], stressIndex: 0, translation: "水", difficulty: "easy", type: "grave", emoji: "💧" },
    { word: "Mano", syllables: ["Ma", "no"], stressIndex: 0, translation: "手", difficulty: "easy", type: "grave", emoji: "✋" },
    { word: "Dedo", syllables: ["De", "do"], stressIndex: 0, translation: "手指", difficulty: "easy", type: "grave", emoji: "☝️" },
    { word: "Cara", syllables: ["Ca", "ra"], stressIndex: 0, translation: "臉", difficulty: "easy", type: "grave", emoji: "☺" },
    { word: "Boca", syllables: ["Bo", "ca"], stressIndex: 0, translation: "嘴巴", difficulty: "easy", type: "grave", emoji: "👄" },
    { word: "Nariz", syllables: ["Na", "riz"], stressIndex: 1, translation: "鼻子", difficulty: "easy", type: "aguda", emoji: "👃" },
    { word: "Azul", syllables: ["A", "zul"], stressIndex: 1, translation: "藍色", difficulty: "easy", type: "aguda", emoji: "🔵" },
    { word: "Papá", syllables: ["Pa", "pá"], stressIndex: 1, translation: "爸爸", difficulty: "easy", type: "aguda", emoji: "👨" },
    { word: "Mamá", syllables: ["Ma", "má"], stressIndex: 1, translation: "媽媽", difficulty: "easy", type: "aguda", emoji: "👩" },
    { word: "Sofá", syllables: ["So", "fá"], stressIndex: 1, translation: "沙發", difficulty: "easy", type: "aguda", emoji: "🛋" },
    { word: "Bebé", syllables: ["Be", "bé"], stressIndex: 1, translation: "嬰兒", difficulty: "easy", type: "aguda", emoji: "👶" },
    { word: "Café", syllables: ["Ca", "fé"], stressIndex: 1, translation: "咖啡", difficulty: "easy", type: "aguda", emoji: "☕" }
  ],
  medium: [
    { word: "Tomate", syllables: ["To", "ma", "te"], stressIndex: 1, translation: "番茄", difficulty: "medium", type: "grave", emoji: "🍅" },
    { word: "Patata", syllables: ["Pa", "ta", "ta"], stressIndex: 1, translation: "馬鈴薯", difficulty: "medium", type: "grave", emoji: "🥔" },
    { word: "Pelota", syllables: ["Pe", "lo", "ta"], stressIndex: 1, translation: "球", difficulty: "medium", type: "grave", emoji: "⚽" },
    { word: "Camisa", syllables: ["Ca", "mi", "sa"], stressIndex: 1, translation: "襯衫", difficulty: "medium", type: "grave", emoji: "👔" },
    { word: "Zapato", syllables: ["Za", "pa", "to"], stressIndex: 1, translation: "鞋子", difficulty: "medium", type: "grave", emoji: "👞" },
    { word: "Ventana", syllables: ["Ven", "ta", "na"], stressIndex: 1, translation: "窗戶", difficulty: "medium", type: "grave", emoji: "🪟" },
    { word: "Conejo", syllables: ["Co", "ne", "jo"], stressIndex: 1, translation: "兔子", difficulty: "medium", type: "grave", emoji: "🐰" },
    { word: "Caballo", syllables: ["Ca", "ba", "llo"], stressIndex: 1, translation: "馬", difficulty: "medium", type: "grave", emoji: "🐎" },
    { word: "Estrella", syllables: ["Es", "tre", "lla"], stressIndex: 1, translation: "星星", difficulty: "medium", type: "grave", emoji: "⭐" },
    { word: "Escuela", syllables: ["Es", "cue", "la"], stressIndex: 1, translation: "學校", difficulty: "medium", type: "grave", emoji: "🏫" },
    { word: "Balón", syllables: ["Ba", "lón"], stressIndex: 1, translation: "大球", difficulty: "medium", type: "aguda", emoji: "🏀" },
    { word: "Ratón", syllables: ["Ra", "tón"], stressIndex: 1, translation: "老鼠", difficulty: "medium", type: "aguda", emoji: "🐭" },
    { word: "Limón", syllables: ["Li", "món"], stressIndex: 1, translation: "檸檬", difficulty: "medium", type: "aguda", emoji: "🍋" },
    { word: "Avión", syllables: ["A", "vión"], stressIndex: 1, translation: "飛機", difficulty: "medium", type: "aguda", emoji: "✈" },
    { word: "Reloj", syllables: ["Re", "loj"], stressIndex: 1, translation: "時鐘", difficulty: "medium", type: "aguda", emoji: "⏰" },
    { word: "Árbol", syllables: ["Ár", "bol"], stressIndex: 0, translation: "樹", difficulty: "medium", type: "grave", emoji: "🌳" },
    { word: "Lápiz", syllables: ["Lá", "piz"], stressIndex: 0, translation: "鉛筆", difficulty: "medium", type: "grave", emoji: "✏" },
    { word: "Trébol", syllables: ["Tré", "bol"], stressIndex: 0, translation: "三葉草", difficulty: "medium", type: "grave", emoji: "☘" },
    { word: "Azúcar", syllables: ["A", "zú", "car"], stressIndex: 1, translation: "糖", difficulty: "medium", type: "grave", emoji: "🍬" },
    { word: "Césped", syllables: ["Cés", "ped"], stressIndex: 0, translation: "草地", difficulty: "medium", type: "grave", emoji: "🌿" }
  ],
  hard: [
    { word: "Plátano", syllables: ["Plá", "ta", "no"], stressIndex: 0, translation: "香蕉", difficulty: "hard", type: "esdrujula", emoji: "🍌" },
    { word: "Música", syllables: ["Mú", "si", "ca"], stressIndex: 0, translation: "音樂", difficulty: "hard", type: "esdrujula", emoji: "🎵" },
    { word: "Pájaro", syllables: ["Pá", "ja", "ro"], stressIndex: 0, translation: "鳥", difficulty: "hard", type: "esdrujula", emoji: "🐦" },
    { word: "Médico", syllables: ["Mé", "di", "co"], stressIndex: 0, translation: "醫生", difficulty: "hard", type: "esdrujula", emoji: "👨‍⚕️" },
    { word: "Teléfono", syllables: ["Te", "lé", "fo", "no"], stressIndex: 1, translation: "電話", difficulty: "hard", type: "esdrujula", emoji: "☎" },
    { word: "Sábado", syllables: ["Sá", "ba", "do"], stressIndex: 0, translation: "星期六", difficulty: "hard", type: "esdrujula", emoji: "📅" },
    { word: "Mágico", syllables: ["Má", "gi", "co"], stressIndex: 0, translation: "神奇的", difficulty: "hard", type: "esdrujula", emoji: "✨" },
    { word: "Rápido", syllables: ["Rá", "pi", "do"], stressIndex: 0, translation: "快速", difficulty: "hard", type: "esdrujula", emoji: "🏃" },
    { word: "Círculo", syllables: ["Cír", "cu", "lo"], stressIndex: 0, translation: "圓形", difficulty: "hard", type: "esdrujula", emoji: "⭕" },
    { word: "América", syllables: ["A", "mé", "ri", "ca"], stressIndex: 1, translation: "美洲", difficulty: "hard", type: "esdrujula", emoji: "🌎" },
    { word: "Elefante", syllables: ["E", "le", "fan", "te"], stressIndex: 2, translation: "大象", difficulty: "hard", type: "grave", emoji: "🐘" },
    { word: "Chocolate", syllables: ["Cho", "co", "la", "te"], stressIndex: 2, translation: "巧克力", difficulty: "hard", type: "grave", emoji: "🍫" },
    { word: "Mariposa", syllables: ["Ma", "ri", "po", "sa"], stressIndex: 2, translation: "蝴蝶", difficulty: "hard", type: "grave", emoji: "🦋" },
    { word: "Computadora", syllables: ["Com", "pu", "ta", "do", "ra"], stressIndex: 3, translation: "電腦", difficulty: "hard", type: "grave", emoji: "💻" },
    { word: "Restaurante", syllables: ["Res", "tau", "ran", "te"], stressIndex: 2, translation: "餐廳", difficulty: "hard", type: "grave", emoji: "🍽" },
    { word: "Hospital", syllables: ["Hos", "pi", "tal"], stressIndex: 2, translation: "醫院", difficulty: "hard", type: "aguda", emoji: "🏥" },
    { word: "Libertad", syllables: ["Li", "ber", "tad"], stressIndex: 2, translation: "自由", difficulty: "hard", type: "aguda", emoji: "🗽" },
    { word: "Universidad", syllables: ["U", "ni", "ver", "si", "dad"], stressIndex: 4, translation: "大學", difficulty: "hard", type: "aguda", emoji: "🎓" },
    { word: "Difícil", syllables: ["Di", "fí", "cil"], stressIndex: 1, translation: "困難", difficulty: "hard", type: "grave", emoji: "🧩" },
    { word: "Automóvil", syllables: ["Au", "to", "mó", "vil"], stressIndex: 2, translation: "汽車", difficulty: "hard", type: "grave", emoji: "🚗" }
  ]
};

const getRandomSubset = (array: WordChallenge[], count: number): WordChallenge[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateChallenges = async (count: number = 5, difficulty: 'easy' | 'medium' | 'hard' = 'easy'): Promise<WordChallenge[]> => {
  const sourceData = LOCAL_DATASET[difficulty];
  // Removed artificial delay for instant loading
  return getRandomSubset(sourceData, count);
};