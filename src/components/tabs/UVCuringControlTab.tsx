import React, { useState } from 'react';
import { Zap, Gauge, Thermometer, Activity, CheckCircle2, AlertTriangle, ArrowRight, Save, History, ShieldCheck } from 'lucide-react';
import { ProductionOrder, RoleType, InspectionLog } from '../../types';
import { storageService } from '../../services/storageService';

interface UVCuringControlTabProps {
  orders: ProductionOrder[];
  activeRole: RoleType;
  onUpdateOrders: (orders: ProductionOrder[]) => void;
  selectedOrderId?: string;
  onNavigateTab: (tab: string) => void;
}

export const UVCuringControlTab: React.FC<UVCuringControlTabProps> = ({
  orders,
  activeRole,
  onUpdateOrders,
  selectedOrderId,
  onNavigateTab,
}) => {
  const eligibleOrders = orders.filter((o) => !o.isBlocked && o.status !== 'completada');
  const [currentOpId, setCurrentOpId] = useState<string>(
    selectedOrderId && eligibleOrders.some((o) => o.id === selectedOrderId)
      ? selectedOrderId
      : eligibleOrders[0]?.id || ''
  );

  const selectedOrder = orders.find((o) => o.id === currentOpId);

  // Parámetros interactivos de la unidad UV
  const [bandSpeed, setBandSpeed] = useState<number>(selectedOrder?.uvSettings.bandSpeedMMin || 30);
  const [lampPower, setLampPower] = useState<number>(selectedOrder?.uvSettings.lampPowerWattsInch || 300);
  const [substrateTemp, setSubstrateTemp] = useState<number>(selectedOrder?.uvSettings.substrateTempCelsius || 40);
  const [activeLamps, setActiveLamps] = useState<number>(selectedOrder?.uvSettings.lampsActive || 2);
  const [operatorName, setOperatorName] = useState<string>('Carlos Mario Restrepo (Operario UV)');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Cálculo físico de dosis radiométrica estimada en mJ/cm²:
  // Dosis (mJ/cm²) ≈ (Potencia W/in * Factor Conversión * Lámparas * 60) / (Velocidad m/min * 100)
  const calculateDose = (power: number, speed: number, lamps: number): number => {
    if (speed <= 0) return 0;
    // Factor de radiómetro industrial calibrado para UV-A/UV-V a 300 W/in @ 30 m/min ≈ 250 mJ/cm²
    const baseConstant = 24.5;
    const dose = Math.round((power * lamps * baseConstant) / speed);
    return dose;
  };

  const currentDose = calculateDose(lampPower, bandSpeed, activeLamps);

  // Validación de tolerancia operativa
  const isSpeedValid = bandSpeed >= 20 && bandSpeed <= 35;
  const isPowerValid = lampPower >= 280 && lampPower <= 330;
  const isTempValid = substrateTemp >= 32 && substrateTemp <= 48;
  const isDoseOptimal = currentDose >= 220 && currentDose <= 320;

  const handleApplyCalibration = () => {
    if (!selectedOrder) return;

    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          uvSettings: {
            bandSpeedMMin: bandSpeed,
            lampPowerWattsInch: lampPower,
            substrateTempCelsius: substrateTemp,
            calculatedDoseMjCm2: currentDose,
            lampsActive: activeLamps,
            calibratedBy: operatorName,
            calibratedAt: new Date().toISOString(),
          },
          currentStep: Math.max(o.currentStep, 4) as 1 | 2 | 3 | 4 | 5 | 6,
          status: o.status === 'calibracion_uv' || o.status === 'oxidacion_espera' ? ('gate_review_adherencia' as const) : o.status,
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    storageService.saveOrders(updated);

    storageService.addAuditLog({
      action: 'CALIBRACION_PARAMETROS_UV',
      userRole: activeRole,
      details: `OP ${selectedOrder.opNumber} calibrada: ${lampPower} W/in, ${bandSpeed} m/min, ${substrateTemp}°C, Dosis: ${currentDose} mJ/cm². Operador: ${operatorName}.`,
      severity: isDoseOptimal ? 'INFO' : 'WARNING',
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Control Estadístico de Parámetros de Curado UV</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilar 2 del Plan de Mejora • Registro digital obligatorio de velocidad, potencia de radiación y temperatura.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Orden activa en máquina:</span>
          <select
            value={currentOpId}
            onChange={(e) => {
              setCurrentOpId(e.target.value);
              const found = orders.find((o) => o.id === e.target.value);
              if (found) {
                setBandSpeed(found.uvSettings.bandSpeedMMin);
                setLampPower(found.uvSettings.lampPowerWattsInch);
                setSubstrateTemp(found.uvSettings.substrateTempCelsius);
                setActiveLamps(found.uvSettings.lampsActive);
              }
            }}
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

      {/* Panel Principal de Calibración e Instrumentación */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controles de la Máquina UV (7 spans) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Consola de Parámetros en Línea</span>
            </h3>
            <span className="text-xs text-cyan-400 font-mono">Túnel UV Modelo KBA-Rapida 106</span>
          </div>

          {/* Slider 1: Velocidad de Banda */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Velocidad de Paso de la Banda (m/min)</span>
              </label>
              <span className={`font-mono font-bold text-sm ${isSpeedValid ? 'text-cyan-300' : 'text-amber-400'}`}>
                {bandSpeed} m/min
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={bandSpeed}
              onChange={(e) => setBandSpeed(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Lenta (10 m/min)</span>
              <span className="text-emerald-400 font-semibold">Ventana Óptima: 25 - 35 m/min</span>
              <span>Rápida (60 m/min)</span>
            </div>
          </div>

          {/* Slider 2: Potencia de Lámparas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Potencia de Lámparas UV (Watts/pulgada)</span>
              </label>
              <span className={`font-mono font-bold text-sm ${isPowerValid ? 'text-amber-300' : 'text-red-400'}`}>
                {lampPower} W/in
              </span>
            </div>
            <input
              type="range"
              min="160"
              max="400"
              step="10"
              value={lampPower}
              onChange={(e) => setLampPower(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Baja (160 W/in)</span>
              <span className="text-emerald-400 font-semibold">Ventana Óptima: 280 - 320 W/in</span>
              <span>Máxima (400 W/in)</span>
            </div>
          </div>

          {/* Slider 3: Temperatura del Sustrato */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>Temperatura Superficial del Sustrato (°C)</span>
              </label>
              <span className={`font-mono font-bold text-sm ${isTempValid ? 'text-emerald-300' : 'text-rose-400'}`}>
                {substrateTemp} °C
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="65"
              step="1"
              value={substrateTemp}
              onChange={(e) => setSubstrateTemp(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Frío (20°C)</span>
              <span className="text-emerald-400 font-semibold">Rango Seguro: 35°C - 48°C</span>
              <span>Crítico (&gt;50°C Deformación)</span>
            </div>
          </div>

          {/* Selector de Lámparas Activas y Firma de Operador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Módulos UV Encendidos</label>
              <select
                value={activeLamps}
                onChange={(e) => setActiveLamps(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
              >
                <option value={1}>1 Lámpara (Solo Curado Superficial)</option>
                <option value={2}>2 Lámparas (Estándar Doble Curado Inter-Deck)</option>
                <option value={3}>3 Lámparas (Tiraje de Alta Velocidad / Alta Densidad)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Operario de Máquina UV Responsable</label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
              />
            </div>
          </div>

          {/* Botón de Aplicación de Calibración */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {saveSuccess ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Parámetros calibrados y guardados en bitácora digital con éxito</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Registro digital obligatorio por lote según norma ISO 9001:2015.
              </span>
            )}

            <button
              onClick={handleApplyCalibration}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Calibración para {selectedOrder?.opNumber || 'la OP'}</span>
            </button>
          </div>
        </div>

        {/* Tarjeta de Radiometría y Diagnóstico de Curado (5 spans) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tarjeta Dosis Radiométrica */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Energía de Reticulación (Dosis UV)</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>

            <div className="text-center py-2">
              <span className="text-5xl font-black text-white font-mono tracking-tight">{currentDose}</span>
              <span className="text-sm font-bold text-amber-400 ml-1.5">mJ/cm²</span>
              <p className="text-xs text-slate-400 mt-1">Dosis acumulada en superficie del pliego</p>
            </div>

            {/* Semáforo de Dosis */}
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                isDoseOptimal
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : currentDose < 220
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-red-950/30 border-red-500/40 text-red-200'
              }`}
            >
              {isDoseOptimal ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <div>
                <span className="font-bold block">
                  {isDoseOptimal
                    ? 'Energía Óptima para Polimerización'
                    : currentDose < 220
                    ? 'Sub-curado: Riesgo de Reticulación Incompleta'
                    : 'Sobreexposición UV: Riesgo de Fragilidad / Calor'}
                </span>
                <span className="text-[11px] opacity-80">
                  {isDoseOptimal
                    ? 'Reticulación completa de monómeros garantizada.'
                    : currentDose < 220
                    ? 'Aumentar potencia W/in o reducir m/min de banda.'
                    : 'Aumentar velocidad de banda para evitar amarillamiento.'}
                </span>
              </div>
            </div>

            {/* Resumen de Tolerancias Técnicas */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Velocidad de Banda:</span>
                <span className={isSpeedValid ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                  {isSpeedValid ? 'Conforme (25-35)' : 'Fuera de estándar'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Potencia de Radiación:</span>
                <span className={isPowerValid ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                  {isPowerValid ? 'Conforme (280-320)' : 'Fuera de estándar'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Temperatura Sustrato:</span>
                <span className={isTempValid ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                  {isTempValid ? 'Conforme (<48°C)' : 'Riesgo térmico'}
                </span>
              </div>
            </div>
          </div>

          {/* Enlace al Gate-Review */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-white block">Siguiente Paso: Parada Gate-Review</span>
              <span className="text-slate-400">Prueba rápida con cinta 3M antes de liberar tiraje.</span>
            </div>
            <button
              onClick={() => onNavigateTab('gate_review')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
            >
              <span>Ir a Gate-Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
