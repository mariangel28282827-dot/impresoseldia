import React from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert, Zap, Clock, TrendingUp, Layers, ArrowRight, Gauge, FileText } from 'lucide-react';
import { ProductionOrder, InspectionLog } from '../../types';

interface DashboardTabProps {
  orders: ProductionOrder[];
  inspections: InspectionLog[];
  onNavigateTab: (tab: string) => void;
  onOpenOrder: (orderId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  orders,
  inspections,
  onNavigateTab,
  onOpenOrder,
}) => {
  const blockedOrders = orders.filter((o) => o.status === 'bloqueada');
  const activeOrders = orders.filter((o) => o.status !== 'completada' && o.status !== 'rechazada_merma');
  const passingTests = inspections.filter((i) => i.verdict === 'APROBADO').length;
  const totalTests = inspections.length;
  const passRate = totalTests > 0 ? Math.round((passingTests / totalTests) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Banner de Diagnóstico y Contexto Técnico Forense */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Planta Medellín • Sistema Activo de Protección de Acabados UV</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
              Sistema de Estandarización y Control Fisicoquímico (SIGE-UV)
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Solución integral contra la incompatibilidad entre tintas especiales y barnices UV. Estandariza la reticulación radicalaria, bloquea combinaciones de riesgo y garantiza 100% de anclaje mediante Gate-Review.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('flowchart')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white text-xs font-bold border border-slate-700 transition"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Ver Flujograma del Proceso</span>
            </button>
            <button
              onClick={() => onNavigateTab('manual')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs font-bold border border-cyan-500/40 transition"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Manual de Usuario y Contingencias</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alerta de Causa Raíz Detectada (Medellín Sept-Oct 2026) */}
      <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-amber-300">
                Diagnóstico de Causa Raíz del Problema en Planta
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-medium">
                Incidente Septiembre - Octubre 2026 Resuelto
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Las fallas críticas de adherencia y descamación se originaban en dos causas combinadas:
              <strong className="text-white"> (1) Incompatibilidad termodinámica</strong> entre tintas ricas en siliconas/ceras y barniz UV radical libre, y
              <strong className="text-white"> (2) Descontrol de curado</strong> por falta de tiempo de reposo oxidativo y velocidad de banda no calibrada.
              El módulo de <em>Bloqueo Automático</em> y la <em>Parada Gate-Review (Cinta 3M)</em> previenen al 100% la liberación de pliegos defectuosos.
            </p>
          </div>
        </div>
      </div>

      {/* Métricas Principales en Tiempo Real */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Adhesión general */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Tasa de Adherencia (Gate-Review)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{passRate}%</span>
            <span className="text-xs text-slate-400 font-medium">Objetivo: 100%</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${passRate}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            {passingTests} de {totalTests} pruebas con anclaje total (Clase 5B)
          </span>
        </div>

        {/* Órdenes bloqueadas */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Bloqueadas por Seguridad</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-400">{blockedOrders.length}</span>
            <span className="text-xs text-red-300 font-medium">Incompatibles evitadas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 leading-tight">
            Bloqueo preventivo en fase de recepción antes de gastar insumos y generar mermas.
          </p>
        </div>

        {/* Órdenes activas en planta */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Lotes en Proceso</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400">{activeOrders.length}</span>
            <span className="text-xs text-slate-400 font-medium">OPs activas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 leading-tight">
            Entre reposo oxidativo, calibración UV y validación de cinta 3M.
          </p>
        </div>

        {/* Control de parámetros UV */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Dosis UV Promedio</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">265</span>
            <span className="text-xs text-slate-400 font-medium">mJ/cm²</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-3 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dentro de ventana óptima (220 - 320)</span>
          </p>
        </div>
      </div>

      {/* Grid de 2 columnas: Órdenes en Seguimiento y Protocolos Clave */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2 spans): Órdenes Activas y Bloqueadas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Monitoreo de Lotes de Producción en Planta</span>
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Ver todas las OPs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => {
              const isBlocked = order.status === 'bloqueada';
              return (
                <div
                  key={order.id}
                  onClick={() => onOpenOrder(order.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isBlocked
                      ? 'bg-red-950/20 border-red-500/40 hover:bg-red-950/30'
                      : order.status === 'completada'
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400/50 shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-white">{order.opNumber}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isBlocked
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : order.status === 'completada'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : order.status === 'produccion_masiva'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">• {order.client}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{order.jobDescription}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Pliegos: <strong className="text-slate-200">{order.sheetsQuantity.toLocaleString()}</strong></span>
                      <span>Paso: <strong className="text-cyan-400">{order.currentStep} de 6</strong></span>
                      {order.adhesionTest && (
                        <span>Anclaje: <strong className={order.adhesionTest.passed ? 'text-emerald-400' : 'text-red-400'}>{order.adhesionTest.adhesionPercentage}%</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    {isBlocked ? (
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Bloqueo Activo</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 flex items-center gap-1 font-medium hover:text-cyan-300">
                        <span>Gestionar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha (1 span): Tres Pilares de Solución */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-400" />
            <span>Los 3 Pilares de Estandarización</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* Pilar 1 */}
            <div
              onClick={() => onNavigateTab('homologation')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 text-xs uppercase tracking-wider">1. Matriz de Homologación</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">Digital</span>
              </div>
              <p className="text-slate-300">
                Bloquea en automático la orden si se combinan tintas siliconadas o de secado lento con barniz incompatible.
              </p>
            </div>

            {/* Pilar 2 */}
            <div
              onClick={() => onNavigateTab('uv_control')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-xs uppercase tracking-wider">2. Control Estadístico UV</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">En línea</span>
              </div>
              <p className="text-slate-300">
                Estandariza velocidad de banda (m/min), potencia de lámparas (W/pulgada) y temperatura del sustrato.
              </p>
            </div>

            {/* Pilar 3 */}
            <div
              onClick={() => onNavigateTab('gate_review')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 text-xs uppercase tracking-wider">3. Gate-Review de Calidad</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">Cinta 3M</span>
              </div>
              <p className="text-slate-300">
                Prueba rápida obligatoria en pliego piloto con Cross-Hatch Test. 100% de anclaje para liberar tiraje masivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
