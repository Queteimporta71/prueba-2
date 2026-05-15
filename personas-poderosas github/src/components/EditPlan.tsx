import React, { useState } from 'react';
import { useData } from '../lib/DataContext';
import { Plan, Dimension } from '../types';
import { Save, ChevronLeft, PenTool, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function EditPlan({ onDone }: { onDone: () => void }) {
  const { plan, updatePlan } = useData();
  const [draftPlan, setDraftPlan] = useState<Plan>(() => JSON.parse(JSON.stringify(plan)));
  const [activeTab, setActiveTab] = useState<string>(draftPlan.dimensions[0]?.id || '');
  const [saving, setSaving] = useState(false);

  if (!plan) return null;

  const handleSave = async () => {
    setSaving(true);
    await updatePlan(draftPlan);
    setSaving(false);
    onDone();
  };

  const updateActivityName = (dimId: string, areaId: string, actId: string, name: string) => {
    setDraftPlan(prev => {
      const dp = { ...prev };
      const dim = dp.dimensions.find(d => d.id === dimId);
      if (!dim) return prev;
      const area = dim.areas.find(a => a.id === areaId);
      if (!area) return prev;
      const act = area.activities.find(a => a.id === actId);
      if (act) act.name = name;
      return dp;
    });
  };

  const updateActivityGoal = (dimId: string, areaId: string, actId: string, goal: number) => {
    setDraftPlan(prev => {
      const dp = { ...prev };
      const dim = dp.dimensions.find(d => d.id === dimId);
      if (!dim) return prev;
      const area = dim.areas.find(a => a.id === areaId);
      if (!area) return prev;
      const act = area.activities.find(a => a.id === actId);
      if (act) act.goal = goal;
      return dp;
    });
  };

  const updateAreaName = (dimId: string, areaId: string, name: string) => {
    setDraftPlan(prev => {
      const dp = { ...prev };
      const dim = dp.dimensions.find(d => d.id === dimId);
      if (!dim) return prev;
      const area = dim.areas.find(a => a.id === areaId);
      if (area) area.name = name;
      return dp;
    });
  };

  const activeDim = draftPlan.dimensions.find(d => d.id === activeTab);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-slate-800 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onDone} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Configurar Mi Plan</h2>
            <p className="text-slate-300 text-sm">Personaliza tus áreas y actividades</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          {saving ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200">
          <div className="p-4 space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Dimensiones (Inmutables)</h3>
            {draftPlan.dimensions.map(dim => (
              <button
                key={dim.id}
                onClick={() => setActiveTab(dim.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200",
                  activeTab === dim.id ? "bg-white text-cyan-700 shadow-sm border border-slate-100" : "text-slate-600 hover:bg-slate-200/50"
                )}
              >
                {dim.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 bg-white">
          {activeDim && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <PenTool size={24} className="text-cyan-600" />
                  Editando: {activeDim.name}
                </h3>
                <p className="text-slate-500 mt-1">Modifica los nombres de las áreas y actividades, y establece tus metas mensuales.</p>
              </div>

              <div className="space-y-8">
                {activeDim.areas.map((area, aIndex) => (
                  <div key={area.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="bg-cyan-100 text-cyan-800 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        {aIndex + 1}
                      </div>
                      <input
                        type="text"
                        value={area.name}
                        onChange={(e) => updateAreaName(activeDim.id, area.id, e.target.value)}
                        className="font-bold text-lg bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-cyan-600 focus:outline-none w-full pb-1 transition-colors uppercase tracking-wide text-slate-800"
                        placeholder="Nombre del Área"
                      />
                    </div>

                    <div className="space-y-3 pl-12">
                      <div className="grid grid-cols-[1fr_80px] gap-4 px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div>Actividad</div>
                        <div className="text-center">Meta Mensual</div>
                      </div>
                      {area.activities.map((act, actIndex) => (
                        <div key={act.id} className="grid grid-cols-[1fr_80px] gap-4 items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm focus-within:ring-2 focus-within:ring-cyan-600 focus-within:border-cyan-600 transition-shadow">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 font-medium text-sm w-4 text-center">{actIndex + 1}.</span>
                            <input
                              type="text"
                              value={act.name}
                              onChange={(e) => updateActivityName(activeDim.id, area.id, act.id, e.target.value)}
                              className="w-full focus:outline-none text-slate-700 font-medium"
                              placeholder="Nombre de la actividad"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              value={act.goal.toString()}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                updateActivityGoal(activeDim.id, area.id, act.id, isNaN(val) ? 0 : val);
                              }}
                              className="w-full text-center focus:outline-none font-semibold text-cyan-700 bg-slate-50 rounded py-1 px-2 border border-slate-200"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
