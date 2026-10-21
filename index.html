import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Plus,
  Flame,
  PieChart,
  User,
  Settings,
  Sparkles,
  ChevronRight,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  Sliders,
  Shield,
  Key,
  Sun,
  Moon,
  ArrowLeft,
  Image as ImageIcon,
  Zap,
  Info,
  LogOut,
  Target,
  Award
} from 'lucide-react';

// Sample pre-loaded mock meals for instant demo analysis
const SAMPLE_MEALS = [
  {
    id: 'sample-1',
    name: 'Grilled Chicken Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    summary: 'High protein meal with complex carbs and veggies.',
    totales: { calorias: 520, proteinas: 42, carbohidratos: 48, grasas: 14 },
    ingredientes: [
      { id: 'ing-1', nombre: 'Pechuga de Pollo', gramos: 180, calorias: 298, proteinas: 38, carbohidratos: 0, grasas: 6, bbox: [20, 25, 45, 50] },
      { id: 'ing-2', nombre: 'Arroz Integral', gramos: 120, calorias: 140, proteinas: 3, carbohidratos: 30, grasas: 1, bbox: [50, 20, 40, 40] },
      { id: 'ing-3', nombre: 'Aguacate', gramos: 50, calorias: 82, proteinas: 1, carbohidratos: 4, grasas: 7, bbox: [30, 60, 30, 30] }
    ]
  },
  {
    id: 'sample-2',
    name: 'Avocado Toast & Eggs',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    summary: 'Balanced breakfast rich in healthy fats and proteins.',
    totales: { calorias: 410, proteinas: 18, carbohidratos: 32, grasas: 24 },
    ingredientes: [
      { id: 'ing-10', nombre: 'Pan de Masa Madre', gramos: 70, calorias: 180, proteinas: 6, carbohidratos: 32, grasas: 2, bbox: [15, 15, 70, 70] },
      { id: 'ing-11', nombre: 'Huevos Escalfados', gramos: 100, calorias: 143, proteinas: 12, carbohidratos: 1, grasas: 10, bbox: [25, 30, 35, 35] },
      { id: 'ing-12', nombre: 'Aguacate Machacado', gramos: 60, calorias: 96, proteinas: 1, carbohidratos: 5, grasas: 9, bbox: [45, 40, 35, 35] }
    ]
  }
];

export default function App() {
  // App State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'camera', 'analysis', 'analytics', 'settings'
  const [user, setUser] = useState({ name: 'Alex Johnson', targetCalories: 2200, targetProtein: 150, targetCarbs: 220, targetFat: 70 });
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('calai_gemini_key') || '');
  const [loggedMeals, setLoggedMeals] = useState([
    {
      id: 'logged-1',
      date: new Date().toISOString(),
      name: 'Oatmeal with Berries',
      image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&q=80&w=400',
      calories: 340,
      protein: 12,
      carbs: 58,
      fat: 6
    }
  ]);

  // Current meal being analyzed or edited
  const [analyzingImage, setAnalyzingImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [analysisError, setAnalysisError] = useState('');

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('calai_gemini_key', key);
  };

  // Run AI Analysis using Google Gemini API or fallback simulation
  const analyzeFoodImage = async (base64OrUrl, isFile = false) => {
    setIsAnalyzing(true);
    setAnalysisError('');
    setActiveTab('analysis');

    if (apiKey && isFile) {
      try {
        // Strip base64 prefix for Gemini API
        const base64Data = base64OrUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
        
        const systemPrompt = `You are a world-class nutritionist AI. Analyze the image of food.
Return ONLY a valid JSON object matching this schema strictly without markdown or formatting:
{
  "name": "Title of the meal",
  "summary": "Short 1 sentence description",
  "totales": { "calorias": number, "proteinas": number, "carbohidratos": number, "grasas": number },
  "ingredientes": [
    {
      "id": "unique_string",
      "nombre": "Ingredient name",
      "gramos": number,
      "calorias": number,
      "proteinas": number,
      "carbohidratos": number,
      "grasas": number,
      "bbox": [top_percent, left_percent, width_percent, height_percent]
    }
  ]
}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: systemPrompt },
                { inlineData: { mimeType: "image/jpeg", data: base64Data } }
              ]
            }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
          setCurrentMeal({
            id: 'meal-' + Date.now(),
            image: base64OrUrl,
            ...parsed
          });
          setIsAnalyzing(false);
          return;
        } else {
          throw new Error('Formato de respuesta no válido');
        }
      } catch (err) {
        console.error("Gemini API Error:", err);
        setAnalysisError('Error al procesar con tu API Key. Ejecutando análisis simulado...');
      }
    }

    // Fallback Simulation Mode
    setTimeout(() => {
      const sample = SAMPLE_MEALS[Math.floor(Math.random() * SAMPLE_MEALS.length)];
      setCurrentMeal({
        ...JSON.parse(JSON.stringify(sample)),
        id: 'meal-' + Date.now(),
        image: base64OrUrl || sample.image
      });
      setIsAnalyzing(false);
    }, 2200);
  };

  // Recalculate macro totals based on ingredient slider updates
  const handleIngredientGramChange = (ingId, newGrams) => {
    if (!currentMeal) return;

    const updatedIngs = currentMeal.ingredientes.map(ing => {
      if (ing.id === ingId) {
        const ratio = newGrams / (ing.gramos || 1);
        return {
          ...ing,
          gramos: newGrams,
          calorias: Math.round(ing.calorias * ratio),
          proteinas: Math.round(ing.proteinas * ratio),
          carbohidratos: Math.round(ing.carbohidratos * ratio),
          grasas: Math.round(ing.grasas * ratio)
        };
      }
      return ing;
    });

    const newTotals = updatedIngs.reduce((acc, curr) => ({
      calorias: acc.calorias + curr.calorias,
      proteinas: acc.proteinas + curr.proteinas,
      carbohidratos: acc.carbohidratos + curr.carbohidratos,
      grasas: acc.grasas + curr.grasas
    }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });

    setCurrentMeal({
      ...currentMeal,
      ingredientes: updatedIngs,
      totales: newTotals
    });
  };

  // Confirm and Log Meal
  const saveMealToLog = () => {
    if (!currentMeal) return;
    const newEntry = {
      id: currentMeal.id,
      date: new Date().toISOString(),
      name: currentMeal.name,
      image: currentMeal.image,
      calories: currentMeal.totales.calorias,
      protein: currentMeal.totales.proteinas,
      carbs: currentMeal.totales.carbohidratos,
      fat: currentMeal.totales.grasas
    };
    setLoggedMeals([newEntry, ...loggedMeals]);
    setCurrentMeal(null);
    setActiveTab('dashboard');
  };

  // Calculations for dashboard
  const totalCaloriesToday = loggedMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProteinToday = loggedMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbsToday = loggedMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFatToday = loggedMeals.reduce((sum, m) => sum + m.fat, 0);

  const caloriePct = Math.min(100, Math.round((totalCaloriesToday / user.targetCalories) * 100));

  return (
    <div className="flex justify-center bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-white">
      {/* Mobile Device Simulation Frame */}
      <div className="w-full max-w-md bg-slate-900 border-x border-slate-800/80 min-h-screen flex flex-col justify-between relative shadow-2xl overflow-hidden pb-20">

        {/* TOP STATUS BAR DECORATION */}
        <header className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              CAL AI
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-300 border border-slate-700/50"
            >
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-semibold text-xs">
              AJ
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEW ROUTER */}
        <main className="flex-1 overflow-y-auto px-4 py-4">

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Daily Calorie Ring Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/50 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Resumen Diario</h2>
                    <p className="text-xl font-bold text-white">Objetivo Nutricional</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                    Hoy
                  </span>
                </div>

                <div className="flex items-center justify-around my-2">
                  {/* Circular Calorie Gauge */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-slate-800"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * caloriePct) / 100}
                        strokeLinecap="round"
                        className="text-emerald-400 transition-all duration-1000 ease-out"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center text-center">
                      <span className="text-3xl font-extrabold text-white tracking-tight">{totalCaloriesToday}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">/ {user.targetCalories} kcal</span>
                    </div>
                  </div>

                  {/* Remaining Stats */}
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-xs text-slate-400">Consumido</p>
                        <p className="text-sm font-semibold text-white">{totalCaloriesToday} kcal</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div>
                        <p className="text-xs text-slate-400">Restante</p>
                        <p className="text-sm font-semibold text-slate-300">
                          {Math.max(0, user.targetCalories - totalCaloriesToday)} kcal
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macro Progress Bars */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                  {/* Protein */}
                  <div className="bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-rose-400 font-semibold">Proteína</span>
                      <span className="text-slate-400">{totalProteinToday}g</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (totalProteinToday / user.targetProtein) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-amber-400 font-semibold">Carbos</span>
                      <span className="text-slate-400">{totalCarbsToday}g</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (totalCarbsToday / user.targetCarbs) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Fat */}
                  <div className="bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-sky-400 font-semibold">Grasas</span>
                      <span className="text-slate-400">{totalFatToday}g</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (totalFatToday / user.targetFat) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Banner for Scanner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Escanear Comida con IA</h3>
                    <p className="text-xs text-slate-400">Sube una foto y calcula macros al instante</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('camera')}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
                >
                  Escanear
                </button>
              </div>

              {/* Logged Meals History */}
              <div>
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Historial de Registro</h3>
                  <span className="text-xs text-slate-500">{loggedMeals.length} comidas hoy</span>
                </div>

                {loggedMeals.length === 0 ? (
                  <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-500">
                    <Flame className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No has registrado ninguna comida hoy.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {loggedMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-between hover:bg-slate-800 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <h4 className="font-semibold text-sm text-white">{meal.name}</h4>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                              <span className="text-emerald-400 font-bold">{meal.calories} kcal</span>
                              <span>•</span>
                              <span>P: {meal.protein}g</span>
                              <span>C: {meal.carbs}g</span>
                              <span>G: {meal.fat}g</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setLoggedMeals(loggedMeals.filter(m => m.id !== meal.id))}
                          className="p-2 text-slate-500 hover:text-rose-400 transition rounded-lg hover:bg-slate-700/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CAMERA / SCANNER INPUT TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-white">Escanear Plato</h2>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-3xl p-8 text-center bg-slate-900/50 transition flex flex-col items-center justify-center min-h-[220px]">
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full mb-3">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">Sube una foto de tu plato</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-[200px]">
                  Toma una foto con tu cámara o selecciona una imagen de tu galería
                </p>

                <label className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition shadow-lg shadow-emerald-500/20">
                  Seleccionar Imagen
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          analyzeFoodImage(reader.result, true);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Demo Preset Samples */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  O prueba con un ejemplo
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {SAMPLE_MEALS.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => analyzeFoodImage(sample.image, false)}
                      className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/50 transition relative"
                    >
                      <img
                        src={sample.image}
                        alt={sample.name}
                        className="w-full h-28 object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="p-2.5">
                        <p className="text-xs font-bold text-white truncate">{sample.name}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">{sample.totales.calorias} kcal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Mode indicator */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Modo de IA:</span>
                <span className={`font-semibold ${apiKey ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {apiKey ? 'API Gemini (En Vivo)' : 'Simulación Demo'}
                </span>
              </div>
            </div>
          )}

          {/* ANALYSIS & PORTION ADJUSTMENT TAB */}
          {activeTab === 'analysis' && (
            <div className="space-y-5 animate-fadeIn">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <p className="font-bold text-white text-base">Escaneando comida con IA...</p>
                  <p className="text-xs text-slate-400 max-w-[220px] text-center">
                    Identificando ingredientes y calculando porciones nutricionales
                  </p>
                </div>
              ) : currentMeal ? (
                <div className="space-y-4">
                  {/* Image Preview with Visual AI Bounding Box Overlays */}
                  <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                    <img
                      src={currentMeal.image}
                      alt={currentMeal.name}
                      className="w-full h-56 object-cover"
                    />

                    {/* Simulated Bounding Box Overlays */}
                    {currentMeal.ingredientes?.map((ing) => (
                      <div
                        key={ing.id}
                        className="absolute border-2 border-emerald-400 bg-emerald-400/20 rounded-lg backdrop-blur-xs flex items-start p-1 transition hover:bg-emerald-400/30"
                        style={{
                          top: `${ing.bbox[0]}%`,
                          left: `${ing.bbox[1]}%`,
                          width: `${ing.bbox[2]}%`,
                          height: `${ing.bbox[3]}%`
                        }}
                      >
                        <span className="bg-slate-950/90 text-emerald-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/40 shadow">
                          {ing.nombre}
                        </span>
                      </div>
                    ))}

                    <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-slate-300 border border-slate-800">
                      ✨ IA Visual Activada
                    </div>
                  </div>

                  {/* Header Title */}
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentMeal.name}</h2>
                    <p className="text-xs text-slate-400">{currentMeal.summary}</p>
                  </div>

                  {/* Summary Totals */}
                  <div className="grid grid-cols-4 gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Calorías</p>
                      <p className="text-base font-extrabold text-emerald-400">{currentMeal.totales.calorias}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Proteína</p>
                      <p className="text-sm font-bold text-rose-400">{currentMeal.totales.proteinas}g</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Carbos</p>
                      <p className="text-sm font-bold text-amber-400">{currentMeal.totales.carbohidratos}g</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Grasas</p>
                      <p className="text-sm font-bold text-sky-400">{currentMeal.totales.grasas}g</p>
                    </div>
                  </div>

                  {/* Interactive Ingredient Portion Adjustment */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ajustar Porciones</h3>
                      <span className="text-[11px] text-slate-500">Desliza para cambiar gramos</span>
                    </div>

                    <div className="space-y-2.5">
                      {currentMeal.ingredientes?.map((ing) => (
                        <div key={ing.id} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-white">{ing.nombre}</span>
                            <span className="text-emerald-400 font-bold">{ing.gramos}g ({ing.calorias} kcal)</span>
                          </div>

                          <input
                            type="range"
                            min="10"
                            max="400"
                            step="5"
                            value={ing.gramos}
                            onChange={(e) => handleIngredientGramChange(ing.id, parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                          />

                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>P: {ing.proteinas}g</span>
                            <span>C: {ing.carbohidratos}g</span>
                            <span>G: {ing.grasas}g</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2">
                    <button
                      onClick={saveMealToLog}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Confirmar y Guardar Comida</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className="text-lg font-bold text-white">Análisis Nutricional</h2>

              <div className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distribución de Macros</h3>
                <div className="flex h-4 rounded-full overflow-hidden bg-slate-900">
                  <div style={{ width: '40%' }} className="bg-rose-500" />
                  <div style={{ width: '45%' }} className="bg-amber-400" />
                  <div style={{ width: '15%' }} className="bg-sky-400" />
                </div>
                <div className="flex justify-around text-xs pt-1">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-slate-300">Proteína 40%</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-slate-300">Carbos 45%</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span className="text-slate-300">Grasa 15%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Award className="w-5 h-5" />
                  <span>Racha Activa: 4 Días</span>
                </div>
                <p className="text-xs text-slate-400">
                  ¡Vas por buen camino! Has alcanzado tu objetivo proteico en 3 de los últimos 4 días.
                </p>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className="text-lg font-bold text-white">Configuración</h2>

              {/* Gemini API Key Configuration */}
              <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Key className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-white">API Key de Google Gemini</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Ingresa tu API Key gratuita de Gemini para activar el reconocimiento en tiempo real con la cámara.
                </p>

                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Guarda automáticamente en tu navegador</span>
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline"
                  >
                    Obtener Key
                  </a>
                </div>
              </div>

              {/* User Goals Setup */}
              <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Target className="w-5 h-5" />
                  <h3 className="font-bold text-sm text-white">Metas Diarias</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Meta de Calorías (kcal)</label>
                    <input
                      type="number"
                      value={user.targetCalories}
                      onChange={(e) => setUser({ ...user, targetCalories: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Proteína (g)</label>
                      <input
                        type="number"
                        value={user.targetProtein}
                        onChange={(e) => setUser({ ...user, targetProtein: parseInt(e.target.value) || 0 })}
                        className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Carbos (g)</label>
                      <input
                        type="number"
                        value={user.targetCarbs}
                        onChange={(e) => setUser({ ...user, targetCarbs: parseInt(e.target.value) || 0 })}
                        className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Grasa (g)</label>
                      <input
                        type="number"
                        value={user.targetFat}
                        onChange={(e) => setUser({ ...user, targetFat: parseInt(e.target.value) || 0 })}
                        className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 px-6 flex items-center justify-between z-40">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-medium">Inicio</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Métricas</span>
          </button>

          {/* Floating Central Camera Button */}
          <div className="relative -top-4">
            <button
              onClick={() => setActiveTab('camera')}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 hover:scale-105 transition transform active:scale-95"
            >
              <Camera className="w-7 h-7" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeTab === 'settings' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium">Ajustes</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="flex flex-col items-center space-y-1 text-slate-500 hover:text-slate-300"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
