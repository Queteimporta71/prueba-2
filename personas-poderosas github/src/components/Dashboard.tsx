import React, { useState, useMemo } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useData } from '../lib/DataContext';
import { LogOut, ChevronLeft, ChevronRight, Settings, Users, PenTool, CheckCircle, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import DimensionView from './DimensionView';
import EditPlan from './EditPlan';
import AdminPanel from './AdminPanel';
import { format, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const dimensionColors: Record<string, string> = {
  familiar: "bg-cyan-600",
  personal: "bg-emerald-500",
  social: "bg-amber-500",
  laboral: "bg-purple-500",
  economica: "bg-rose-500",
  espiritual: "bg-indigo-500"
};

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const { plan, progress, loading, currentDate, setDate } = useData();
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [viewMode, setViewMode] = useState<'dashboard' | 'edit-plan' | 'admin'>('dashboard');

  if (loading || !plan || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        Cargando datos del usuario...
      </div>
    );
  }

  const handlePrevDay = () => setDate(format(subDays(new Date(currentDate), 1), 'yyyy-MM-dd'));
  const handleNextDay = () => setDate(format(addDays(new Date(currentDate), 1), 'yyyy-MM-dd'));
  const handleSetToday = () => setDate(format(new Date(), 'yyyy-MM-dd'));

  const activeDim = plan.dimensions.find(d => d.id === activeTab);

  let content;
  if (viewMode === 'edit-plan') {
    content = <EditPlan onDone={() => setViewMode('dashboard')} />;
  } else if (viewMode === 'admin') {
    content = <AdminPanel onDone={() => setViewMode('dashboard')} />;
  } else {
    content = <DimensionView dimensionId={activeTab} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-slate-900 text-white flex flex-col shrink-0 transition-all duration-300">
         <div className="p-8 pb-4 text-xl font-bold tracking-tight text-cyan-500">
            Personas Poderosas
         </div>
         <div className="px-8 py-2 mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Dimensiones
         </div>
         <nav className="flex-1 overflow-y-auto">
            {plan.dimensions.map(dim => {
               const isActive = activeTab === dim.id && viewMode === 'dashboard';
               return (
                 <button
                   key={dim.id}
                   onClick={() => { setActiveTab(dim.id); setViewMode('dashboard'); }}
                   className={cn(
                     "w-full text-left px-6 py-3 flex items-center gap-3 transition-colors text-sm font-medium",
                     isActive ? "bg-slate-800 border-l-4 border-cyan-500 opacity-100" : "opacity-70 hover:opacity-100 hover:bg-slate-800/50 border-l-4 border-transparent"
                   )}
                 >
                   <span className={cn("w-2 h-2 rounded-full", dimensionColors[dim.id] || "bg-gray-500")}></span>
                   {dim.name}
                 </button>
               )
            })}
         </nav>
         <div className="mt-auto border-t border-slate-800">
           {profile?.isAdmin && (
             <button onClick={() => setViewMode('admin')} className="w-full text-left p-6 text-xs text-slate-300 hover:bg-slate-800 transition-colors flex flex-col gap-2">
                <span className="text-slate-500 uppercase tracking-widest font-semibold">Administrador</span>
                <span className="flex items-center gap-2 font-medium text-sm">
                   <span className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center"><Users size={14}/></span>
                   Gestionar Usuarios
                </span>
             </button>
           )}
           {viewMode !== 'edit-plan' && (
             <button onClick={() => setViewMode('edit-plan')} className="w-full text-left px-6 py-4 text-xs text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2 border-t border-slate-800">
               <Settings size={14} className="text-slate-500" />
               <span className="font-medium text-sm">Configurar Plan</span>
             </button>
           )}
           <button onClick={signOut} className="w-full text-left px-6 py-4 text-xs text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-2 border-t border-slate-800">
             <LogOut size={14} />
             <span className="font-medium text-sm">Cerrar Sesión</span>
           </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
         <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm relative">
            {viewMode === 'dashboard' ? (
              <>
                 <div>
                    <div className="flex items-center gap-3">
                       <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          Dimensión: {activeDim?.name}
                       </h1>
                       <div className="flex bg-slate-100 rounded-lg p-0.5 ml-4 border border-slate-200">
                          <button onClick={handlePrevDay} className="p-1 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-colors"><ChevronLeft size={16}/></button>
                          <button onClick={handleSetToday} className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-white rounded hover:shadow-sm transition-colors">
                             {format(new Date(currentDate), "dd MMM yyyy", { locale: es })}
                          </button>
                          <button onClick={handleNextDay} className="p-1 hover:bg-white rounded hover:shadow-sm text-slate-500 transition-colors"><ChevronRight size={16}/></button>
                       </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 ml-[104px]">Seguimiento diario de metas y avance. ¡Registra tus logros para el día seleccionado!</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Usuario Activo</span>
                       <span className="text-sm font-semibold text-slate-700">{profile?.name}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold uppercase border border-cyan-200 shadow-sm">
                       {profile?.name?.charAt(0) || 'U'}
                    </div>
                 </div>
              </>
            ) : viewMode === 'edit-plan' ? (
              <>
                 <div>
                    <h1 className="text-xl font-bold text-slate-800">Configurar Plan</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Personaliza áreas y actividades</p>
                 </div>
                 <button onClick={() => setViewMode('dashboard')} className="text-sm font-medium text-slate-500 hover:text-slate-800">Cerrar</button>
              </>
            ) : (
              <>
                 <div>
                    <h1 className="text-xl font-bold text-slate-800">Administración</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Gestionar Usuarios</p>
                 </div>
                 <button onClick={() => setViewMode('dashboard')} className="text-sm font-medium text-slate-500 hover:text-slate-800">Cerrar</button>
              </>
            )}
         </header>
         
         {/* the content container needs to be fixed to the available height using flex-1 and overflow-auto */}
         <div className="flex-1 overflow-auto p-8 relative">
            {content}
         </div>
         
         <footer className="mt-auto p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500 uppercase tracking-widest font-semibold shrink-0">
           <div>Código de Acceso: {profile?.codeUsed}</div>
           <div>© 2023 Personas Poderosas App</div>
           <div>Versión Móvil Disponible para Descarga</div>
         </footer>
      </main>
    </div>
  );
}
