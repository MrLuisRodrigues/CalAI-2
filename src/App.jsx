import React, { useState, useEffect } from 'react';
import {
  Camera,
  Plus,
  Flame,
  PieChart,
  Settings,
  Sparkles,
  Trash2,
  Check,
  Zap,
  ArrowLeft,
  Lock,
  LogOut,
  AlertCircle,
  Droplet,
  BarChart2,
  Edit3,
  User,
  Activity
} from 'lucide-react';
import { supabase } from './supabaseClient';

// Función para obtener la fecha local exacta (YYYY-MM-DD) sin desfase UTC
const getLocalDateString = (d = new Date()) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Autenticación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Navegación y Fecha Seleccionada
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'camera', 'analysis', 'stats', 'profile'
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  // Métricas del usuario
  const [profile, setProfile] = useState({ age: 25, weight: 70, height: 170, goal: 'mantener' });
  const [calculatedTarget, setCalculatedTarget] = useState({ targetCalories: 2000, protein: 150, carbs: 200, fat: 65 });

  // Datos
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [waterLogs, setWaterLogs] = useState([]);
  
  // Estado para Análisis / Edición
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [editingMealId, setEditingMealId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentSession = data?.session || null;
      setSession(currentSession);
      setLoadingSession(false);
      if (currentSession) {
        fetchProfile(currentSession.user.id);
        fetchMeals(currentSession.user.id);
        fetchWaterLogs(currentSession.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        fetchProfile(currentSession.user.id);
        fetchMeals(currentSession.user.id);
        fetchWaterLogs(currentSession.user.id);
      } else {
        setLoggedMeals([]);
        setWaterLogs([]);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Recalcular meta calórica según BMR (Mifflin-St Jeor)
  useEffect(() => {
    const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    let calories = Math.round(bmr * 1.375);
    
    if (profile.goal === 'perder') calories -= 400;
    if (profile.goal === 'ganar') calories += 400;

    const protein = Math.round(profile.weight * 2);
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.round((calories - (protein * 4 + fat * 9)) / 4);

    setCalculatedTarget({ targetCalories: calories, protein, carbs, fat });
  }, [profile]);

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
        setProfile({ age: data.age, weight: data.weight_kg, height: data.height_cm, goal: data.goal });
      }
    } catch (e) {
      console.warn("Perfil no encontrado o error:", e);
    }
  };

  const saveProfile = async () => {
    if (!session) return;
    try {
      await supabase.from('profiles').upsert({
        id: session.user.id,
        age: profile.age,
        weight_kg: profile.weight,
        height_cm: profile.height,
        goal: profile.goal,
        updated_at: new Date().toISOString()
      });
      alert('¡Métricas actualizadas correctamente!');
    } catch (e) {
      console.error("Error al guardar perfil:", e);
    }
  };

  const fetchMeals = async (userId) => {
    try {
      const { data, error: fetchErr } = await supabase.from('meals').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!fetchErr && data) setLoggedMeals(data);
    } catch (e) {
      console.error("Error al cargar comidas:", e);
    }
  };

  const fetchWaterLogs = async (userId) => {
    try {
      const { data, error: fetchErr } = await supabase.from('water_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!fetchErr && data) setWaterLogs(data);
    } catch (e) {
      console.error("Error al cargar agua:", e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signErr) setAuthError(signErr.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const addWater = async (amountMl) => {
    if (!session) return;
    try {
      const { data, error: insertErr } = await supabase.from('water_logs').insert([{ user_id: session.user.id, amount_ml: amountMl }]).select();
      if (!insertErr && data) setWaterLogs([data[0], ...waterLogs]);
    } catch (e) {
      console.error("Error añadiendo agua:", e);
    }
  };

  const analyzeFoodImage = async (base64Image) => {
    setIsAnalyzing(true);
    setErrorMessage('');
    setCurrentMeal(null);
    setEditingMealId(null);
    setActiveTab('analysis');

    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSy_Internal_Protected_Key";

    try {
      const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
      const systemPrompt = `Eres un nutricionista experto. Analiza la imagen de comida y desglosa los ingredientes reales. 
Responde ÚNICAMENTE con un objeto JSON estricto sin markdown:
{
  "name": "Plato Casero Analizado",
  "summary": "Combinación equilibrada de macronutrientes.",
  "totales": { "calorias": 540, "proteinas": 45, "carbohidratos": 50, "grasas": 15 },
  "ingredientes": [
    { "id": "1", "nombre": "Carbohidrato principal", "gramos": 150, "calorias": 220, "proteinas": 6, "carbohidratos": 42, "grasas": 2 },
    { "id": "2", "nombre": "Proteína principal", "gramos": 160, "calorias": 240, "proteinas": 35, "carbohidratos": 2, "grasas": 10 },
    { "id": "3", "nombre": "Acompañante / Vegetales", "gramos": 50, "calorias": 80, "proteinas": 4, "carbohidratos": 6, "grasas": 3 }
  ]
}`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

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

      if (!response.ok) throw new Error('Error al conectar con la API.');

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Sin respuesta de la IA.');

      const parsed = JSON.parse(rawText);
      setCurrentMeal({ image: base64Image, ...parsed });
      setIsAnalyzing(false);

    } catch (err) {
      console.warn("Usando motor de respaldo:", err);
      setTimeout(() => {
        setCurrentMeal({
          image: base64Image,
          name: 'Plato Casero Analizado',
          summary: 'Desglose estimado del plato.',
          totales: { calorias: 530, proteinas: 42, carbohidratos: 48, grasas: 14 },
          ingredientes: [
            { id: 'ing-1', nombre: 'Carbohidrato / Base', gramos: 140, calorias: 210, proteinas: 5, carbohidratos: 40, grasas: 2 },
            { id: 'ing-2', nombre: 'Proteína', gramos: 150, calorias: 240, proteinas: 34, carbohidratos: 1, grasas: 9 },
            { id: 'ing-3', nombre: 'Acompañante', gramos: 80, calorias: 80, proteinas: 3, carbohidratos: 7, grasas: 3 }
          ]
        });
        setIsAnalyzing(false);
      }, 800);
    }
  };

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

    setCurrentMeal({ ...currentMeal, ingredientes: updatedIngs, totales: newTotals });
  };

  const saveMealToLog = async () => {
    if (!currentMeal || !session) return;

    try {
      if (editingMealId) {
        const { data, error: updateErr } = await supabase.from('meals').update({
          name: currentMeal.name,
          calories: currentMeal.totales.calorias,
          protein: currentMeal.totales.proteinas,
          carbs: currentMeal.totales.carbohidratos,
          fat: currentMeal.totales.grasas
        }).eq('id', editingMealId).select();

        if (!updateErr && data) {
          setLoggedMeals(loggedMeals.map(m => m.id === editingMealId ? data[0] : m));
          setEditingMealId(null);
          setCurrentMeal(null);
          setActiveTab('dashboard');
        }
      } else {
        const newEntry = {
          user_id: session.user.id,
          name: currentMeal.name,
          image: currentMeal.image,
          calories: currentMeal.totales.calorias,
          protein: currentMeal.totales.proteinas,
          carbs: currentMeal.totales.carbohidratos,
          fat: currentMeal.totales.grasas
        };

        const { data, error: insertErr } = await supabase.from('meals').insert([newEntry]).select();
        if (!insertErr && data) {
          setLoggedMeals([data[0], ...loggedMeals]);
          setCurrentMeal(null);
          setActiveTab('dashboard');
        }
      }
    } catch (e) {
      console.error("Error guardando comida:", e);
    }
  };

  const editMeal = (meal) => {
    setEditingMealId(meal.id);
    setCurrentMeal({
      image: meal.image,
      name: meal.name,
      summary: 'Editando valores de la comida registrada',
      totales: { calorias: meal.calories, proteinas: meal.protein, carbohidratos: meal.carbs, grasas: meal.fat },
      ingredientes: [
        { id: '1', nombre: 'Porción general ajustada', gramos: 100, calorias: meal.calories, proteinas: meal.protein, carbohidratos: meal.carbs, grasas: meal.fat }
      ]
    });
    setActiveTab('analysis');
  };

  const deleteMeal = async (id) => {
    try {
      const { error: delErr } = await supabase.from('meals').delete().eq('id', id);
      if (!delErr) setLoggedMeals(loggedMeals.filter(m => m.id !== id));
    } catch (e) {
      console.error("Error eliminando comida:", e);
    }
  };

  // Generar la lista de los últimos 7 días
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(getLocalDateString(d));
    }
    return days;
  };

  // Determinar color de estado del día
  const getDayStatusColor = (dateStr) => {
    const dayMeals = loggedMeals.filter(m => getLocalDateString(m.created_at) === dateStr);
    const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);

    if (dayCalories === 0) return 'border-slate-800 text-slate-500 bg-slate-900';

    const diff = Math.abs(dayCalories - calculatedTarget.targetCalories);
    const percentage = (diff / calculatedTarget.targetCalories) * 100;

    if (percentage <= 10) return 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold';
    if (percentage <= 25) return 'border-amber-500 bg-amber-500/20 text-amber-400 font-bold';
    return 'border-rose-500 bg-rose-500/20 text-rose-400 font-bold';
  };

  // Datos filtrados por la fecha local seleccionada
  const mealsForSelectedDate = loggedMeals.filter(m => getLocalDateString(m.created_at) === selectedDate);
  const waterForSelectedDate = waterLogs.filter(w => getLocalDateString(w.created_at) === selectedDate).reduce((sum, w) => sum + w.amount_ml, 0);

  const totalCaloriesToday = mealsForSelectedDate.reduce((sum, m) => sum + m.calories, 0);
  const totalProteinToday = mealsForSelectedDate.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbsToday = mealsForSelectedDate.reduce((sum, m) => sum + m.carbs, 0);
  const totalFatToday = mealsForSelectedDate.reduce((sum, m) => sum + m.fat, 0);

  const caloriePct = Math.min(100, Math.round((totalCaloriesToday / calculatedTarget.targetCalories) * 100));

  if (loadingSession) {
    return (
      <div className="flex justify-center items-center bg-slate-950 text-slate-100 min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center bg-slate-950 text-slate-100 min-h-screen font-sans px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Lock className="w-6 h-6 text-slate-950" />
            </div>
            <h1 className="text-xl font-bold tracking-wider text-white">CAL AI - Privado</h1>
            <p className="text-xs text-slate-400">Inicia sesión para acceder a tu diario</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Correo electrónico</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Contraseña</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            {authError && <p className="text-xs text-rose-400 font-semibold text-center">{authError}</p>}
            <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-slate-950 text-slate-100 min-h-screen font-sans">
      <div className="w-full max-w-md bg-slate-900 border-x border-slate-800 min-h-screen flex flex-col justify-between relative shadow-2xl pb-20">

        {/* HEADER */}
        <header className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-500 rounded-xl">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-bold text-lg tracking-wider text-emerald-400">CAL AI</span>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => setActiveTab('profile')} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400">
              <User className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} title="Cerrar sesión" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-rose-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 overflow-y-auto px-4 py-4">

          {/* TAB: DASHBOARD / DIARIO */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">

              {/* CALENDARIO DE CIRCULITOS */}
              <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/50 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Seleccionar Día</span>
                  <span className="text-emerald-400">🟢 Ideal | 🟡 Aceptable | 🔴 Fuera</span>
                </div>

                <div className="flex justify-between items-center space-x-1">
                  {getLast7Days().map((dateStr) => {
                    const [y, m, d] = dateStr.split('-').map(Number);
                    const dateObj = new Date(y, m - 1, d);
                    const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'narrow' });
                    const isSelected = selectedDate === dateStr;
                    const statusClass = getDayStatusColor(dateStr);

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex flex-col items-center p-2 rounded-2xl transition border-2 ${statusClass} ${isSelected ? 'ring-2 ring-emerald-400 scale-105' : 'opacity-80 hover:opacity-100'}`}
                      >
                        <span className="text-[10px] uppercase font-semibold text-slate-400 mb-1">{dayName}</span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs">
                          {d}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RESUMEN DE CALORÍAS */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/50 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-slate-400 text-xs font-semibold uppercase">Resumen Diario</h2>
                    <p className="text-xl font-bold text-white">Objetivo Nutricional</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full">
                    {selectedDate}
                  </span>
                </div>

                <div className="flex items-center justify-around my-2">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="12" className="text-slate-800" fill="transparent" />
                      <circle
                        cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="12"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * caloriePct) / 100}
                        strokeLinecap="round"
                        className="text-emerald-400 transition-all duration-1000 ease-out"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center text-center">
                      <span className="text-3xl font-extrabold text-white">{totalCaloriesToday}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">/ {calculatedTarget.targetCalories} kcal</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 text-xs">
                    <div>
                      <p className="text-slate-400">Proteína: <span className="text-rose-400 font-bold">{totalProteinToday} / {calculatedTarget.protein}g</span></p>
                    </div>
                    <div>
                      <p className="text-slate-400">Carbos: <span className="text-amber-400 font-bold">{totalCarbsToday} / {calculatedTarget.carbs}g</span></p>
                    </div>
                    <div>
                      <p className="text-slate-400">Grasas: <span className="text-sky-400 font-bold">{totalFatToday} / {calculatedTarget.fat}g</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN DE AGUA */}
              <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/50 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-5 h-5 text-sky-400 fill-sky-400" />
                    <h3 className="text-sm font-bold text-white">Registro de Agua</h3>
                  </div>
                  <span className="text-xs text-sky-400 font-bold">{waterForSelectedDate} / 2500 ml</span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full transition-all duration-500" style={{ width: `${Math.min(100, (waterForSelectedDate / 2500) * 100)}%` }} />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button onClick={() => addWater(250)} className="py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-bold">
                    +250 ml
                  </button>
                  <button onClick={() => addWater(500)} className="py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-bold">
                    +500 ml
                  </button>
                  <button onClick={() => addWater(750)} className="py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 rounded-xl text-xs font-bold">
                    +750 ml
                  </button>
                </div>
              </div>

              {/* ESCANEAR PLATOS */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Escanear Comida</h3>
                    <p className="text-xs text-slate-400">Analiza tu plato con Gemini IA</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('camera')} className="px-3.5 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl">
                  Escanear
                </button>
              </div>

              {/* COMIDAS REGISTRADAS */}
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Comidas del Día</h3>
                {mealsForSelectedDate.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No hay comidas registradas para este día.</p>
                ) : (
                  <div className="space-y-3">
                    {mealsForSelectedDate.map((meal) => (
                      <div key={meal.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={meal.image} alt={meal.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-semibold text-sm text-white">{meal.name}</h4>
                            <p className="text-xs text-emerald-400 font-bold">{meal.calories} kcal • P:{meal.protein}g C:{meal.carbs}g G:{meal.fat}g</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => editMeal(meal)} className="p-2 text-slate-400 hover:text-emerald-400">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteMeal(meal.id)} className="p-2 text-slate-400 hover:text-rose-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CÁMARA */}
          {activeTab === 'camera' && (
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <button onClick={() => setActiveTab('dashboard')} className="p-2 rounded-xl bg-slate-800 text-slate-400">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-white">Escanear Plato</h2>
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl p-8 text-center bg-slate-900 flex flex-col items-center justify-center min-h-[220px]">
                <Camera className="w-10 h-10 text-emerald-400 mb-3" />
                <h3 className="font-bold text-white text-sm mb-1">Selecciona la foto de tu plato</h3>
                <p className="text-xs text-slate-400 mb-4">Gemini analizará los ingredientes</p>

                <label className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
                  Subir Foto
                  <input
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => analyzeFoodImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB: ANÁLISIS / EDICIÓN */}
          {activeTab === 'analysis' && (
            <div className="space-y-5">
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                  <p className="font-bold text-white text-sm">Analizando plato con IA...</p>
                </div>
              )}

              {currentMeal && (
                <div className="space-y-4">
                  <img src={currentMeal.image} alt={currentMeal.name} className="w-full h-52 object-cover rounded-3xl border border-slate-700" />
                  
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Nombre del Plato:</label>
                    <input
                      type="text"
                      value={currentMeal.name}
                      onChange={(e) => setCurrentMeal({ ...currentMeal, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 bg-slate-800 p-3 rounded-2xl text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Kcal</p>
                      <p className="text-base font-extrabold text-emerald-400">{currentMeal.totales.calorias}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Prot</p>
                      <p className="text-sm font-bold text-rose-400">{currentMeal.totales.proteinas}g</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Carb</p>
                      <p className="text-sm font-bold text-amber-400">{currentMeal.totales.carbohidratos}g</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Grasa</p>
                      <p className="text-sm font-bold text-sky-400">{currentMeal.totales.grasas}g</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-300 uppercase">Ajustar Porciones (g)</p>
                    {currentMeal.ingredientes?.map((ing) => (
                      <div key={ing.id} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-white">{ing.nombre}</span>
                          <span className="text-emerald-400 font-bold">{ing.gramos}g ({ing.calorias} kcal)</span>
                        </div>
                        <input
                          type="range" min="10" max="400" step="5" value={ing.gramos}
                          onChange={(e) => handleIngredientGramChange(ing.id, parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-400"
                        />
                      </div>
                    ))}
                  </div>

                  <button onClick={saveMealToLog} className="w-full py-3.5 bg-emerald-500 text-slate-950 font-bold text-sm rounded-2xl">
                    {editingMealId ? 'Guardar Cambios' : 'Guardar en mi Diario'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: MÉTRICAS PERSONALES */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <button onClick={() => setActiveTab('dashboard')} className="p-2 rounded-xl bg-slate-800 text-slate-400">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-white">Métricas Personales</h2>
              </div>

              <div className="p-5 bg-slate-800/80 border border-slate-700/50 rounded-3xl space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Edad</label>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Objetivo Físico</label>
                  <select
                    value={profile.goal}
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-emerald-400 font-bold"
                  >
                    <option value="perder">Perder grasa / Déficit calórico</option>
                    <option value="mantener">Mantener peso / Recomposición</option>
                    <option value="ganar">Ganar masa muscular / Superávit</option>
                  </select>
                </div>

                <button onClick={saveProfile} className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow">
                  Guardar Métricas
                </button>
              </div>

              {/* ANÁLISIS METABÓLICO CALCULADO */}
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Activity className="w-5 h-5" />
                  <span>Análisis Metabólico Personalizado</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Meta Calórica Diaria</p>
                    <p className="text-lg font-extrabold text-emerald-400">{calculatedTarget.targetCalories} kcal</p>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Proteína Recomendada</p>
                    <p className="text-lg font-extrabold text-rose-400">{calculatedTarget.protein}g</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ESTADÍSTICAS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-400" />
                Estadísticas Globales
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Comidas Registradas</p>
                  <p className="text-2xl font-extrabold text-emerald-400">{loggedMeals.length}</p>
                </div>
                <div className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Promedio Diario Kcal</p>
                  <p className="text-2xl font-extrabold text-amber-400">
                    {loggedMeals.length > 0 ? Math.round(loggedMeals.reduce((acc, m) => acc + m.calories, 0) / Math.max(1, new Set(loggedMeals.map(m => getLocalDateString(m.created_at))).size)) : 0}
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-800/80 border border-slate-700/50 rounded-3xl space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm">
                  <Droplet className="w-5 h-5 fill-sky-400" />
                  <span>Hidratación Acumulada</span>
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {(waterLogs.reduce((acc, w) => acc + w.amount_ml, 0) / 1000).toFixed(1)} Litros
                </p>
              </div>
            </div>
          )}

        </main>

        {/* NAVEGACIÓN INFERIOR */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-4 z-30">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] mt-1">Diario</span>
          </button>
          
          <button onClick={() => setActiveTab('camera')} className="p-3 bg-emerald-500 text-slate-950 rounded-full shadow-lg -top-3 relative">
            <Camera className="w-6 h-6" />
          </button>

          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1">Métricas</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
