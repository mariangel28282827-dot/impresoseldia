import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, RotateCcw, Play, Check, FileCheck, Layers, AlertTriangle } from 'lucide-react';
import { ProductionOrder, RoleType, InspectionLog, OPStatus } from '../../types';
import { storageService } from '../../services/storageService';

interface QualityGateReviewTabProps {
  orders: ProductionOrder[];
  inspections: InspectionLog[];
  activeRole: RoleType;
  onUpdateOrders: (orders: ProductionOrder[]) => void;
  onUpdateInspections: (inspections: InspectionLog[]) => void;
  selectedOrderId?: string;
  onNavigateTab: (tab: string) => void;
}

export const QualityGateReviewTab: React.FC<QualityGateReviewTabProps> = ({
  orders,
  inspections,
  activeRole,
  onUpdateOrders,
  onUpdateInspections,
  selectedOrderId,
  onNavigateTab,
}) => {
  const eligibleOrders = orders.filter((o) => !o.isBlocked);
  const [currentOpId, setCurrentOpId] = useState<string>(
    selectedOrderId && eligibleOrders.some((o) => o.id === selectedOrderId)
      ? selectedOrderId
      : eligibleOrders[0]?.id || ''
  );

  const selectedOrder = orders.find((o) => o.id === currentOpId);

  // Formulario de inspección de pliego piloto
  const [method, setMethod] = useState<'Cinta_3M_610' | 'Cross_Hatch_ISO2409' | 'Ambos'>('Ambos');
  const [adhesionPercent, setAdhesionPercent] = useState<number>(100);
  const [testerName, setTesterName] = useState<string>('Valeria Henao (Coord. Calidad)');
  const [observations, setObservations] = useState<string>(
    'Anclaje total (0% desprendimiento). Prueba de cinta 3M ejecutada a 90° sobre cuadrícula de corte limpio sin desprendimiento de bordes.'
  );
  const [recalibrationNotes, setRecalibrationNotes] = useState<string>('');
  const [showReworkModal, setShowReworkModal] = useState<boolean>(false);

  // Determine ASTM D3359 class based on %
  const getAstmClass = (percent: number): '5B' | '4B' | '3B' | '2B' | '1B' | '0B' => {
    if (percent === 100) return '5B';
    if (percent >= 95) return '4B';
    if (percent >= 85) return '3B';
    if (percent >= 65) return '2B';
    if (percent >= 35) return '1B';
    return '0B';
  };

  const currentClass = getAstmClass(adhesionPercent);
  const isApproved = adhesionPercent === 100; // ISO 9001 planta Medellin requires 100% anchor

  // Registrar resultado de Gate-Review y liberar a producción masiva
  const handleApproveRelease = () => {
    if (!selectedOrder) return;

    const newAdhesionTest = {
      testedAt: new Date().toISOString(),
      testerName,
      testerRole: activeRole,
      method,
      adhesionPercentage: 100,
      astmClass: '5B' as const,
      passed: true,
      recalibrationAttempts: selectedOrder.adhesionTest?.recalibrationAttempts || 0,
      observations,
    };

    const newReleaseInfo = {
      releasedAt: new Date().toISOString(),
      authorizedBy: `${testerName} (${activeRole.replace('_', ' ').toUpperCase()})`,
      signatureRole: activeRole,
      wasteSheets: 10, // pliegos de prueba
      notes: 'Lote liberado formalmente a producción masiva tras validación exitosa de Gate-Review.',
    };

    const updatedOrders = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          adhesionTest: newAdhesionTest,
          releaseInfo: newReleaseInfo,
          currentStep: 5 as const,
          status: 'produccion_masiva' as OPStatus,
        };
      }
      return o;
    });

    const newLog: InspectionLog = {
      id: `insp-${Date.now().toString().slice(-4)}`,
      opId: selectedOrder.id,
      opNumber: selectedOrder.opNumber,
      timestamp: new Date().toISOString(),
      inspectorName: testerName,
      inspectorRole: activeRole,
      bandSpeed: selectedOrder.uvSettings.bandSpeedMMin,
      lampPower: selectedOrder.uvSettings.lampPowerWattsInch,
      substrateTemp: selectedOrder.uvSettings.substrateTempCelsius,
      crossHatchResult: 'Clase 5B - 100% de anclaje (Cero desprendimiento)',
      adhesionPercent: 100,
      verdict: 'APROBADO',
      correctiveAction: 'Pliego piloto conforme. Liberado a tiraje masivo.',
    };

    const updatedInspections = [newLog, ...inspections];

    onUpdateOrders(updatedOrders);
    onUpdateInspections(updatedInspections);
    storageService.saveOrders(updatedOrders);
    storageService.saveInspections(updatedInspections);

    storageService.addAuditLog({
      action: 'GATE_REVIEW_LIBERACION_MASIVA',
      userRole: activeRole,
      details: `OP ${selectedOrder.opNumber} aprobada con 100% de anclaje (5B). Liberada para tiraje masivo de ${selectedOrder.sheetsQuantity} pliegos.`,
      severity: 'INFO',
    });
  };

  // Acción si no cumple: Recalibrar parámetros y detener tiraje
  const handleTriggerRecalibration = () => {
    if (!selectedOrder) return;

    const attempts = (selectedOrder.adhesionTest?.recalibrationAttempts || 0) + 1;

    const updatedOrders = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          currentStep: 3 as const,
          status: 'calibracion_uv' as OPStatus,
          adhesionTest: {
            testedAt: new Date().toISOString(),
            testerName,
            testerRole: activeRole,
            method,
            adhesionPercentage: adhesionPercent,
            astmClass: currentClass,
            passed: false,
            recalibrationAttempts: attempts,
            observations: `Parada de control rápida activada. Anclaje de ${adhesionPercent}% no conforme. ${recalibrationNotes}`,
          },
        };
      }
      return o;
    });

    const newLog: InspectionLog = {
      id: `insp-${Date.now().toString().slice(-4)}`,
      opId: selectedOrder.id,
      opNumber: selectedOrder.opNumber,
      timestamp: new Date().toISOString(),
      inspectorName: testerName,
      inspectorRole: activeRole,
      bandSpeed: selectedOrder.uvSettings.bandSpeedMMin,
      lampPower: selectedOrder.uvSettings.lampPowerWattsInch,
      substrateTemp: selectedOrder.uvSettings.substrateTempCelsius,
      crossHatchResult: `Clase ${currentClass} (${adhesionPercent}% anclaje)`,
      adhesionPercent,
      verdict: 'RECALIBRAR',
      correctiveAction: recalibrationNotes || 'Detener máquina UV, reducir velocidad de banda e incrementar potencia W/in.',
    };

    const updatedInspections = [newLog, ...inspections];

    onUpdateOrders(updatedOrders);
    onUpdateInspections(updatedInspections);
    storageService.saveOrders(updatedOrders);
    storageService.saveInspections(updatedInspections);

    storageService.addAuditLog({
      action: 'GATE_REVIEW_RECALIBRACION_FORZADA',
      userRole: activeRole,
      details: `OP ${selectedOrder.opNumber} rechazada en pliego piloto con ${adhesionPercent}% anclaje (${currentClass}). Parada de máquina ordenada.`,
      severity: 'WARNING',
    });

    setShowReworkModal(false);
    onNavigateTab('uv_control');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Metodología Ágil de Validación Rápida (Gate-Review de Calidad)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilar 3 del Plan de Mejora • Parada obligatoria antes de liberar producción masiva. Prueba de cinta 3M 610 / Cross-Hatch Test.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">OP a Evaluar:</span>
          <select
            value={currentOpId}
            onChange={(e) => setCurrentOpId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
          >
            {eligibleOrders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.opNumber} - {o.client.slice(0, 20)} ({o.status.replace(/_/g, ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Formulario de Inspección y Visualizador de Cuadrícula ASTM D3359 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulario de Gate-Review (7 spans) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Vale de Inspección Rápida de Post-Prensa</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              OP Seleccionada: <strong className="text-white">{selectedOrder?.opNumber || 'N/A'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Método de Evaluación</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
              >
                <option value="Ambos">Cross-Hatch + Cinta 3M 610 (Recomendado)</option>
                <option value="Cinta_3M_610">Prueba de Cinta 3M Adhesión Instantánea</option>
                <option value="Cross_Hatch_ISO2409">Cross-Hatch Test (ISO 2409 / Corte en Cruz)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Inspector / Coordinador de Calidad</label>
              <input
                type="text"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
              />
            </div>
          </div>

          {/* Slider de Porcentaje de Anclaje */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">
                Porcentaje de Anclaje de la Película Barnizada (%)
              </label>
              <div className="flex items-center gap-2">
                <span className={`font-mono font-black text-lg ${isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                  {adhesionPercent}%
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isApproved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                  Clase ASTM {currentClass}
                </span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={adhesionPercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAdhesionPercent(val);
                if (val === 100) {
                  setObservations('Anclaje total (0% desprendimiento). Prueba de cinta 3M ejecutada a 90° sobre cuadrícula de corte limpio sin desprendimiento de bordes.');
                } else {
                  setObservations(`Desprendimiento detectado de aproximadamente ${100 - val}%. Reticulación incompleta en interfase con tinta especial.`);
                }
              }}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />

            <div className="flex justify-between text-[10px] text-slate-500">
              <span className="text-red-400">0% (Falla Total / Película Flotante)</span>
              <span>50% (Desprendimiento Grave)</span>
              <span>95% (Clase 4B - Descamación)</span>
              <span className="text-emerald-400 font-bold">100% (Clase 5B - Cero desprendimiento)</span>
            </div>
          </div>

          {/* Observaciones técnicas */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-300 block">Observaciones de Inspección</label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Veredicto y Botones de Acción */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {isApproved ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Criterio de aceptación 100% cumplido (ISO 9001). Apto para tiraje masivo.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-red-400 font-semibold">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>Rechazado: Anclaje insuficiente. Se prohíbe liberar tiraje continuo.</span>
              </div>
            )}

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {!isApproved ? (
                <button
                  onClick={() => setShowReworkModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-600/20 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Activar Parada Técnica y Recalibrar</span>
                </button>
              ) : (
                <button
                  onClick={handleApproveRelease}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Aprobar y Liberar Producción Masiva</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Visualizador de Cuadrícula Cross-Hatch e Historial (5 spans) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Visualizador de Cuadrícula */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Simulación Visual de Cuadrícula Cross-Hatch</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>

            {/* Representación visual de los cortes de cuchilla celosía */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="relative w-40 h-40 bg-indigo-950/40 rounded-lg border-2 border-indigo-500/40 grid grid-cols-6 grid-rows-6 p-1 gap-1">
                {Array.from({ length: 36 }).map((_, index) => {
                  const peeledCount = Math.round((36 * (100 - adhesionPercent)) / 100);
                  const isPeeled = index < peeledCount;
                  return (
                    <div
                      key={index}
                      className={`rounded-sm transition-all duration-300 ${
                        isPeeled
                          ? 'bg-rose-500/80 border border-rose-400 scale-90 shadow-sm'
                          : 'bg-emerald-500/60 border border-emerald-400/80'
                      }`}
                      title={isPeeled ? 'Película desprendida por la cinta' : 'Película intacta 100% anclada'}
                    />
                  );
                })}
              </div>

              <div className="mt-3 text-center">
                <span className="font-bold text-xs text-white">
                  {adhesionPercent === 100
                    ? '36/36 Cuadrículas Intactas (100% Anclaje)'
                    : `${36 - Math.round((36 * (100 - adhesionPercent)) / 100)}/36 Cuadrículas Intactas`}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Estándar ISO 2409 / ASTM D3359
                </span>
              </div>
            </div>

            {/* Protocolo "¿Qué hago si no cumplo?" */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5">
              <span className="font-bold text-amber-300 block">Protocolo Oficial ante Fallas (PDF Ficha de Caracterización):</span>
              <p className="text-slate-300 leading-snug">
                Si la prueba de cinta 3M muestra desprendimiento parcial o total:
                <strong className="text-white"> Detener inmediatamente el tiraje</strong>, ajustar la intensidad UV (subir W/pulgada), regular velocidad de banda (bajar m/min) y segregar el pliego defectuoso como merma controlada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historial Reciente de Inspecciones */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Bitácora de Pruebas Rápidas Gate-Review Registradas</span>
          </h3>
          <span className="text-xs text-slate-400">{inspections.length} registros auditables</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Fecha y Hora</th>
                <th className="py-2.5 px-3">OP</th>
                <th className="py-2.5 px-3">Inspector</th>
                <th className="py-2.5 px-3">Parámetros UV</th>
                <th className="py-2.5 px-3">Anclaje %</th>
                <th className="py-2.5 px-3">Veredicto</th>
                <th className="py-2.5 px-3">Acción Correctiva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inspections.map((log) => {
                const isPass = log.verdict === 'APROBADO';
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white font-mono">{log.opNumber}</td>
                    <td className="py-2.5 px-3">{log.inspectorName}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">
                      {log.bandSpeed} m/min • {log.lampPower} W/in • {log.substrateTemp}°C
                    </td>
                    <td className="py-2.5 px-3 font-bold font-mono">
                      <span className={log.adhesionPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}>
                        {log.adhesionPercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isPass
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {log.verdict}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                      {log.correctiveAction || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Recalibración Forzada */}
      {showReworkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Activar Recalibración de Curado UV</h3>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <p className="text-slate-300">
                Se detendrá el proceso de la OP <strong className="text-white">{selectedOrder?.opNumber}</strong> y volverá al <strong>Paso 3 (Calibración UV)</strong> para reajustar velocidad de banda y potencia de lámparas.
              </p>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Motivo / Acción Correctiva</label>
                <textarea
                  rows={3}
                  value={recalibrationNotes}
                  onChange={(e) => setRecalibrationNotes(e.target.value)}
                  placeholder="Ej: Se reduce velocidad a 25 m/min y se incrementa potencia a 320 W/in debido a desprendimiento en pliego piloto."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
              <button
                onClick={() => setShowReworkModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleTriggerRecalibration}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg"
              >
                Confirmar y Regresar a Calibración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
