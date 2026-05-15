import React, { useMemo } from 'react';
import { useData } from '../lib/DataContext';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DimensionView({ dimensionId }: { dimensionId: string }) {
  const { plan, progress, currentDate, updateProgress } = useData();
  
  if (!plan || !progress) return null;

  const dimension = plan.dimensions.find(d => d.id === dimensionId);
  if (!dimension) return <div>Dimensión no encontrada.</div>;

  const currentDayProgress = progress.days[currentDate] || {};

  // Compute monthly totals
  const monthlyTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    Object.values(progress.days).forEach(dayVals => {
      Object.entries(dayVals).forEach(([key, val]) => {
        totals[key] = (totals[key] || 0) + val;
      });
    });
    return totals;
  }, [progress.days]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8 animate-in fade-in duration-300">
      {dimension.areas.map(area => {
        // Calculate area completion
        let totalMeta = 0;
        let totalAvance = 0;
        area.activities.forEach(act => {
           totalMeta += act.goal;
           const key = `${dimensionId}_${area.id}_${act.id}`;
           totalAvance += Math.min(act.goal, monthlyTotals[key] || 0);
        });
        const areaCompletion = totalMeta > 0 ? (totalAvance / totalMeta) : 0;

        return (
          <div key={area.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 h-full shadow-sm relative overflow-hidden">
             {/* Header */}
             <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-slate-700 uppercase tracking-wide text-sm z-10">{area.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-cyan-50 text-cyan-800 border border-cyan-100 z-10">
                   {Math.round(areaCompletion * 100)}% Completado
                </span>
             </div>
             
             {/* Rows */}
             <div className="flex flex-col gap-1 z-10">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-2 items-center text-slate-400 font-semibold px-1 py-1 border-b border-transparent">
                   <span className="text-[10px] uppercase tracking-wider">Actividad</span>
                   <span className="text-[10px] uppercase tracking-wider text-center">Meta</span>
                   <span className="text-[10px] uppercase tracking-wider text-center">Avance</span>
                   <span className="text-[10px] uppercase tracking-wider text-center">Visual</span>
                </div>
                {area.activities.map(act => {
                   const key = `${dimensionId}_${area.id}_${act.id}`;
                   const currentVal = currentDayProgress[key];
                   const monthlyTotal = monthlyTotals[key] || 0;
                   const pct = act.goal > 0 ? (monthlyTotal / act.goal) * 100 : 0;

                   return (
                      <div key={act.id} className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-2 items-center text-[13px] py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-1 rounded-sm transition-colors">
                         <span className="font-medium text-slate-700 truncate pr-2 pt-0.5" title={act.name}>{act.name}</span>
                         <div className="flex justify-center">
                            <input className="border border-slate-200 rounded px-1.5 py-0.5 w-[50px] text-[12px] text-center bg-slate-50 text-slate-500 font-medium" value={act.goal} disabled />
                         </div>
                         <div className="flex justify-center">
                            <input 
                               type="number" 
                               min="0" 
                               className="border border-slate-300 rounded px-1.5 py-0.5 w-[50px] text-[12px] text-center focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 font-medium text-slate-800" 
                               value={currentVal === undefined ? '' : currentVal} 
                               placeholder="-" 
                               title={`Avance de hoy para ${act.name}`}
                               onChange={(e) => {
                                 const valText = e.target.value;
                                 if (valText === '') {
                                    updateProgress(dimensionId, area.id, act.id, 0); // or delete key if wanted, 0 is fine
                                 } else {
                                    const val = parseInt(valText, 10);
                                    updateProgress(dimensionId, area.id, act.id, isNaN(val) ? 0 : val);
                                 }
                               }} 
                            />
                         </div>
                         <div className="flex items-center group relative">
                            <div className="h-2 bg-slate-100 w-full rounded-full overflow-hidden shadow-inner">
                               <div className="h-full bg-cyan-600 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, pct)}%` }} />
                            </div>
                            <div className="absolute opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] rounded px-2 py-1 -top-6 right-0 transition-opacity uppercase font-bold tracking-widest whitespace-nowrap shadow-md pointer-events-none z-50">
                               {Math.round(pct)}% ({monthlyTotal} acumulado)
                            </div>
                         </div>
                      </div>
                   )
                })}
             </div>
          </div>
        )
      })}
    </div>
  );
}
