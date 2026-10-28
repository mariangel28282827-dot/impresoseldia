import React from 'react';
import { Download, Monitor, Smartphone, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onTriggerInstall: () => Promise<boolean>;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  onTriggerInstall,
}) => {
  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await onTriggerInstall();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Instalar Aplicación de Planta</h3>
              <p className="text-xs text-slate-400">SIGE-UV • Impresos El Día S.A.S. (Medellín)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-4">
          {isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Aplicación ya instalada en este equipo</p>
                <p className="text-xs text-emerald-400/80 mt-1">
                  Esta estación de trabajo ya ejecuta SIGE-UV en modo independiente (Standalone). Puedes acceder desde tu escritorio o barra de tareas.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300 leading-relaxed">
              Instala el sistema como aplicación nativa en tu consola de operador o tableta de planta para agilizar el registro de lotes y garantizar el funcionamiento sin interrupciones.
            </p>
          )}

          {/* Beneficios clave */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Modo Offline 100%</span>
                <span className="text-slate-400">Continúa operando aún sin conexión Wi-Fi en nave de impresión.</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-start gap-2.5">
              <Monitor className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Acceso de Pantalla Completa</span>
                <span className="text-slate-400">Sin barras de navegador, interfaz táctil optimizada para operarios.</span>
              </div>
            </div>
          </div>

          {/* Instrucciones de acuerdo al dispositivo */}
          {isIOS ? (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-700/40 text-slate-200">
              <div className="flex items-center gap-2 mb-2 text-indigo-300 font-semibold text-sm">
                <Smartphone className="w-4 h-4" />
                <span>Instrucciones para iPad / iPhone (Safari)</span>
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside ml-1">
                <li>Presiona el botón <strong>Compartir</strong> en la barra inferior de Safari.</li>
                <li>Desplázate hacia abajo y selecciona <strong>Añadir a la pantalla de inicio</strong>.</li>
                <li>Confirma con el nombre <strong>SIGE-UV</strong> en la esquina superior derecha.</li>
              </ol>
            </div>
          ) : isInstallable ? (
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition cursor-pointer"
            >
              <Download className="w-5 h-5 text-slate-950" />
              <span>Instalar ahora en esta Estación</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs space-y-2">
              <p className="font-semibold text-slate-200">Instalación desde navegador de escritorio (Chrome / Edge):</p>
              <p>
                Haz clic en el icono de instalación <strong className="text-cyan-300">⊕ (Instalar aplicación)</strong> situado en la barra de direcciones superior de tu navegador, o en el menú de tres puntos → <em>Instalar SIGE-UV</em>.
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
