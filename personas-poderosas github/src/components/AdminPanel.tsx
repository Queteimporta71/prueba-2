import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { Users, Trash2, CheckCircle2, ChevronLeft, Activity, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function AdminPanel({ onDone }: { onDone: () => void }) {
  const [users, setUsers] = useState<(UserProfile & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const fetched: (UserProfile & { id: string })[] = [];
      snapshot.forEach(doc => {
        fetched.push({ id: doc.id, ...(doc.data() as UserProfile) });
      });
      setUsers(fetched.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean, isAdmin: boolean) => {
    if (isAdmin) {
      alert("No puedes desactivar a un administrador.");
      return;
    }
    const confirmed = window.confirm(currentStatus ? '¿Estás seguro de desactivar (eliminar) a este usuario?' : '¿Quieres reactivar a este usuario?');
    if (!confirmed) return;

    try {
      await updateDoc(doc(db, 'users', userId), { isActive: !currentStatus });
      await fetchUsers(); // refresh
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando usuarios...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onDone} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShieldAlert className="text-indigo-400" />
              Panel de Administración
            </h2>
            <p className="text-slate-400 text-sm mt-1">Gestiona los usuarios de la plataforma</p>
          </div>
        </div>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Usuario</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Fecha de Registro</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Estado</th>
              <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className={cn("hover:bg-slate-50 transition-colors", !u.isActive && "bg-slate-50/50 opacity-75")}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", u.isAdmin ? "bg-indigo-600" : "bg-cyan-600")}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        {u.name}
                        {u.isAdmin && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Admin</span>}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span>{u.email}</span>
                        <span>•</span>
                        <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Codigo: {u.codeUsed}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 text-sm">
                  {format(new Date(u.createdAt), 'dd MMM yyyy, HH:mm')}
                </td>
                <td className="p-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                    u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {u.isActive ? <CheckCircle2 size={14} /> : <Trash2 size={14} />}
                    {u.isActive ? 'Activo' : 'Desactivado'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleUserStatus(u.id, u.isActive, u.isAdmin)}
                    disabled={u.isAdmin}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                      u.isAdmin ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400"
                        : u.isActive
                          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                    )}
                  >
                    {u.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Users size={48} className="text-slate-300 mb-4" />
            <p>No hay usuarios registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
