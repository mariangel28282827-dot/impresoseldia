import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Search, Beaker, HelpCircle, ArrowRight, Ban, Info } from 'lucide-react';
import { InkItem, VarnishItem, CompatibilityRule, IncompatibilityRisk } from '../../types';
import { COMPATIBILITY_RULES } from '../../data/initialData';

interface HomologationMatrixTabProps {
  inks: InkItem[];
  varnishes: VarnishItem[];
}

export const HomologationMatrixTab: React.FC<HomologationMatrixTabProps> = ({
  inks,
  varnishes,
}) => {
  const [selectedInkId, setSelectedInkId] = useState<string>(inks[0]?.id || '');
  const [selectedVarnishId, setSelectedVarnishId] = useState<string>(varnishes[0]?.id || '');
  const [filterFamily, setFilterFamily] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectedInk = inks.find((i) => i.id === selectedInkId);
  const selectedVarnish = varnishes.find((v) => v.id === selectedVarnishId);

  // Evaluate compatibility
  const evaluatePair = (ink?: InkItem, varnish?: VarnishItem) => {
    if (!ink || !varnish) return null;

    // Check specific rule
    const rule = COMPATIBILITY_RULES.find(
      (r) => r.inkFamily === ink.family && r.varnishType === varnish.type
    );

    if (rule) return rule;

    // Default heuristic if not matched in specific matrix
    if (ink.family === 'silicona' && varnish.type !== 'especial_adhesion') {
      return {
        inkFamily: ink.family,
        varnishType: varnish.type,
        status: 'bloqueado' as IncompatibilityRisk,
        minOxidationHours: 999,
        reason: 'INCOMPATIBILIDAD CRÍTICA: La silicona impide el mojado superficial del barniz acrílico.',
        actionRequired: 'BLOQUEAR ORDEN. Cambiar formulación de tinta o usar barniz con promotor de adhesión.',
        technicalStandard: 'ASTM D3359 Grado 0B'
      };
    }

    if (ink.family === 'uv_offset') {
      return {
        inkFamily: ink.family,
        varnishType: varnish.type,
        status: 'optimo' as IncompatibilityRisk,
        minOxidationHours: 0,
        reason: 'COPOLIMERIZACIÓN TOTAL: Misma base química acrílica. Adherencia instantánea garantizada.',
        actionRequired: 'Sin restricciones. Proceder en línea.',
        technicalStandard: 'ISO 9001:2015'
      };
    }

    return {
      inkFamily: ink.family,
      varnishType: varnish.type,
      status: 'condicionado' as IncompatibilityRisk,
      minOxidationHours: ink.requiresOxidationTimeHours,
      reason: `Requiere reposo oxidativo mínimo de ${ink.requiresOxidationTimeHours} horas para estabilización antes del barnizado.`,
      actionRequired: 'Verificar bitácora de tiempo de secado antes de alimentar pliegos.',
      technicalStandard: 'ISO 12647-2'
    };
  };

  const simulationResult = evaluatePair(selectedInk, selectedVarnish);

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Beaker className="w-5 h-5 text-cyan-400" />
            <span>Matriz Técnica de Homologación e Insumos Digitalizada</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilar 1 del Plan de Estandarización • Bloqueo preventivo de combinaciones fisicoquímicamente incompatibles.
          </p>
        </div>
      </div>

      {/* Simulador Interactivo de Compatibilidad en Vivo */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Simulador de Compatibilidad Fisicoquímica en Tiempo Real</span>
          </div>
          <span className="text-xs text-slate-400">Verificación cruzada de tensión superficial y fotoiniciadores</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selector Tinta */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tinta Especial en Pliego Impreso</label>
            <select
              value={selectedInkId}
              onChange={(e) => setSelectedInkId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              {inks.map((ink) => (
                <option key={ink.id} value={ink.id}>
                  {ink.name} ({ink.family.toUpperCase()} - Reposo: {ink.requiresOxidationTimeHours}h)
                </option>
              ))}
            </select>
            {selectedInk && (
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-slate-200 font-semibold">Propiedad Química: </span>
                {selectedInk.chemicalProperties}
              </div>
            )}
          </div>

          {/* Selector Barniz */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Formulación de Barniz UV Seleccionada</label>
            <select
              value={selectedVarnishId}
              onChange={(e) => setSelectedVarnishId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              {varnishes.map((varnish) => (
                <option key={varnish.id} value={varnish.id}>
                  {varnish.name} ({varnish.viscosityCps} cPs - {varnish.photoinitiatorType.slice(0, 30)}...)
                </option>
              ))}
            </select>
            {selectedVarnish && (
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-slate-200 font-semibold">Parámetros recomendados: </span>
                Potencia UV: {selectedVarnish.recommendedPowerWattsInch} W/pulgada • Velocidad máx: {selectedVarnish.recommendedMaxSpeedMMin} m/min
              </div>
            )}
          </div>
        </div>

        {/* Veredicto de la Matriz */}
        {simulationResult && (
          <div
            className={`p-5 rounded-xl border transition-all ${
              simulationResult.status === 'bloqueado'
                ? 'bg-red-950/30 border-red-500/50 text-red-200'
                : simulationResult.status === 'condicionado'
                ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-current/20">
              <div className="flex items-center gap-2.5">
                {simulationResult.status === 'bloqueado' ? (
                  <Ban className="w-6 h-6 text-red-400 shrink-0" />
                ) : simulationResult.status === 'condicionado' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-black tracking-wide uppercase">
                    {simulationResult.status === 'bloqueado' && 'COMBINACIÓN PROHIBIDA - BLOQUEO AUTOMÁTICO'}
                    {simulationResult.status === 'condicionado' && 'COMBINACIÓN CONDICIONADA A PROTOCOLO'}
                    {simulationResult.status === 'optimo' && 'HOMOLOGACIÓN ÓPTIMA Y SEGURA'}
                  </h3>
                  <span className="text-[11px] opacity-80 font-mono">
                    Norma técnica: {simulationResult.technicalStandard}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/40 border border-current/30">
                  Reposo Mínimo: {simulationResult.minOxidationHours} horas
                </span>
              </div>
            </div>

            <div className="pt-3 space-y-2 text-xs">
              <p className="leading-relaxed">
                <strong>Diagnóstico: </strong>
                {simulationResult.reason}
              </p>
              <div className="p-2.5 rounded-lg bg-black/30 border border-current/20 font-medium">
                <span className="font-bold underline">Instrucción obligatoria de planta: </span>
                {simulationResult.actionRequired}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reglas de la Matriz de Homologación Completa */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Matriz Técnica Oficial Registrada (Planta Medellín)</span>
          </h3>

          <div className="flex items-center gap-2">
            <select
              value={filterFamily}
              onChange={(e) => setFilterFamily(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
            >
              <option value="todos">Todas las Familias de Tintas</option>
              <option value="silicona">Tintas con Silicona</option>
              <option value="secado_lento">Secado Oxidativo Lento</option>
              <option value="metalizada">Metalizadas</option>
              <option value="uv_offset">UV Offset 100% Sólidos</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMPATIBILITY_RULES.filter((rule) => {
            if (filterFamily !== 'todos' && rule.inkFamily !== filterFamily) return false;
            return true;
          }).map((rule, idx) => {
            const isBlocked = rule.status === 'bloqueado';
            const isConditioned = rule.status === 'condicionado';
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isBlocked
                    ? 'bg-red-950/20 border-red-500/30'
                    : isConditioned
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-emerald-950/20 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isBlocked
                          ? 'bg-red-500 text-slate-950'
                          : isConditioned
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {rule.status}
                    </span>
                    <span className="text-xs font-bold text-white capitalize">
                      {rule.inkFamily.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Reposo: {rule.minOxidationHours === 999 ? 'PROHIBIDO' : `${rule.minOxidationHours}h`}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Barniz: </span>
                  <strong className="text-white capitalize">{rule.varnishType.replace(/_/g, ' ')}</strong>
                </div>

                <p className="text-xs text-slate-300 leading-snug">{rule.reason}</p>

                <div className="p-2 rounded bg-black/40 text-[11px] text-slate-300 font-medium">
                  <span className="text-cyan-300">Acción: </span>
                  {rule.actionRequired}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
