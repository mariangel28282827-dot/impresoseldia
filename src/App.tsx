/**
 * SIGE-UV: Sistema Integral de Gestión, Estandarización y Control de Acabados UV
 * IMPRESOS EL DÍA S.A.S. - Planta Medellín
 * Solución técnica a la incompatibilidad fisicoquímica y descontrol de curado UV.
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardTab } from './components/tabs/DashboardTab';
import { HomologationMatrixTab } from './components/tabs/HomologationMatrixTab';
import { ProductionOrdersTab } from './components/tabs/ProductionOrdersTab';
import { UVCuringControlTab } from './components/tabs/UVCuringControlTab';
import { QualityGateReviewTab } from './components/tabs/QualityGateReviewTab';
import { ProcessFlowchartTab } from './components/tabs/ProcessFlowchartTab';
import { UserManualTab } from './components/tabs/UserManualTab';

import { InstallModal } from './components/InstallModal';
import { UninstallModal } from './components/UninstallModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';

import { usePWA } from './hooks/usePWA';
import { storageService } from './services/storageService';
import { ProductionOrder, InkItem, VarnishItem, InspectionLog, RoleType } from './types';
import { LayoutDashboard, Beaker, Layers, Zap, ShieldCheck, GitFork, BookOpen, AlertOctagon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeRole, setActiveRole] = useState<RoleType>('operario_uv');

  // Core Data
  const [orders, setOrders] = useState<ProductionOrder[]>(() => storageService.getOrders());
  const [inks, setInks] = useState<InkItem[]>(() => storageService.getInks());
  const [varnishes, setVarnishes] = useState<VarnishItem[]>(() => storageService.getVarnishes());
  const [inspections, setInspections] = useState<InspectionLog[]>(() => storageService.getInspections());

  // Navigation target order
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');

  // Modals state
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isUninstallOpen, setIsUninstallOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // PWA Hook
  const { isInstallable, isInstalled, isIOS, isOnline, triggerInstall } = usePWA();

  // Reload data from storage
  const handleReloadData = () => {
    setOrders(storageService.getOrders());
    setInks(storageService.getInks());
    setVarnishes(storageService.getVarnishes());
    setInspections(storageService.getInspections());
  };

  const handleOpenOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('orders');
  };

  const blockedCount = orders.filter((o) => o.status === 'bloqueada').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Corporativo con Botones de Instalar, Desinstalar y Salvaguardar */}
      <Header
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isOnline={isOnline}
        onOpenInstallModal={() => setIsInstallOpen(true)}
        onOpenUninstallModal={() => setIsUninstallOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
      />

      {/* Barra de Navegación de Pestañas / Módulos Operativos */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-16 z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Resumen & Diagnóstico</span>
            </button>

            <button
              onClick={() => setActiveTab('homologation')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'homologation'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Beaker className="w-4 h-4" />
              <span>1. Matriz de Homologación</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 relative ${
                activeTab === 'orders'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Órdenes de Producción</span>
              {blockedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                  {blockedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('uv_control')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'uv_control'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>2. Control Curado UV</span>
            </button>

            <button
              onClick={() => setActiveTab('gate_review')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'gate_review'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>3. Gate-Review (Cinta 3M)</span>
            </button>

            <button
              onClick={() => setActiveTab('flowchart')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'flowchart'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Flujograma & ISO</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'manual'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Manual de Usuario</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            orders={orders}
            inspections={inspections}
            onNavigateTab={setActiveTab}
            onOpenOrder={handleOpenOrder}
          />
        )}

        {activeTab === 'homologation' && (
          <HomologationMatrixTab
            inks={inks}
            varnishes={varnishes}
          />
        )}

        {activeTab === 'orders' && (
          <ProductionOrdersTab
            orders={orders}
            inks={inks}
            varnishes={varnishes}
            activeRole={activeRole}
            onUpdateOrders={setOrders}
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'uv_control' && (
          <UVCuringControlTab
            orders={orders}
            activeRole={activeRole}
            onUpdateOrders={setOrders}
            selectedOrderId={selectedOrderId}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'gate_review' && (
          <QualityGateReviewTab
            orders={orders}
            inspections={inspections}
            activeRole={activeRole}
            onUpdateOrders={setOrders}
            onUpdateInspections={setInspections}
            selectedOrderId={selectedOrderId}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'flowchart' && <ProcessFlowchartTab />}

        {activeTab === 'manual' && (
          <UserManualTab
            onOpenBackup={() => setIsBackupOpen(true)}
            onOpenInstall={() => setIsInstallOpen(true)}
          />
        )}
      </main>

      {/* Footer Industrial */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            IMPRESOS EL DÍA S.A.S. • Planta Medellín (Antioquia) • Estandarización de Acabados UV
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>ISO 9001:2015</span>
            <span>•</span>
            <span>ISO 14001:2015</span>
            <span>•</span>
            <span>ISO 45001:2018</span>
            <span>•</span>
            <span>ISO 12647</span>
          </div>
        </div>
      </footer>

      {/* Modales Requeridos por el Usuario */}
      {/* 1. Modal de Instalar */}
      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        onTriggerInstall={triggerInstall}
      />

      {/* 2. Modal de Desinstalar */}
      <UninstallModal
        isOpen={isUninstallOpen}
        onClose={() => setIsUninstallOpen(false)}
        onUninstallComplete={handleReloadData}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* 3. Modal de Salvaguardar / Base de Datos */}
      <BackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        orders={orders}
        onDataRestored={handleReloadData}
      />
    </div>
  );
}
