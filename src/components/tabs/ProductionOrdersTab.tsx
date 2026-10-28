import React, { useState } from 'react';
import { Plus, Search, Filter, AlertOctagon, CheckCircle2, Clock, ChevronRight, Ban, Zap, ShieldCheck, ArrowRight, Play, Check, AlertTriangle } from 'lucide-react';
import { ProductionOrder, InkItem, VarnishItem, RoleType, IncompatibilityRisk, OPStatus } from '../../types';
import { COMPATIBILITY_RULES } from '../../data/initialData';
import { storageService } from '../../services/storageService';

interface ProductionOrdersTabProps {
  orders: ProductionOrder[];
  inks: InkItem[];
  varnishes: VarnishItem[];
  activeRole: RoleType;
  onUpdateOrders: (orders: ProductionOrder[]) => void;
  selectedOrderId?: string;
  onSelectOrder: (orderId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ProductionOrdersTab: React.FC<ProductionOrdersTabProps> = ({
  orders,
  inks,
  varnishes,
  activeRole,
  onUpdateOrders,
  selectedOrderId,
  onSelectOrder,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New OP Form state
  const [newOpNumber, setNewOpNumber] = useState(`OP-${Math.floor(4000 + Math.random() * 900)}`);
  const [newClient, setNewClient] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newSubstrate, setNewSubstrate] = useState('Cartón Folding Calibre 14 (300g/m²)');
  const [newGrammage, setNewGrammage] = useState(300);
  const [newSheets, setNewSheets] = useState(10000);
  const [newInkId, setNewInkId] = useState(inks[0]?.id || '');
  const [newVarnishId, setNewVarnishId] = useState(varnishes[0]?.id || '');

  // Active selected order
  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Evaluate new OP combination
  const selectedNewInk = inks.find((i) => i.id === newInkId);
  const selectedNewVarnish = varnishes.find((v) => v.id === newVarnishId);

  const checkCompatibility = (ink?: InkItem, varnish?: VarnishItem) => {
    if (!ink || !varnish) return { status: 'optimo' as IncompatibilityRisk, reason: '', blocked: false };
    const rule = COMPATIBILITY_RULES.find((r) => r.inkFamily === ink.family && r.varnishType === varnish.type);
    if (rule) {
      return {
        status: rule.status,
        reason: rule.reason,
        blocked: rule.status === 'bloqueado',
        minOxidation: rule.minOxidationHours,
      };
    }
    if (ink.family === 'silicona' && varnish.type !== 'especial_adhesion') {
      return {
        status: 'bloqueado' as IncompatibilityRisk,
        reason: 'Incompatibilidad fisicoquímica por silicona PDMS.',
        blocked: true,
        minOxidation: 999,
      };
    }
    return {
      status: 'condicionado' as IncompatibilityRisk,
      reason: `Requiere reposo oxidativo de ${ink.requiresOxidationTimeHours}h.`,
      blocked: false,
      minOxidation: ink.requiresOxidationTimeHours,
    };
  };

  const newOpCompatibility = checkCompatibility(selectedNewInk, selectedNewVarnish);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newJobDescription.trim()) return;

    const isBlocked = newOpCompatibility.blocked;
    const newOrder: ProductionOrder = {
      id: `op-2026-${Date.now().toString().slice(-4)}`,
      opNumber: newOpNumber,
      client: newClient,
      jobDescription: newJobDescription,
      substrateType: newSubstrate,
      substrateGrammage: newGrammage,
      inkId: newInkId,
      varnishId: newVarnishId,
      sheetsQuantity: newSheets,
      createdAt: new Date().toISOString(),
      createdByRole: activeRole,
      compatibilityStatus: newOpCompatibility.status,
      compatibilityNotes: newOpCompatibility.reason,
      isBlocked,
      blockReason: isBlocked ? newOpCompatibility.reason : undefined,
      requiredOxidationHours: newOpCompatibility.minOxidation || 0,
      oxidationStartTime: new Date().toISOString(),
      oxidationCompleted: newOpCompatibility.minOxidation === 0,
      actualOxidationHours: 0,
      uvSettings: {
        bandSpeedMMin: selectedNewVarnish?.recommendedMaxSpeedMMin || 30,
        lampPowerWattsInch: selectedNewVarnish?.recommendedPowerWattsInch || 300,
        substrateTempCelsius: 38,
        calculatedDoseMjCm2: 240,
        lampsActive: 2,
        calibratedBy: 'Pendiente de calibración en línea',
      },
      currentStep: isBlocked ? 1 : newOpCompatibility.minOxidation === 0 ? 3 : 2,
      status: isBlocked ? 'bloqueada' : newOpCompatibility.minOxidation === 0 ? 'calibracion_uv' : 'oxidacion_espera',
    };

    const updated = [newOrder, ...orders];
    onUpdateOrders(updated);
    storageService.saveOrders(updated);

    storageService.addAuditLog({
      action: isBlocked ? 'ORDEN_BLOQUEADA_CREACION' : 'ORDEN_CREADA',
      userRole: activeRole,
      details: `Se registró orden ${newOrder.opNumber} (${newOrder.client}). Estado: ${newOrder.status.toUpperCase()}.`,
      severity: isBlocked ? 'CRITICAL' : 'INFO',
    });

    onSelectOrder(newOrder.id);
    setShowCreateModal(false);
    // Reset form
    setNewOpNumber(`OP-${Math.floor(4000 + Math.random() * 900)}`);
    setNewClient('');
    setNewJobDescription('');
  };

  // Change order formulation if blocked
  const handleResolveBlockedOrder = (order: ProductionOrder, newVarnishType: string) => {
    const suitableVarnish = varnishes.find((v) => v.id === newVarnishType) || varnishes[1]; // Varnish especial adhesión
    const updated = orders.map((o) => {
      if (o.id === order.id) {
        return {
          ...o,
          varnishId: suitableVarnish.id,
          isBlocked: false,
          blockReason: undefined,
          compatibilityStatus: 'condicionado' as IncompatibilityRisk,
          compatibilityNotes: 'Formulación corregida en planta: se sustituyó por Barniz Especial de Adhesión Reforzada.',
          status: 'oxidacion_espera' as OPStatus,
          currentStep: 2 as const,
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    storageService.saveOrders(updated);
    storageService.addAuditLog({
      action: 'DESBLOQUEO_FORMULACION_CORREGIDA',
      userRole: activeRole,
      details: `OP ${order.opNumber} desbloqueada al cambiar formulación a ${suitableVarnish.name}.`,
      severity: 'WARNING',
    });
  };

  // Complete oxidation step
  const handleCompleteOxidation = (order: ProductionOrder) => {
    const updated = orders.map((o) => {
      if (o.id === order.id) {
        return {
          ...o,
          oxidationCompleted: true,
          actualOxidationHours: o.requiredOxidationHours,
          currentStep: 3 as const,
          status: 'calibracion_uv' as OPStatus,
        };
      }
      return o;
    });
    onUpdateOrders(updated);
    storageService.saveOrders(updated);
    storageService.addAuditLog({
      action: 'REPOSO_OXIDACION_CUMPLIDO',
      userRole: activeRole,
      details: `OP ${order.opNumber} cumplió ciclo de reposo oxidativo de ${order.requiredOxidationHours}h. Pasa a calibración UV.`,
      severity: 'INFO',
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'todos' && o.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        o.opNumber.toLowerCase().includes(term) ||
        o.client.toLowerCase().includes(term) ||
        o.jobDescription.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Barra Superior con Botón de Creación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Órdenes de Producción y Trazabilidad por Lote</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Control paso a paso según ficha técnica de caracterización ISO 9001 / ISO 12647
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Orden de Producción (OP)</span>
        </button>
      </div>

      {/* Grid de 2 columnas: Lista a la izquierda, Detalle de OP a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Filtros y Lista (5 spans) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar OP, cliente o trabajo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="todos">Todos los Estados</option>
              <option value="bloqueada">Bloqueada</option>
              <option value="oxidacion_espera">En Reposo / Oxidación</option>
              <option value="calibracion_uv">Calibración UV</option>
              <option value="produccion_masiva">Producción Masiva</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
                No se encontraron órdenes con los filtros seleccionados.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = order.id === currentOrder?.id;
                const isBlocked = order.status === 'bloqueada';
                return (
                  <div
                    key={order.id}
                    onClick={() => onSelectOrder(order.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                        : isBlocked
                        ? 'bg-red-950/20 border-red-500/30 hover:bg-red-950/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">{order.opNumber}</span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isBlocked
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : order.status === 'completada'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : order.status === 'produccion_masiva'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">Paso {order.currentStep}/6</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">{order.jobDescription}</p>
                    <p className="text-[11px] text-slate-400">{order.client}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                      <span>{order.sheetsQuantity.toLocaleString()} pliegos</span>
                      <span className="text-cyan-400 font-medium flex items-center gap-1">
                        <span>Ver detalle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Columna Derecha: Detalle de OP seleccionada y Flujo de Pasos (7 spans) */}
        <div className="lg:col-span-7">
          {currentOrder ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              {/* Header de la OP */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xl font-black text-white">{currentOrder.opNumber}</span>
                    <span
                      className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        currentOrder.status === 'bloqueada'
                          ? 'bg-red-500 text-slate-950 font-black'
                          : currentOrder.status === 'completada'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {currentOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 mt-1">{currentOrder.jobDescription}</p>
                  <p className="text-xs text-slate-400">Cliente: {currentOrder.client} • Sustrato: {currentOrder.substrateType}</p>
                </div>

                <div className="text-right sm:text-right text-xs text-slate-400">
                  <span className="block font-bold text-white text-base">{currentOrder.sheetsQuantity.toLocaleString()}</span>
                  <span>Pliegos autorizados</span>
                </div>
              </div>

              {/* Si está bloqueada: Banner de bloqueo y contingencia */}
              {currentOrder.isBlocked && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/60 text-red-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <Ban className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-300 uppercase tracking-wide">
                        Bloqueo Fisicoquímico Activo (Pilar 1)
                      </h4>
                      <p className="text-xs text-red-200 mt-1 leading-relaxed">
                        {currentOrder.blockReason || currentOrder.compatibilityNotes}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-red-500/30 text-xs space-y-2">
                    <span className="font-bold text-red-300 block">¿Qué hacer según protocolo de planta (Ficha de Caracterización)?</span>
                    <p className="text-slate-300">
                      Retener el lote y solicitar cambio de formulación. Se recomienda sustituir el Barniz Estándar por <strong>Barniz UV Especial Anclaje Reforzado (Zeller+Gmelin Grip-Bond 9500)</strong> o aplicar primer acrílico promotor.
                    </p>
                    <button
                      onClick={() => handleResolveBlockedOrder(currentOrder, 'varnish-esp-adhesion')}
                      className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aplicar Cambio de Insumo y Desbloquear OP</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Pasos del Proceso (Flujo Paso a Paso del PDF) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Progreso en Línea de Acabado UV (Flujograma Oficial)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {/* Paso 1 */}
                  <div className={`p-3 rounded-xl border ${currentOrder.isBlocked ? 'bg-red-950/20 border-red-500/30' : 'bg-slate-800/80 border-slate-700'}`}>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-400">
                      <span>1. Recepción e Insumos</span>
                      {currentOrder.isBlocked ? <AlertOctagon className="w-3.5 h-3.5 text-red-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="font-medium text-slate-200">
                      {currentOrder.isBlocked ? 'Incompatible (Bloqueado)' : 'Homologado en Matriz'}
                    </p>
                  </div>

                  {/* Paso 2 */}
                  <div className={`p-3 rounded-xl border ${currentOrder.currentStep === 2 ? 'bg-amber-950/20 border-amber-500/40' : currentOrder.currentStep > 2 ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-400">
                      <span>2. Reposo / Oxidación</span>
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="font-medium text-slate-200">
                      {currentOrder.requiredOxidationHours === 0
                        ? '0h (Tinta UV Directa)'
                        : `${currentOrder.actualOxidationHours}h de ${currentOrder.requiredOxidationHours}h requeridas`}
                    </p>
                    {currentOrder.currentStep === 2 && !currentOrder.oxidationCompleted && (
                      <button
                        onClick={() => handleCompleteOxidation(currentOrder)}
                        className="mt-2 w-full py-1 px-2 rounded bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400 transition"
                      >
                        Registrar Reposo Cumplido
                      </button>
                    )}
                  </div>

                  {/* Paso 3 */}
                  <div className={`p-3 rounded-xl border ${currentOrder.currentStep === 3 ? 'bg-cyan-950/30 border-cyan-500/50' : currentOrder.currentStep > 3 ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-400">
                      <span>3. Calibración UV</span>
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <p className="font-medium text-slate-200">
                      {currentOrder.uvSettings.lampPowerWattsInch} W/in • {currentOrder.uvSettings.bandSpeedMMin} m/min
                    </p>
                    {currentOrder.currentStep === 3 && (
                      <button
                        onClick={() => onNavigateTab('uv_control')}
                        className="mt-2 w-full py-1 px-2 rounded bg-cyan-500 text-slate-950 font-bold text-[10px] hover:bg-cyan-400 transition"
                      >
                        Calibrar en Línea
                      </button>
                    )}
                  </div>

                  {/* Paso 4 */}
                  <div className={`p-3 rounded-xl border ${currentOrder.currentStep === 4 ? 'bg-indigo-950/30 border-indigo-500/50' : currentOrder.currentStep > 4 ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-400">
                      <span>4. Gate-Review Cinta 3M</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <p className="font-medium text-slate-200">
                      {currentOrder.adhesionTest
                        ? `Anclaje: ${currentOrder.adhesionTest.adhesionPercentage}% (${currentOrder.adhesionTest.astmClass})`
                        : 'Pendiente de prueba'}
                    </p>
                    {currentOrder.currentStep === 4 && (
                      <button
                        onClick={() => onNavigateTab('gate_review')}
                        className="mt-2 w-full py-1 px-2 rounded bg-indigo-500 text-white font-bold text-[10px] hover:bg-indigo-400 transition"
                      >
                        Ejecutar Prueba Rápida
                      </button>
                    )}
                  </div>

                  {/* Paso 5 */}
                  <div className={`p-3 rounded-xl border ${currentOrder.currentStep === 5 ? 'bg-emerald-950/30 border-emerald-500/50' : currentOrder.currentStep > 5 ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-400">
                      <span>5. Producción Masiva</span>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="font-medium text-slate-200">
                      {currentOrder.status === 'completada' ? 'Lote concluido' : currentOrder.currentStep === 5 ? 'En tiraje continuo' : 'En cola'}
                    </p>
                  </div>

                  {/* Paso 6 */}
                  <div className={`p-3 rounded-xl border ${currentOrder.currentStep === 6 ? 'bg-slate-800 border-slate-700' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-400">
                      <span>6. Calidad Final</span>
                      <Check className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-200">
                      {currentOrder.status === 'completada' ? 'Aprobado para Troquel' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de acceso directo al siguiente paso operativo */}
              {!currentOrder.isBlocked && currentOrder.status !== 'completada' && (
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block font-medium">Siguiente acción operativa recomendada:</span>
                    <span className="font-bold text-cyan-300">
                      {currentOrder.currentStep === 2 && 'Completar reposo oxidativo y verificar ausencia de pliegos frescos.'}
                      {currentOrder.currentStep === 3 && 'Calibrar potencia de lámparas y velocidad de banda en el túnel UV.'}
                      {currentOrder.currentStep === 4 && 'Realizar prueba de corte en cruz (Cross-Hatch) y cinta 3M 610.'}
                      {currentOrder.currentStep === 5 && 'Monitorear tiraje continuo y verificar brillo uniforme.'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (currentOrder.currentStep === 3) onNavigateTab('uv_control');
                      else if (currentOrder.currentStep === 4) onNavigateTab('gate_review');
                      else onNavigateTab('uv_control');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    <span>Ir al Módulo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Selecciona una orden de producción para ver su trazabilidad completa.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Creación de Orden */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">Nueva Orden de Producción (OP)</h3>
            <p className="text-xs text-slate-400 mb-4">
              Verificación automática de insumos contra la matriz digital de homologación.
            </p>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Número de OP</label>
                  <input
                    type="text"
                    value={newOpNumber}
                    onChange={(e) => setNewOpNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Cliente</label>
                  <input
                    type="text"
                    placeholder="Ej: Laboratorios Baxter, Colombina..."
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-300 block mb-1">Descripción del Trabajo</label>
                <input
                  type="text"
                  placeholder="Ej: Empaques Plegadizas Cartón Sulfatado - Acabado UV Brillo"
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tipo de Sustrato</label>
                  <input
                    type="text"
                    value={newSubstrate}
                    onChange={(e) => setNewSubstrate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Gramaje (g/m²)</label>
                  <input
                    type="number"
                    value={newGrammage}
                    onChange={(e) => setNewGrammage(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Cantidad Pliegos</label>
                  <input
                    type="number"
                    value={newSheets}
                    onChange={(e) => setNewSheets(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Selección de Insumos con Diagnóstico en Tiempo Real */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Verificación de Insumos Fisicoquímicos
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Tinta Especial Impresa</label>
                    <select
                      value={newInkId}
                      onChange={(e) => setNewInkId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                    >
                      {inks.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Barniz UV Requerido</label>
                    <select
                      value={newVarnishId}
                      onChange={(e) => setNewVarnishId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                    >
                      {varnishes.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resultado de la validación */}
                <div
                  className={`p-3 rounded-lg text-xs border ${
                    newOpCompatibility.blocked
                      ? 'bg-red-950/40 border-red-500/50 text-red-200'
                      : newOpCompatibility.status === 'condicionado'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {newOpCompatibility.blocked ? (
                      <Ban className="w-4 h-4 text-red-400" />
                    ) : newOpCompatibility.status === 'condicionado' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>
                      {newOpCompatibility.blocked && 'ATENCIÓN: Combinación Bloqueada por Incompatibilidad'}
                      {newOpCompatibility.status === 'condicionado' && 'Combinación Condicionada a Reposo'}
                      {newOpCompatibility.status === 'optimo' && 'Insumos 100% Homologados'}
                    </span>
                  </div>
                  <p className="leading-snug">{newOpCompatibility.reason}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    newOpCompatibility.blocked
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  {newOpCompatibility.blocked ? 'Registrar Orden como BLOQUEADA' : 'Registrar Orden en Planta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
