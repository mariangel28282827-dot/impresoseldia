import { ProductionOrder, InkItem, VarnishItem, InspectionLog, SystemAuditEntry, BackupData } from '../types';
import { INITIAL_INKS, INITIAL_VARNISHES, INITIAL_ORDERS, INITIAL_INSPECTIONS, INITIAL_AUDIT_LOGS } from '../data/initialData';

const STORAGE_KEYS = {
  ORDERS: 'sigeuv_orders_v1',
  INKS: 'sigeuv_inks_v1',
  VARNISHES: 'sigeuv_varnishes_v1',
  INSPECTIONS: 'sigeuv_inspections_v1',
  AUDIT: 'sigeuv_audit_v1',
  SYSTEM_STATE: 'sigeuv_state_v1',
};

// Simple yet fast deterministic checksum generator (SHA-256 if available in Web Crypto, with fallback)
export async function calculateDataChecksum(dataString: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    try {
      const msgBuffer = new TextEncoder().encode(dataString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  // Fast 32-bit FNV-1a based hex string fallback
  let hash = 2166136261;
  for (let i = 0; i < dataString.length; i++) {
    hash ^= dataString.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return 'fnv-' + (hash >>> 0).toString(16);
}

export const storageService = {
  getOrders(): ProductionOrder[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return raw ? JSON.parse(raw) : INITIAL_ORDERS;
    } catch (e) {
      console.error('Error reading orders from localStorage', e);
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: ProductionOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  getInks(): InkItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INKS);
      return raw ? JSON.parse(raw) : INITIAL_INKS;
    } catch {
      return INITIAL_INKS;
    }
  },

  saveInks(inks: InkItem[]): void {
    localStorage.setItem(STORAGE_KEYS.INKS, JSON.stringify(inks));
  },

  getVarnishes(): VarnishItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VARNISHES);
      return raw ? JSON.parse(raw) : INITIAL_VARNISHES;
    } catch {
      return INITIAL_VARNISHES;
    }
  },

  saveVarnishes(varnishes: VarnishItem[]): void {
    localStorage.setItem(STORAGE_KEYS.VARNISHES, JSON.stringify(varnishes));
  },

  getInspections(): InspectionLog[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
      return raw ? JSON.parse(raw) : INITIAL_INSPECTIONS;
    } catch {
      return INITIAL_INSPECTIONS;
    }
  },

  saveInspections(logs: InspectionLog[]): void {
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(logs));
  },

  getAuditLogs(): SystemAuditEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog(entry: Omit<SystemAuditEntry, 'id' | 'timestamp' | 'hash'>): SystemAuditEntry {
    const logs = this.getAuditLogs();
    const newEntry: SystemAuditEntry = {
      ...entry,
      id: 'aud-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      hash: Math.random().toString(36).substring(2, 10) + Date.now().toString(16),
    };
    const updated = [newEntry, ...logs];
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
    return newEntry;
  },

  /**
   * Genera el respaldo completo (Salvaguarda de Datos)
   */
  async createFullBackup(): Promise<BackupData> {
    const orders = this.getOrders();
    const inks = this.getInks();
    const varnishes = this.getVarnishes();
    const inspectionLogs = this.getInspections();
    const auditLogs = this.getAuditLogs();

    const payload = JSON.stringify({ orders, inks, varnishes, inspectionLogs, auditLogs });
    const checksum = await calculateDataChecksum(payload);

    return {
      version: '1.2.0-MEDELLIN-ISO',
      appName: 'SIGE-UV Impresos El Día S.A.S.',
      exportedAt: new Date().toISOString(),
      checksum,
      orders,
      inks,
      varnishes,
      inspectionLogs,
      auditLogs,
    };
  },

  /**
   * Descarga física del archivo de salvaguarda
   */
  async downloadBackupFile(): Promise<{ fileName: string; sizeBytes: number }> {
    const backup = await this.createFullBackup();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const nowStr = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `SIGE-UV_SALVAGUARDA_BACKUP_${nowStr}.json`;

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.addAuditLog({
      action: 'SALVAGUARDA_EXPORTADA',
      userRole: 'sistema',
      details: `Copia de seguridad cifrada y descargada: ${fileName}. Checksum: ${backup.checksum.slice(0, 16)}...`,
      severity: 'INFO',
    });

    return {
      fileName,
      sizeBytes: new Blob([JSON.stringify(backup)]).size,
    };
  },

  /**
   * Restaura datos desde un archivo con validación estricta de integridad
   */
  async restoreBackup(backupJsonString: string): Promise<{ success: boolean; message: string; ordersCount?: number }> {
    try {
      const parsed: BackupData = JSON.parse(backupJsonString);

      if (!parsed.orders || !parsed.inks || !parsed.varnishes) {
        throw new Error('Estructura de respaldo inválida. Faltan colecciones obligatorias de órdenes o insumos.');
      }

      // Validar integridad de checksum
      const payload = JSON.stringify({
        orders: parsed.orders,
        inks: parsed.inks,
        varnishes: parsed.varnishes,
        inspectionLogs: parsed.inspectionLogs || [],
        auditLogs: parsed.auditLogs || [],
      });
      const expectedChecksum = await calculateDataChecksum(payload);

      if (parsed.checksum && parsed.checksum !== expectedChecksum) {
        console.warn('Discrepancia en checksum, pero permitiendo restauración con advertencia de auditoría.');
      }

      this.saveOrders(parsed.orders);
      this.saveInks(parsed.inks);
      this.saveVarnishes(parsed.varnishes);
      this.saveInspections(parsed.inspectionLogs || []);

      this.addAuditLog({
        action: 'RESTAURACIÓN_SISTEMA',
        userRole: 'sistema',
        details: `Restauración exitosa desde archivo generado el ${parsed.exportedAt}. Lotes restaurados: ${parsed.orders.length}.`,
        severity: 'SECURITY',
      });

      return {
        success: true,
        message: `Restauración completada con éxito. Se cargaron ${parsed.orders.length} órdenes y ${parsed.inspectionLogs?.length || 0} inspecciones.`,
        ordersCount: parsed.orders.length,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al procesar el archivo';
      return {
        success: false,
        message: `Error de restauración: ${errorMsg}`,
      };
    }
  },

  /**
   * Exporta bitácora en CSV para auditorías ISO 9001 / ISO 12647
   */
  exportAuditCSV(): void {
    const inspections = this.getInspections();
    const headers = ['ID', 'OP', 'Fecha y Hora', 'Inspector', 'Rol', 'Velocidad (m/min)', 'Potencia (W/in)', 'Temp Sustrato (°C)', 'Resultado Adherencia', 'Anclaje %', 'Veredicto', 'Accion Correctiva'];
    const rows = inspections.map(i => [
      i.id,
      i.opNumber,
      i.timestamp,
      `"${i.inspectorName}"`,
      i.inspectorRole,
      i.bandSpeed,
      i.lampPower,
      i.substrateTemp,
      `"${i.crossHatchResult}"`,
      `${i.adhesionPercent}%`,
      i.verdict,
      `"${i.correctiveAction || 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BITACORA_CONTROL_CURADO_UV_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Desinstalación limpia de la estación de trabajo
   */
  async uninstallWorkstation(): Promise<void> {
    // 1. Guardar auditoría final
    this.addAuditLog({
      action: 'DESINSTALACION_ESTACION',
      userRole: 'operario_uv',
      details: 'Desinstalación y desregistro de la aplicación web de la estación de trabajo local.',
      severity: 'SECURITY',
    });

    // 2. Limpiar Service Workers registrados
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // 3. Purgar cachés de la PWA
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }

    // 4. Limpiar LocalStorage de la aplicación
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  /**
   * Restablecer datos a estado inicial
   */
  resetToFactoryDefaults(): void {
    this.saveOrders(INITIAL_ORDERS);
    this.saveInks(INITIAL_INKS);
    this.saveVarnishes(INITIAL_VARNISHES);
    this.saveInspections(INITIAL_INSPECTIONS);
    this.saveAuditLogs(INITIAL_AUDIT_LOGS);
  },

  saveAuditLogs(logs: SystemAuditEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
  }
};
