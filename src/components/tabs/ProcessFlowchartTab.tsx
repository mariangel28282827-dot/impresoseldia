import React, { useState } from 'react';
import { Layers, ArrowDown, ArrowRight, CheckCircle2, AlertOctagon, RotateCcw, ShieldCheck, ChevronRight, BookOpen, AlertTriangle } from 'lucide-react';

export const ProcessFlowchartTab: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const stepsDetails = [
    {
      step: 1,
      title: '1. Recepción y Verificación de Insumos',
      phva: 'PLANEAR',
      responsible: 'Jefe de Producción / Post-Prensa',
      inputs: 'Pliegos impresos con tintas especiales y Orden de Producción (OP).',
      outputs: 'Lotes de sustrato y tintas verificados y homologados en matriz.',
      controlVariable: 'Compatibilidad fisicoquímica entre tinta especial y barniz UV.',
      criterion: 'Acepta: Insumos compatibles y homologados. Rechaza: Insumos con riesgo de inhibición o siliconas no tratadas.',
      contingency: 'Retener el proceso y solicitar cambio de formulación con el proveedor o aplicar barniz especial de anclaje reforzado.',
      isoStandard: 'ISO 9001:2015 Cláusula 8.4 (Control de procesos suministrados externamente)',
    },
    {
      step: 2,
      title: '2. Tiempo de Reposo / Oxidación',
      phva: 'HACER',
      responsible: 'Operario de Máquina UV / Post-Prensa',
      inputs: 'Pliegos impresos con tintas de secado oxidativo lento (base vegetal o mineral).',
      outputs: 'Pliegos con film de tinta curado y estabilizado, listos para choque UV.',
      controlVariable: 'Tiempos mínimos de espera (12h a 24h según ficha técnica del fabricante).',
      criterion: 'Acepta: Tiempo cumplido según ficha técnica en bandejas aireadas. Rechaza: Pliegos frescos sin oxidación previa.',
      contingency: 'Reposicionar el material en zona de espera y cuarentena hasta completar el ciclo de oxidación.',
      isoStandard: 'ISO 9001:2015 Cláusula 8.5 (Control de la producción y de la provisión del servicio)',
    },
    {
      step: 3,
      title: '3. Configuración de Parámetros en Línea',
      phva: 'HACER',
      responsible: 'Operario de Máquina UV',
      inputs: 'Matriz de compatibilidad y especificaciones del fabricante de barniz.',
      outputs: 'Parámetros de curado configurados y registrados en bitácora digital.',
      controlVariable: 'Potencia de lámparas UV (W/pulgada), velocidad de banda (m/min) y temperatura (°C).',
      criterion: 'Acepta: 280-320 W/in, 25-35 m/min, temperatura sustrato 35-48°C. Rechaza: Baja intensidad o velocidad excesiva.',
      contingency: 'Detener la máquina, regular la velocidad de avance o solicitar mantenimiento de lámparas.',
      isoStandard: 'ISO 12647 Estándares de control en artes gráficas',
    },
    {
      step: 4,
      title: '4. Prueba de Adhesión Rápida (Gate-Review)',
      phva: 'VERIFICAR',
      responsible: 'Coordinador de Calidad / Operario UV',
      inputs: 'Pliego piloto recién barnizado y curado en túnel UV.',
      outputs: 'Registro de inspección conforme o vale de recalibración.',
      controlVariable: 'Reticulación completa y anclaje molecular del barniz sobre la tinta.',
      criterion: 'Acepta: 100% de anclaje (Clase 5B, cero desprendimiento con cinta 3M 610 a 90°). Rechaza: Desprendimiento parcial o total.',
      contingency: 'Detener el tiraje, ajustar la intensidad UV / velocidad y segregar el pliego defectuoso como merma.',
      isoStandard: 'ISO 2409 / ASTM D3359 Prueba de corte en enrejado',
    },
    {
      step: 5,
      title: '5. Liberación y Producción Masiva',
      phva: 'ACTUAR',
      responsible: 'Jefe de Producción y Operario UV',
      inputs: 'Pliego piloto aprobado por Calidad y vale de inspección firmado.',
      outputs: 'Lote completo barnizado con estabilidad dimensional y brillo continuo.',
      controlVariable: 'Estabilidad de parámetros durante todo el tiraje masivo.',
      criterion: 'Acepta: Brillo constante (>90 GU) y anclaje continuo sin sobrecalentamiento.',
      contingency: 'Monitoreo radiométrico continuo; si decae la potencia, pausar y limpiar reflectores.',
      isoStandard: 'ISO 9001:2015 Trazabilidad de lotes',
    },
    {
      step: 6,
      title: '6. Control de Calidad Final y Empaque',
      phva: 'VERIFICAR / ACTUAR',
      responsible: 'Coordinador de Calidad / Empaque',
      inputs: 'Pliegos apilados y enfriados tras la salida del tren de barnizado.',
      outputs: 'Lote liberado para troquelado, plegado o despacho a cliente.',
      controlVariable: 'Inspección visual de brillo, descamación en hendidos y prueba de frote.',
      criterion: 'Acepta: Cero bloqueo (pliegos pegados entre sí) y resistencia mecánica.',
      contingency: 'Segregar lotes dudosos y notificar a jefatura técnica.',
      isoStandard: 'ISO 9001 & ISO 14001 Gestión Ambiental de mermas',
    },
  ];

  const currentStepData = stepsDetails.find((s) => s.step === activeStep) || stepsDetails[0];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Flujograma Operativo y Ficha de Caracterización de Procesos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            IMPRESOS EL DÍA S.A.S. (Medellín) • Normativa ISO 9001:2015, ISO 14001, ISO 45001 e ISO 12647.
          </p>
        </div>
      </div>

      {/* Flujograma Visual Interactivo (Fiel al PDF) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Diagrama de Flujo del Proceso en Acabados UV (Haz clic en cada paso para ver detalles)</span>
          </span>
          <span className="text-xs text-cyan-400">Octubre 21 del 2026</span>
        </div>

        {/* Diagrama de Bloques */}
        <div className="flex flex-col items-center space-y-3 py-2 max-w-2xl mx-auto">
          {/* Nodo Inicio */}
          <div className="px-5 py-2 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 font-mono tracking-wider shadow">
            [ INICIO DE ORDEN DE PRODUCCIÓN ]
          </div>

          <ArrowDown className="w-4 h-4 text-slate-500" />

          {/* Bloque 1 */}
          <div
            onClick={() => setActiveStep(1)}
            className={`w-full p-4 rounded-xl border text-center transition-all cursor-pointer ${
              activeStep === 1
                ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-xs font-bold text-cyan-300 block">[ 1. RECEPCIÓN Y VERIFICACIÓN DE INSUMOS ]</span>
            <span className="text-[11px] text-slate-300">
              Validación en Matriz de Homologación Digital • Verificación de compatibilidad (Tinta Especial vs. Barniz UV)
            </span>
          </div>

          {/* Decisión 1 */}
          <div className="w-full flex items-center justify-center gap-4 py-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>¿CUMPLE?</span>
              <span className="text-emerald-400 font-mono">SÍ ↓</span>
            </div>
            <div className="h-px bg-slate-700 flex-1 max-w-[80px]" />
            <div className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>NO: ALERTA / CAMBIO DE INSUMO</span>
            </div>
          </div>

          {/* Bloque 2 */}
          <div
            onClick={() => setActiveStep(2)}
            className={`w-full p-4 rounded-xl border text-center transition-all cursor-pointer ${
              activeStep === 2
                ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-500/30 shadow-lg'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-xs font-bold text-amber-300 block">[ 2. TIEMPO DE REPOSO / OXIDACIÓN ]</span>
            <span className="text-[11px] text-slate-300">
              Espera del tiempo técnico estipulado (evita inhibición de polimerización)
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-500" />

          {/* Bloque 3 */}
          <div
            onClick={() => setActiveStep(3)}
            className={`w-full p-4 rounded-xl border text-center transition-all cursor-pointer ${
              activeStep === 3
                ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-xs font-bold text-cyan-300 block">[ 3. CONFIGURACIÓN DE PARÁMETROS EN LÍNEA ]</span>
            <span className="text-[11px] text-slate-300">
              Ajuste de velocidad de banda (m/min) • Regulación de potencia de lámparas UV (Watts/pulgada)
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-500" />

          {/* Bloque 4: Gate Review */}
          <div
            onClick={() => setActiveStep(4)}
            className={`w-full p-4 rounded-xl border text-center transition-all cursor-pointer ${
              activeStep === 4
                ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-xs font-bold text-indigo-300 block">[ 4. PRUEBA DE ADHESIÓN RÁPIDA (GATE-REVIEW) ]</span>
            <span className="text-[11px] text-slate-300">
              Ejecución de Prueba de Cinta 3M (Cross-Hatch Test) en pliego piloto
            </span>
          </div>

          {/* Decisión 2: Pasa prueba? */}
          <div className="w-full flex items-center justify-center gap-4 py-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>¿PASA LA PRUEBA?</span>
              <span className="text-emerald-400 font-mono">SÍ ↓</span>
            </div>
            <div className="h-px bg-slate-700 flex-1 max-w-[80px]" />
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>NO: RECALIBRACIÓN DE CURADO (Vuelve a 3)</span>
            </div>
          </div>

          {/* Bloque 5 */}
          <div
            onClick={() => setActiveStep(5)}
            className={`w-full p-4 rounded-xl border text-center transition-all cursor-pointer ${
              activeStep === 5
                ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-xs font-bold text-emerald-300 block">[ 5. LIBERACIÓN Y PRODUCCIÓN MASIVA ]</span>
            <span className="text-[11px] text-slate-300">
              Impresión y barnizado continuo con registro obligatorio de lote
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-500" />

          {/* Bloque 6 */}
          <div
            onClick={() => setActiveStep(6)}
            className={`w-full p-4 rounded-xl border text-center transition-all cursor-pointer ${
              activeStep === 6
                ? 'bg-slate-800 border-white ring-2 ring-slate-400 shadow-lg'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-xs font-bold text-slate-200 block">[ 6. CONTROL DE CALIDAD FINAL Y EMPAQUE ]</span>
            <span className="text-[11px] text-slate-300">
              Inspección visual de brillo, descamación y anclaje
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-500" />

          {/* Nodo Fin */}
          <div className="px-5 py-2 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 font-mono tracking-wider shadow">
            [ FIN DEL PROCESO DE ACABADO ]
          </div>
        </div>

        {/* Ficha de Caracterización Detallada del Paso Activo */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                {currentStepData.phva}
              </span>
              <h3 className="text-sm font-bold text-white">{currentStepData.title}</h3>
            </div>
            <span className="text-xs text-slate-400">
              Responsable: <strong className="text-slate-200">{currentStepData.responsible}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-slate-400 block">Entradas (Inputs):</span>
                <p className="text-slate-200">{currentStepData.inputs}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-400 block">Salidas (Outputs):</span>
                <p className="text-slate-200">{currentStepData.outputs}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-400 block">Norma ISO Aplicable:</span>
                <p className="text-cyan-300 font-mono">{currentStepData.isoStandard}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-semibold text-slate-400 block">Variable a Controlar:</span>
                <p className="text-slate-200">{currentStepData.controlVariable}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-400 block">Criterio de Aceptación / Rechazo:</span>
                <p className="text-slate-200">{currentStepData.criterion}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200">
                <span className="font-bold block">¿Qué hago si no cumplo?</span>
                <p className="mt-0.5">{currentStepData.contingency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
