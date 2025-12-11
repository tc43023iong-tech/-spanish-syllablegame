import React, { useState, useEffect } from 'react';
import { Screen, WordChallenge, GameState } from './types';
import { generateChallenges } from './services/geminiService';
import { 
  Play, 
  Star, 
  Music, 
  Volume2, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Home
} from 'lucide-react';

// --- Helper Components ---

const Button: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-bold shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-yellow-400 text-yellow-900 hover:bg-yellow-300",
    secondary: "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200",
    success: "bg-green-500 text-white hover:bg-green-400",
    danger: "bg-red-500 text-white hover:bg-red-400",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl p-6 shadow-xl border-b-8 border-blue-100 ${className}`}>
    {children}
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [gameState, setGameState] = useState<GameState>({ score: 0, streak: 0, level: 1 });
  const [challenges, setChallenges] = useState<WordChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [lessonStep, setLessonStep] = useState(0);

  // Load initial challenges
  useEffect(() => {
    if (currentScreen === Screen.GAME_SYLLABLES || currentScreen === Screen.GAME_STRESS || currentScreen === Screen.GAME_MASTER) {
      loadNewChallenges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen]);

  const loadNewChallenges = async (forceLevel?: number) => {
    const levelToCheck = forceLevel ?? gameState.level;
    const difficulty = levelToCheck === 1 ? 'easy' : levelToCheck === 2 ? 'medium' : 'hard';
    const newWords = await generateChallenges(5, difficulty);
    setChallenges(newWords);
    setCurrentChallengeIndex(0);
    setFeedback('none');
  };

  const handleCorrect = () => {
    setFeedback('correct');
    setGameState(prev => ({ ...prev, score: prev.score + 10 + (prev.streak * 2), streak: prev.streak + 1 }));
    // Auto-advance after 1 second
    setTimeout(() => {
      nextChallenge();
    }, 1000);
  };

  const handleWrong = () => {
    setFeedback('wrong');
    setGameState(prev => ({ ...prev, streak: 0 }));
  };

  const nextChallenge = () => {
    setFeedback('none');
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    } else {
      // Round complete
      const nextLevel = gameState.level + 1;
      setGameState(prev => ({ ...prev, level: nextLevel }));
      loadNewChallenges(nextLevel);
    }
  };

  // --- Screens ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob bg-yellow-300 w-64 h-64 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="blob bg-pink-300 w-80 h-80 rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>

      <div className="z-10 max-w-md w-full space-y-8">
        <div className="animate-bounce-short mb-8">
          <h1 className="text-6xl font-black text-blue-600 tracking-tight drop-shadow-sm">
            Súper<br/><span className="text-yellow-500">Sílabas</span>
          </h1>
          <p className="text-blue-400 font-bold text-lg mt-2">西班牙語小冒險</p>
        </div>
        
        <p className="text-xl text-slate-600 font-medium mb-8">
          學習如何拆分音節並找出重音！
        </p>

        <div className="grid gap-4 w-full">
          <Button onClick={() => { setLessonStep(0); setCurrentScreen(Screen.LESSON_SYLLABLES); }} className="w-full h-20 text-xl">
            <Music className="w-8 h-8" />
            1. 認識音節 (Sílabas)
          </Button>
          
          <Button onClick={() => { setLessonStep(0); setCurrentScreen(Screen.LESSON_STRESS); }} variant="secondary" className="w-full h-20 text-xl">
            <Volume2 className="w-8 h-8 text-orange-500" />
            2. 尋找重音 (Acento)
          </Button>

          <Button onClick={() => { setLessonStep(0); setCurrentScreen(Screen.LESSON_RULES); }} variant="secondary" className="w-full h-20 text-xl">
            <Award className="w-8 h-8 text-purple-500" />
            3. 黃金規則 (Reglas)
          </Button>

           <div className="h-4"></div>

          <Button onClick={() => setCurrentScreen(Screen.GAME_MASTER)} variant="success" className="w-full h-24 text-2xl animate-pulse">
            <Play className="w-10 h-10" />
            開始遊戲！
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLessonSyllables = () => {
    const steps = [
      {
        title: "什麼是音節？",
        content: "想像單字就像一列火車 🚂。火車的每一節車廂，就是一個「音節」。",
        example: "CA - SA (2 節車廂)",
        visual: (
          <div className="flex gap-2 justify-center my-8">
            <div className="bg-red-400 text-white w-24 h-24 rounded-xl flex items-center justify-center text-4xl font-bold shadow-lg">CA</div>
            <div className="bg-blue-400 text-white w-24 h-24 rounded-xl flex items-center justify-center text-4xl font-bold shadow-lg">SA</div>
          </div>
        )
      },
      {
        title: "我們來拍拍手！👏",
        content: "要找出音節很簡單，我們可以用拍手來數。發出一個聲音就拍一下手。",
        example: "試試看：E - LE - FAN - TE (大象)",
        visual: (
          <div className="flex flex-wrap gap-2 justify-center my-8">
             {['E', 'LE', 'FAN', 'TE'].map((s, i) => (
                <div key={i} className="animate-bounce" style={{ animationDelay: `${i*200}ms` }}>
                  <div className="bg-green-400 text-white p-4 rounded-xl text-2xl font-bold">{s}</div>
                </div>
             ))}
          </div>
        )
      },
      {
        title: "母音是心臟 ❤️",
        content: "每一個音節裡，至少都要有一個母音 (A, E, I, O, U)。它們是音節的心臟！",
        example: "",
        visual: (
          <div className="text-6xl font-black text-orange-500 tracking-widest my-8">
            A E I O U
          </div>
        )
      }
    ];

    const step = steps[lessonStep];

    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentScreen(Screen.HOME)} className="text-slate-400 hover:text-slate-600"><Home /></button>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i === lessonStep ? 'bg-blue-500' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">{step.title}</h2>
          <p className="text-xl text-center text-slate-600 mb-4">{step.content}</p>
          {step.visual}
          <p className="text-2xl font-bold text-center text-slate-700 mb-8">{step.example}</p>

          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => lessonStep > 0 ? setLessonStep(prev => prev - 1) : setCurrentScreen(Screen.HOME)}>
              返回
            </Button>
            <Button onClick={() => {
              if (lessonStep < steps.length - 1) {
                setLessonStep(prev => prev + 1);
              } else {
                setCurrentScreen(Screen.GAME_SYLLABLES);
              }
            }}>
              {lessonStep === steps.length - 1 ? '練習看看！' : '下一步'} <ArrowRight />
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderLessonStress = () => {
    const steps = [
      {
        title: "重音 (用點力氣) 💪",
        content: "在每一個單字裡，都有一個音節念起來特別大聲、特別用力。我們叫它「重音音節」。",
        visual: (
          <div className="flex items-end justify-center gap-2 h-32 my-8">
            <div className="bg-slate-300 w-16 h-16 rounded-t-lg flex items-center justify-center text-xl font-bold text-slate-500">me</div>
            <div className="bg-orange-500 w-20 h-28 rounded-t-lg flex items-center justify-center text-3xl text-white font-bold shadow-lg animate-pulse">LÓN</div>
          </div>
        )
      },
      {
        title: "神奇的重音符號 🪄",
        content: "有時候，用力的那個音節頭上會戴一頂小帽子 (´) 叫做 Tilde。如果你看到它，那裡就是最用力的地方！",
        visual: (
           <div className="text-7xl font-black text-purple-600 my-8">
             CAMI<span className="relative inline-block">Ó<span className="absolute -top-4 right-2 text-yellow-400 text-4xl">✨</span></span>N
           </div>
        )
      }
    ];

    const step = steps[lessonStep];

    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentScreen(Screen.HOME)} className="text-slate-400 hover:text-slate-600"><Home /></button>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i === lessonStep ? 'bg-orange-500' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-4">{step.title}</h2>
          <p className="text-xl text-center text-slate-600 mb-4">{step.content}</p>
          <div className="flex justify-center">{step.visual}</div>
          <div className="flex justify-between mt-8">
            <Button variant="secondary" onClick={() => lessonStep > 0 ? setLessonStep(prev => prev - 1) : setCurrentScreen(Screen.HOME)}>返回</Button>
            <Button onClick={() => {
              if (lessonStep < steps.length - 1) {
                setLessonStep(prev => prev + 1);
              } else {
                setCurrentScreen(Screen.GAME_STRESS);
              }
            }}>
              {lessonStep === steps.length - 1 ? '練習看看！' : '下一步'} <ArrowRight />
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderLessonRules = () => {
    // Simplified SEGA rules for kids
    const steps = [
      {
        title: "Agudas (最後一節) 🚀",
        content: "重音用力的地方在「最後面」的音節。如果字尾是 N, S 或 母音，就要戴帽子(加重音符號)！",
        visual: <div className="text-4xl text-center my-6 font-bold text-blue-600">Can-ción, Pa-pá, A-mor</div>
      },
      {
        title: "Graves (倒數第二節) 🐢",
        content: "重音在「倒數第二個」音節。只有在字尾 *不是* N, S 或 母音的時候才戴帽子。",
        visual: <div className="text-4xl text-center my-6 font-bold text-green-600">Cá-rcel, Me-sa, Li-bro</div>
      },
      {
        title: "Esdrújulas (倒數第三節) 🥉",
        content: "重音在「倒數第三個」音節。這最簡單，它們「永遠」都要戴帽子！",
        visual: <div className="text-4xl text-center my-6 font-bold text-purple-600">Mú-si-ca, Má-gi-co</div>
      }
    ];
    
     const step = steps[lessonStep];

    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
           <div className="flex justify-between items-center mb-6">
            <button onClick={() => setCurrentScreen(Screen.HOME)} className="text-slate-400 hover:text-slate-600"><Home /></button>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i === lessonStep ? 'bg-purple-500' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">{step.title}</h2>
          <p className="text-xl text-center text-slate-600 mb-8">{step.content}</p>
          {step.visual}
          <div className="flex justify-between mt-8">
            <Button variant="secondary" onClick={() => lessonStep > 0 ? setLessonStep(prev => prev - 1) : setCurrentScreen(Screen.HOME)}>返回</Button>
            <Button onClick={() => {
              if (lessonStep < steps.length - 1) {
                setLessonStep(prev => prev + 1);
              } else {
                setCurrentScreen(Screen.GAME_MASTER);
              }
            }}>
              {lessonStep === steps.length - 1 ? '開始玩遊戲！' : '下一步'} <ArrowRight />
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderGame = (mode: 'syllables' | 'stress' | 'master') => {
    // Loading screen removed as per user request

    if (challenges.length === 0) return <div>載入失敗，請重試</div>;

    const currentWord = challenges[currentChallengeIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4 flex flex-col items-center">
        {/* Header Stats */}
        <div className="w-full max-w-2xl flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
          <Button variant="secondary" onClick={() => setCurrentScreen(Screen.HOME)} className="!px-3 !py-2 !text-sm"><Home size={16}/></Button>
          <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
            <Star className="fill-current" /> {gameState.score}
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-bold text-xl">
            🔥 {gameState.streak}
          </div>
          <div className="text-slate-400 font-medium">
            第 {currentChallengeIndex + 1} 題 / 共 {challenges.length} 題
          </div>
        </div>

        {/* Game Card */}
        <Card className="max-w-2xl w-full flex-grow flex flex-col items-center justify-center relative overflow-visible">
          
          <div className="mb-6 text-center">
             <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
               {mode === 'syllables' ? '數數看有幾個音節？' : '找出發音最用力的音節'}
             </span>
             <h2 className="text-2xl text-slate-500 mt-2 font-bold">{currentWord.translation}</h2>
          </div>

          <div className="flex flex-col items-center w-full">
            {currentWord.emoji && (
              <div className="text-7xl mb-6 animate-bounce-short">
                {currentWord.emoji}
              </div>
            )}

            {mode === 'syllables' ? (
               <div className="text-center w-full">
                 <h3 className="text-6xl font-black text-slate-800 mb-12 tracking-wide">{currentWord.word}</h3>
                 <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                   {[1, 2, 3, 4].map((num) => (
                     <Button 
                       key={num} 
                       variant={feedback === 'none' ? 'secondary' : (num === currentWord.syllables.length ? 'success' : 'secondary')}
                       onClick={() => {
                          if (feedback !== 'none') return;
                          if (num === currentWord.syllables.length) handleCorrect();
                          else handleWrong();
                       }}
                       className="h-20 text-3xl"
                       disabled={feedback !== 'none'}
                     >
                       {num}
                     </Button>
                   ))}
                 </div>
               </div>
            ) : (
              // Stress / Master Mode
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                {currentWord.syllables.map((syl, idx) => {
                  let btnVariant: 'secondary' | 'success' | 'danger' = 'secondary';
                  if (feedback === 'correct' && idx === currentWord.stressIndex) btnVariant = 'success';
                  else if (feedback === 'wrong' && idx === currentWord.stressIndex) btnVariant = 'success'; // Show correct answer
                  else if (feedback === 'wrong') btnVariant = 'secondary'; 

                  return (
                    <Button
                      key={idx}
                      variant={btnVariant}
                      className="h-24 min-w-[5rem] text-3xl font-bold lowercase"
                      onClick={() => {
                        if (feedback !== 'none') return;
                        if (idx === currentWord.stressIndex) handleCorrect();
                        else handleWrong();
                      }}
                      disabled={feedback !== 'none'}
                    >
                      {syl}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Feedback Overlay - Only for Wrong answers */}
          {feedback === 'wrong' && (
            <div className="absolute inset-0 bg-white/90 rounded-3xl flex flex-col items-center justify-center p-8 z-20 animate-in fade-in duration-200">
                  <XCircle className="w-24 h-24 text-red-500 mb-4" />
                  <h2 className="text-4xl font-bold text-red-600 mb-2">差一點點！</h2>
                  <p className="text-slate-500 text-lg mb-8">
                     正確答案是： <span className="font-bold text-slate-800">{mode === 'syllables' ? currentWord.syllables.length : currentWord.syllables[currentWord.stressIndex]}</span>
                  </p>
               
               <Button onClick={nextChallenge} className="w-full max-w-xs text-xl">
                 繼續挑戰 <ArrowRight />
               </Button>
            </div>
          )}

        </Card>
        
        {/* Help Tip */}
        <div className="mt-8 flex items-center gap-2 text-slate-500 opacity-70">
           <HelpCircle size={18} />
           <span className="text-sm">
             {mode === 'syllables' ? '提示：試著一邊拍手一邊唸單字。' : '提示：仔細聽聽看哪一個音節最大聲。'}
           </span>
        </div>
      </div>
    );
  };

  // --- Router ---
  switch (currentScreen) {
    case Screen.HOME: return renderHome();
    case Screen.LESSON_SYLLABLES: return renderLessonSyllables();
    case Screen.LESSON_STRESS: return renderLessonStress();
    case Screen.LESSON_RULES: return renderLessonRules();
    case Screen.GAME_SYLLABLES: return renderGame('syllables');
    case Screen.GAME_STRESS: return renderGame('stress');
    case Screen.GAME_MASTER: return renderGame('master');
    default: return renderHome();
  }
};

export default App;