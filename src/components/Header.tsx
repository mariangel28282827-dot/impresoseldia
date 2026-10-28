import React from 'react';
import { Download, Trash2, ShieldCheck, UserCheck, Wifi, WifiOff, Sparkles, Building2, Layers } from 'lucide-react';
import { RoleType } from '../types';

interface HeaderProps {
  activeRole: RoleType;
  onChangeRole: (role: RoleType) => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  onOpenInstallModal: () => void;
  onOpenUninstallModal: () => void;
  onOpenBackupModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onChangeRole,
  isInstallable,
  isInstalled,
  isOnline,
  onOpenInstallModal,
  onOpenUninstallModal,
  onOpenBackupModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo y Marca Oficial */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 text-sm tracking-tighter">
                  ED
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>IMPRESOS EL DÍA S.A.S.</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Medellín
                  </span>
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wide">
                SIGE-UV • Gestión de Acabados UV y Tintas Especiales
              </p>
            </div>
          </div>

          {/* Acciones del Sistema: Roles y Botones Explícitos (Instalar, Desinstalar, Salvaguardar) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Conectividad Offline / Online */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isOnline
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/30 animate-pulse'
              }`}
              title={isOnline ? 'Conectado a la red de planta' : 'Modo Offline: Operando con almacenamiento local seguro'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'En línea' : 'Modo Offline'}</span>
            </div>

            {/* Selector de Rol de Planta */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={activeRole}
                onChange={(e) => onChangeRole(e.target.value as RoleType)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="operario_uv" className="bg-slate-900 text-white">Operario UV (Máquina)</option>
                <option value="coordinador_calidad" className="bg-slate-900 text-white">Coordinador de Calidad</option>
                <option value="jefe_produccion" className="bg-slate-900 text-white">Jefe de Producción</option>
              </select>
            </div>

            {/* BOTÓN SALVAGUARDAR (Requerimiento explícito) */}
            <button
              onClick={onOpenBackupModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition shadow-sm cursor-pointer"
              title="Salvaguardar base de datos, respaldos cifrados y verificación de integridad"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Salvaguardar</span>
            </button>

            {/* BOTÓN INSTALAR (Requerimiento explícito) */}
            <button
              onClick={onOpenInstallModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition shadow-sm cursor-pointer"
              title="Instalar aplicación en estación de trabajo / pantalla táctil de planta"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">
                {isInstalled ? 'App Instalada' : 'Instalar'}
              </span>
            </button>

            {/* BOTÓN DESINSTALAR (Requerimiento explícito) */}
            <button
              onClick={onOpenUninstallModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-950/50 text-red-300 border border-red-500/30 text-xs font-semibold transition cursor-pointer"
              title="Desinstalar aplicación, purgar cachés de estación o resetear terminal"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span className="hidden md:inline">Desinstalar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
