import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from './AuthContext';
import { Plan, MonthlyProgress } from '../types';
import { DEFAULT_DIMENSIONS as defaultPlanTemplate } from '../constants';

interface DataContextType {
  plan: Plan | null;
  progress: MonthlyProgress | null;
  currentDate: string;
  loading: boolean;
  updatePlan: (newPlan: Plan) => Promise<void>;
  updateProgress: (dimensionId: string, areaId: string, activityId: string, amount: number) => Promise<void>;
  setDate: (date: string) => void;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

// Helper to get YYYY-MM
function getMonthStr(dateStr: string) {
  return dateStr.substring(0, 7);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [progress, setProgress] = useState<MonthlyProgress | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  // Load Plan
  useEffect(() => {
    if (!user || !profile || !profile.isActive) {
      setPlan(null);
      setProgress(null);
      return;
    }

    const planRef = doc(db, 'users', user.uid, 'plan', 'default');
    
    setLoading(true);
    const unsub = onSnapshot(planRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPlan({
          dimensions: JSON.parse(data.dimensions),
          updatedAt: data.updatedAt,
        });
      } else {
        // Initialize default plan
        const initialPlan: Plan = {
          dimensions: defaultPlanTemplate,
          updatedAt: Date.now()
        };
        setDoc(planRef, {
          dimensions: JSON.stringify(initialPlan.dimensions),
          updatedAt: initialPlan.updatedAt
        }).catch(err => {
          handleFirestoreError(err, OperationType.CREATE, `plan/default`);
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `plan/default`);
    });

    return () => unsub();
  }, [user, profile]);

  // Load Progress
  useEffect(() => {
    if (!user || !profile || !profile.isActive) return;

    const monthStr = getMonthStr(currentDate);
    const progressRef = doc(db, 'users', user.uid, 'progress', monthStr);
    
    const unsub = onSnapshot(progressRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProgress({
          month: data.month,
          days: JSON.parse(data.days),
          updatedAt: data.updatedAt,
        });
      } else {
        setProgress({
          month: monthStr,
          days: {},
          updatedAt: Date.now()
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `progress/${monthStr}`);
    });

    return () => unsub();
  }, [user, profile, currentDate]);

  const updatePlan = async (newPlan: Plan) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'plan', 'default'), {
        dimensions: JSON.stringify(newPlan.dimensions),
        updatedAt: Date.now()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `plan/default`);
    }
  };

  const updateProgress = async (dimensionId: string, areaId: string, activityId: string, amount: number) => {
    if (!user || !progress) return;
    
    const monthStr = getMonthStr(currentDate);
    const key = `${dimensionId}_${areaId}_${activityId}`;
    
    const currentDayValues = progress.days[currentDate] || {};
    const newDayValues = { ...currentDayValues, [key]: amount };
    const newDays = { ...progress.days, [currentDate]: newDayValues };
    
    try {
      await setDoc(doc(db, 'users', user.uid, 'progress', monthStr), {
        month: monthStr,
        days: JSON.stringify(newDays),
        updatedAt: Date.now()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `progress/${monthStr}`);
    }
  };

  return (
    <DataContext.Provider value={{ plan, progress, currentDate, loading, updatePlan, updateProgress, setDate: setCurrentDate }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
