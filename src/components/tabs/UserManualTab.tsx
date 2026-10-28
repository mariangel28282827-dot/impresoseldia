import React, { useState } from 'react';
import { BookOpen, Printer, Download, ShieldCheck, CheckCircle2, AlertTriangle, LifeBuoy, FileText, Wrench, ExternalLink, HardDrive } from 'lucide-react';

interface UserManualTabProps {
  onOpenBackup: () => void;
  onOpenInstall: () => void;
}

export const UserManualTab: React.FC<UserManualTabProps> = ({
  onOpenBackup,
  onOpenInstall,
}) => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Barra de Herramientas de Documentación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Manual de Usuario Oficial y Documentación Técnica de Soporte</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manual de Procedimientos Operativos Estandarizados (SOP) • IMPRESOS EL DÍA S.A.S. (Medellín)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Imprimir Manual / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Grid: Menú de navegación a la izquierda, contenido a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navegación de secciones (4 spans) */}
        <div className="lg:col-span-4 space-y-2">
          <button
            onClick={() => setActiveSection('intro')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeSection === 'intro'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>1. Diagnóstico del Problema y Objetivos</span>
          </button>

          <button
            onClick={() => setActiveSection('roles')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeSection === 'roles'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>2. Roles y Responsabilidades (RACI)</span>
          </button>

          <button
            onClick={() => setActiveSection('sop')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeSection === 'sop'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>3. Procedimiento Paso a Paso (1 al 6)</span>
          </button>

          <button
            onClick={() => setActiveSection('adhesion')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeSection === 'adhesion'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>4. Protocolo Cross-Hatch / Cinta 3M</span>
          </button>

          <button
            onClick={() => setActiveSection('contingencies')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeSection === 'contingencies'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>5. Matriz de Contingencias "¿Qué hago si no cumplo?"</span>
          </button>

          <button
            onClick={() => setActiveSection('safety')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeSection === 'safety'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>6. Seguridad y Salud Ocupacional (ISO 45001)</span>
          </button>

          <button
            onClick={() => setActiveSection('maintenance')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
              activeSection === 'maintenance'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>7. Instalación, Desinstalación y Salvaguarda</span>
          </button>
        </div>

        {/* Contenedor de contenido del Manual (8 spans) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-slate-200 text-xs leading-relaxed">
          {activeSection === 'intro' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Capítulo 1</span>
                <h3 className="text-base font-bold text-white">Problema en Planta Medellín y Propuesta de Solución</h3>
              </div>

              <p>
                En la empresa <strong>IMPRESOS EL DÍA S.A.S.</strong>, durante el periodo septiembre - octubre de 2026, la planta de Medellín experimentó graves pérdidas por incompatibilidad fisicoquímica entre tintas especiales y barnices UV, además de un descontrol en las variables de curado, lo que derivó en reticulación incompleta, descamación y rechazos de clientes editoriales y farmacéuticos.
              </p>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="font-bold text-cyan-300 block text-xs">Estrategia de los Tres Pilares Operativos:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>
                    <strong>Matriz de Homologación e Insumos Digitalizada:</strong> Bloqueo automático de combinaciones prohibidas (ej. tintas de alta silicona con barniz estándar) en la Orden de Producción.
                  </li>
                  <li>
                    <strong>Control Estadístico de Parámetros de Curado:</strong> Estandarización de velocidad de banda (m/min), potencia de lámparas UV (W/pulgada) y temperatura de sustrato con registro digital obligatorio.
                  </li>
                  <li>
                    <strong>Metodología Ágil de Validación Rápida (Gate-Review):</strong> Parada técnica obligatoria con prueba de cinta 3M (Cross-Hatch Test) en pliego piloto con criterio de 100% de anclaje antes de liberar tiraje.
                  </li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-700/40 text-slate-300 space-y-1">
                <span className="font-bold text-indigo-300">Objetivo General:</span>
                <p>
                  Estandarizar los parámetros operativos de compatibilidad entre las tintas especiales y el acabado UV para eliminar la inestabilidad y los reprocesos en la planta de Medellín a partir del año 2026.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'roles' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Capítulo 2</span>
                <h3 className="text-base font-bold text-white">Roles y Responsabilidades en Planta</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-cyan-400 block mb-1">1. Jefe de Producción / Post-Prensa</span>
                  <p className="text-slate-300">
                    Liderazgo técnico, recepción de órdenes de producción (OP), verificación de insumos en la matriz digital de compatibilidad y autorización formal de la liberación de lotes.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-amber-400 block mb-1">2. Operario de Máquina UV</span>
                  <p className="text-slate-300">
                    Ejecución física de parámetros de línea (regulación de velocidad de banda, potencia de lámparas UV en Watts/pulgada, verificación de temperatura) y registro digital obligatorio por lote.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-emerald-400 block mb-1">3. Coordinador de Calidad</span>
                  <p className="text-slate-300">
                    Auditoría de la matriz de homologación, ejecución o supervisión del Cross-Hatch Test / Prueba de cinta 3M 610, dictamen de aceptación o rechazo y levantamiento de reportes de no conformidad ISO 9001.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sop' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Capítulo 3</span>
                <h3 className="text-base font-bold text-white">Procedimiento Operativo Estandarizado (SOP 1 al 6)</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-white block">Paso 1: Recepción y Verificación de Insumos</span>
                  <p className="text-slate-300 mt-0.5">
                    Consultar la OP en el módulo de Órdenes. Si el sistema arroja alerta roja de incompatibilidad, retener el lote y solicitar cambio de formulación.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-white block">Paso 2: Tiempo de Reposo / Oxidación</span>
                  <p className="text-slate-300 mt-0.5">
                    Validar que los pliegos impresos hayan reposado en bandejas aireadas el tiempo mínimo técnico (ej. 24h para tintas vegetales). Nunca procesar pliegos con tinta fresca.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-white block">Paso 3: Configuración de Parámetros en Línea</span>
                  <p className="text-slate-300 mt-0.5">
                    Ajustar la velocidad de banda en 25 - 35 m/min y lámparas UV en 280 - 320 Watts/pulgada. Comprobar que la temperatura superficial del cartón no supere los 48°C.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-white block">Paso 4: Parada Gate-Review (Cinta 3M)</span>
                  <p className="text-slate-300 mt-0.5">
                    Pasar 1 a 3 pliegos piloto. Esperar 30 segundos de enfriamiento y ejecutar la prueba de corte en cuadrícula con cinta 3M 610. Solo continuar si el anclaje es del 100% (Clase 5B).
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-white block">Paso 5: Liberación y Tiraje Masivo</span>
                  <p className="text-slate-300 mt-0.5">
                    Firma digital de Jefe de Producción y Operario. Iniciar tiraje continuo manteniendo monitoreo radiométrico cada 1.000 pliegos.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="font-bold text-white block">Paso 6: Control de Calidad Final y Empaque</span>
                  <p className="text-slate-300 mt-0.5">
                    Verificar ausencia de pegado entre pliegos (bloqueo) y enviar a área de troquelado o empaque final con vale de conformidad.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'adhesion' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Capítulo 4</span>
                <h3 className="text-base font-bold text-white">Protocolo de Prueba de Adherencia (Cross-Hatch / Cinta 3M)</h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="font-bold text-indigo-300 block">Norma de Referencia: ASTM D3359 / ISO 2409</span>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    <strong>Preparación del Pliego:</strong> Tomar el pliego piloto recién salido del túnel UV tras 30-60 segundos de aclimatación.
                  </li>
                  <li>
                    <strong>Corte en Enrejado (Cross-Hatch):</strong> Con cuchilla de corte en celosía de 6 filos (separación 1mm o 2mm según espesor), realizar 6 incisiones paralelas cortando el film de barniz y tinta hasta llegar al cartón. Luego realizar 6 cortes perpendiculares a 90°.
                  </li>
                  <li>
                    <strong>Aplicación de la Cinta 3M 610:</strong> Adherir cinta adhesiva industrial 3M 610 de 25mm de ancho sobre la cuadrícula. Frotar firmemente con el dedo o borrador de caucho durante 5 segundos para asegurar contacto íntimo sin burbujas.
                  </li>
                  <li>
                    <strong>Desprendimiento Rápido:</strong> En un lapso de 90 segundos tras la aplicación, sujetar el extremo libre y desprender la cinta en un ángulo de 90° con un tirón rápido y uniforme.
                  </li>
                  <li>
                    <strong>Evaluación de Cuadrículas:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-300">
                      <li><strong className="text-emerald-400">Clase 5B (100% anclaje):</strong> Bordes de los cortes completamente lisos; ninguno de los cuadros de la celosía se desprende. <span className="text-emerald-400 font-bold">ÚNICO ESTADO ACEPTABLE</span>.</li>
                      <li><strong className="text-amber-400">Clase 4B (95% anclaje):</strong> Pequeñas esquirlas de barniz desprendidas en intersecciones (&lt;5%). <span className="text-amber-400 font-bold">RECALIBRACIÓN REQUERIDA</span>.</li>
                      <li><strong className="text-red-400">Clase 0B a 3B (&lt;85%):</strong> Descamación extensa o desprendimiento total en bandas. <span className="text-red-400 font-bold">RECHAZO INMEDIATO</span>.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeSection === 'contingencies' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Capítulo 5</span>
                <h3 className="text-base font-bold text-white">Matriz de Contingencias: "¿Qué hago si no cumplo?"</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-700 divide-y divide-slate-700">
                  <thead className="bg-slate-800 text-slate-300 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-2.5">Actividad / Variable</th>
                      <th className="p-2.5">Falla Detectada</th>
                      <th className="p-2.5">Acción Inmediata Obligatoria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-2.5 font-bold text-white">1. Insumos</td>
                      <td className="p-2.5 text-red-300">Incompatibilidad de siliconas o ceras en tinta</td>
                      <td className="p-2.5">Retener el proceso y solicitar cambio de formulación con el proveedor o aplicar Barniz UV de adhesión reforzada.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">2. Oxidación</td>
                      <td className="p-2.5 text-amber-300">Pliegos frescos sin reposo previo</td>
                      <td className="p-2.5">Reposicionar el material en zona de cuarentena hasta completar el ciclo de oxidación de 18-24 horas.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">3. Curado UV</td>
                      <td className="p-2.5 text-amber-300">Baja intensidad radiométrica o velocidad excesiva</td>
                      <td className="p-2.5">Detener la máquina, reducir velocidad de banda a 25-28 m/min o solicitar mantenimiento/limpieza de reflectores.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">4. Adherencia</td>
                      <td className="p-2.5 text-red-300">Desprendimiento parcial o total de la película</td>
                      <td className="p-2.5">Detener el tiraje de inmediato, ajustar la intensidad UV a 320 W/in, recalibrar y segregar el lote defectuoso como merma.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'safety' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Capítulo 6</span>
                <h3 className="text-base font-bold text-white">Seguridad y Salud en el Trabajo (ISO 45001 & ISO 14001)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <span className="font-bold text-amber-400 block">Protección Radiación UV (Lámparas Mercurio/LED)</span>
                  <p className="text-slate-300">
                    Uso obligatorio de gafas con filtro UV400 certificado y careta de protección al abrir cortinas del horno para inspección visual. Jamás mirar directamente el arco de mercurio.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <span className="font-bold text-cyan-400 block">Extracción de Ozono (O3) y Vapores de Monómeros</span>
                  <p className="text-slate-300">
                    Verificar que la campana de extracción de tiro forzado esté encendida antes de iniciar las lámparas. Nivel de ozono en nave debe ser menor a 0.05 ppm.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <span className="font-bold text-emerald-400 block">EPP para Manipulación de Químicos</span>
                  <p className="text-slate-300">
                    Guantes de nitrilo libres de polvo para carga de barniz UV y limpieza de rodillos anilox. Lavar con abundante agua ante salpicaduras.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <span className="font-bold text-indigo-400 block">Gestión de Residuos Peligrosos (RESPEL)</span>
                  <p className="text-slate-300">
                    Disponer mermas barnizadas, paños impregnados y envases vacíos en canecas rojas según el Plan de Gestión Integral de Residuos de la planta.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Capítulo 7</span>
                <h3 className="text-base font-bold text-white">Instalación, Desinstalación y Salvaguarda de Datos</h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Botón de Instalar Aplicación de Planta</span>
                    <p className="text-slate-300 mt-0.5">
                      Instala SIGE-UV directamente en la pantalla táctil de la barnizadora o computador de supervisión para trabajar sin conexión Wi-Fi.
                    </p>
                  </div>
                  <button
                    onClick={onOpenInstall}
                    className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition"
                  >
                    Abrir Menú de Instalación
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Salvaguarda de Datos y Checksum SHA-256</span>
                    <p className="text-slate-300 mt-0.5">
                      Genera un respaldo cifrado en formato JSON y una copia de seguridad en CSV para auditorías de calidad y prevención de pérdida de registros.
                    </p>
                  </div>
                  <button
                    onClick={onOpenBackup}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shrink-0 transition"
                  >
                    Centro de Salvaguarda
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xs">
                  <span className="font-bold text-red-300 block mb-1">Desinstalación y Limpieza de Estación</span>
                  <p>
                    Para desinstalar o desvincular la estación de trabajo, pulsa el botón <strong>Desinstalar</strong> situado en la barra superior. Esto purgará los Service Workers y las cachés locales de forma segura, con opción de conservar o vaciar la base de datos local.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
