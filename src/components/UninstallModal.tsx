import React, { useState } from 'react';
import { Trash2, AlertTriangle, ShieldCheck, RefreshCw, X, Download } from 'lucide-react';
import { storageService } from '../services/storageService';

interface UninstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUninstallComplete: () => void;
  onOpenBackup: () => void;
}

export const UninstallModal: React.FC<UninstallModalProps> = ({
  isOpen,
  onClose,
  onUninstallComplete,
  onOpenBackup,
}) => {
  const [includeDataPurge, setIncludeDataPurge] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');

  if (!isOpen) return null;

  const handleExecuteUninstall = async () => {
    setIsProcessing(true);
    try {
      if (includeDataPurge) {
        await storageService.uninstallWorkstation();
      } else {
        // Just unregister service worker & clear caches
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            await reg.unregister();
          }
        }
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          for (const name of cacheNames) {
            await caches.delete(name);
          }
        }
        storageService.addAuditLog({
          action: 'DESVINCULACION_PWA',
          userRole: 'operario_uv',
          details: 'Desvinculación de Service Worker y purga de caché completada sin borrar base de datos.',
          severity: 'INFO',
        });
      }

      setStep('success');
    } catch (err) {
      console.error('Error during uninstall', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishAndReload = () => {
    onUninstallComplete();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Desinstalar Aplicación / Desvincular Estación</h3>
              <p className="text-xs text-slate-400">SIGE-UV • Protocolo de Desconexión Segura</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'confirm' ? (
          <div className="my-5 space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm text-amber-300 block">Atención: Procedimiento de Mantenimiento</span>
                <p>
                  Esta operación desregistrará el Service Worker de la aplicación, purgará las memorias caché locales de la consola y desacoplará el equipo de la versión fuera de línea.
                </p>
              </div>
            </div>

            {/* Sugerencia de salvaguardar */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">¿Deseas generar una copia de seguridad antes de continuar?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBackup();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Salvaguardar</span>
              </button>
            </div>

            {/* Checkbox de borrado total de datos */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 cursor-pointer hover:bg-red-950/30 transition">
              <input
                type="checkbox"
                checked={includeDataPurge}
                onChange={(e) => setIncludeDataPurge(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-600 rounded border-slate-700 bg-slate-900 focus:ring-red-500"
              />
              <div className="text-xs">
                <span className="font-bold text-red-300 block">Purga total de base de datos local (Factory Reset)</span>
                <span className="text-slate-400">
                  Si marcas esta casilla, también se borrarán las órdenes guardadas en esta terminal y se restaurarán los valores de fábrica.
                </span>
              </div>
            </label>

            {/* Instrucción para desinstalar la PWA desde el SO */}
            <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg border border-slate-700/40">
              <span className="font-semibold text-slate-300 block mb-1">Para desinstalar del escritorio del equipo:</span>
              <p>
                Si instalaste la aplicación como PWA en Windows/macOS/Android, también puedes hacer clic derecho en el acceso directo del escritorio y seleccionar <em>Desinstalar SIGE-UV</em>, o en el menú de la ventana → <em>Desinstalar</em>.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecuteUninstall}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Confirmar Desinstalación</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="my-5 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Desvinculación Exitosa</h4>
              <p className="text-xs text-slate-300 mt-1.5 max-w-sm mx-auto">
                Los Service Workers han sido dados de baja y la caché de almacenamiento ha sido purgada correctamente.
              </p>
            </div>
            <button
              onClick={handleFinishAndReload}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              Reiniciar Estación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
