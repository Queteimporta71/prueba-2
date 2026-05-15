import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { DataProvider, useData } from './lib/DataContext';
import { LogIn, UserCircle, LogOut, CheckCircle, Save, Settings, ChevronLeft, ChevronRight, BarChart } from 'lucide-react';
import { cn } from './lib/utils';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function LoginScreen() {
  const { signIn } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-cyan-700 text-white rounded-full flex items-center justify-center shadow-lg mb-6">
            <UserCircle size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Personas Poderosas</h2>
          <p className="mt-2 text-sm text-gray-600">Alcanza tus metas en 6 dimensiones</p>
        </div>
        
        <button
          onClick={signIn}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-700 hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 transition-colors"
        >
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}

function RegistrationScreen() {
  const { registerProfile, signOut } = useAuth();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Por favor llena todos los campos');
      return;
    }
    const success = await registerProfile(name, code);
    if (!success) {
      setError('Código de autorización inválido o error de registro.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">Completa tu perfil</h2>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 text-sm font-medium rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-600 focus:border-cyan-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código de autorización</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-600 focus:border-cyan-600"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Proser18"
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-700 hover:bg-cyan-800"
          >
            Entrar
          </button>
        </form>
        <div className="text-center">
          <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-700">
            Cancelar y salir
          </button>
        </div>
      </div>
    </div>
  );
}

import Dashboard from './components/Dashboard';

function MainController() {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  if (!user) {
    return <LoginScreen />;
  }
  
  if (!profile) {
    return <RegistrationScreen />;
  }

  if (!profile.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Cuenta Desactivada</h2>
          <p className="text-gray-600 mb-6">Tu cuenta ha sido desactivada por el administrador.</p>
          <button onClick={() => useAuth().signOut()} className="text-cyan-700">Salir</button>
        </div>
      </div>
    );
  }

  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainController />
    </AuthProvider>
  );
}
