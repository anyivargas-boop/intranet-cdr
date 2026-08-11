import React from 'react';
import { FormatoDocumento, Comunicado, EventoAgenda, DriveFolder } from '../types';
import { 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  FileSpreadsheet, 
  Megaphone, 
  Calendar, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Clock, 
  ExternalLink,
  Scale,
  FolderGit2,
  Bell
} from 'lucide-react';
import { DriveIcon } from './DriveIcon';

interface DashboardViewProps {
  formatos: FormatoDocumento[];
  comunicados: Comunicado[];
  eventos: EventoAgenda[];
  driveFolders: DriveFolder[];
  isAdmin: boolean;
  onNavigate: (tab: string) => void;
  onOpenAddDocumentModal: () => void;
  onOpenAddComunicadoModal: () => void;
  onOpenAddEventModal: () => void;
  onOpenComunicadoDetail: (comunicado: Comunicado) => void;
  onOpenDriveModal: (folderUrl: string, folderName: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  formatos,
  comunicados,
  eventos,
  driveFolders,
  isAdmin,
  onNavigate,
  onOpenAddDocumentModal,
  onOpenAddComunicadoModal,
  onOpenAddEventModal,
  onOpenComunicadoDetail,
  onOpenDriveModal,
}) => {
  const latestComunicados = comunicados.slice(0, 2);

  return (
    <div className="w-full flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      
      {/* 1. PORTADA HERO LUMINOSA Y CLARA */}
      <section className="relative overflow-hidden rounded-3xl bg-white text-slate-900 p-8 md:p-10 border border-slate-200 shadow-sm">
        {/* Decorative light gradient subtle background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-50/60 via-sky-50/40 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#234156] text-[#f3a828] font-black text-[11px] uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#f3a828]" />
              <span>Plataforma Interna CdR &bull; Edición 2026</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#234156] tracking-tight leading-tight">
              Bienvenido al Portal de <span className="text-amber-600">Consejo de Redacción</span>
            </h1>
            
            <p className="text-slate-600 text-xs md:text-sm mt-2.5 leading-relaxed max-w-2xl font-medium">
              Centro de documentación y gestión administrativa. Seleccione la tarjeta del módulo que desea consultar para acceder a formatos de viáticos, estatutos, reglamentos y comunicados oficiales.
            </p>

            {/* Status indicators */}
            <div className="flex flex-wrap items-center gap-3 mt-5 text-xs text-slate-700 font-semibold">
              <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {formatos.length} Documentos Activos
              </span>
              <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {comunicados.length} Comunicados
              </span>
              <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <DriveIcon className="w-3.5 h-3.5 text-[#234156]" />
                Google Drive Conectado
              </span>
            </div>
          </div>

          {/* Admin Control Bar if logged in */}
          {isAdmin && (
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-300 flex flex-col gap-2 shrink-0 w-full md:w-auto shadow-xs">
              <span className="text-[10px] font-extrabold uppercase text-[#234156] tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Panel de Administración
              </span>
              <div className="flex flex-wrap md:flex-col gap-2">
                <button
                  onClick={onOpenAddDocumentModal}
                  className="bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#f3a828]" /> Cargar Formato
                </button>
                <button
                  onClick={onOpenAddComunicadoModal}
                  className="bg-white hover:bg-slate-100 text-[#234156] font-extrabold text-xs px-3.5 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#234156]" /> Publicar Comunicado
                </button>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* 2. ÚLTIMAS NOVEDADES Y ANUNCIOS */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#234156]" />
            <h3 className="text-sm font-extrabold text-[#234156] uppercase tracking-wider">
              Últimas Novedades y Anuncios
            </h3>
          </div>
          <button
            onClick={() => onNavigate('comunicados')}
            className="text-xs text-[#234156] font-bold hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            Ver todos los comunicados &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestComunicados.map((com) => (
            <div
              key={com.id}
              onClick={() => onOpenComunicadoDetail(com)}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#234156] hover:bg-white transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold text-[#234156] uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    {com.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {com.date}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#234156] transition-colors line-clamp-1">
                  {com.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {com.summary}
                </p>
              </div>
              <span className="text-[11px] text-[#234156] font-bold mt-3 pt-2 border-t border-slate-200/60 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Leer comunicado completo &rarr;
              </span>
            </div>
          ))}
        </div>
      </section>


      {/* 3. MÓDULOS PRINCIPALES DE CONSULTA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#234156] tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#f3a828] rounded-full"></span>
            Módulos Principales de Consulta
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            Haga clic en una tarjeta para ir a la sección correspondiente
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CARD 1: DOCUMENTOS INSTITUCIONALES */}
          <div
            onClick={() => onNavigate('documentos')}
            className="group relative rounded-3xl bg-white text-slate-900 p-6 border-2 border-sky-100 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center text-2xl group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-sky-50 text-sky-800 px-3 py-1 rounded-full border border-sky-200">
                  Institucional
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#234156] group-hover:text-sky-700 transition-colors">
                Documentos Institucionales
              </h3>

              <div className="my-3 text-[11px] font-bold text-sky-900 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200/80 inline-block">
                RUT &bull; Estatutos &bull; Certificados &bull; Cámara de Comercio
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                Documentos legales corporativos, RUT actualizado 2026, certificación bancaria, cámara de comercio y personería jurídica CdR.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-sky-700 group-hover:text-sky-900 transition-colors">
              <span>Abrir Documentos Oficiales</span>
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>


          {/* CARD 2: POLÍTICAS Y REGLAMENTOS */}
          <div
            onClick={() => onNavigate('reglamentos')}
            className="group relative rounded-3xl bg-white text-slate-900 p-6 border-2 border-emerald-100 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  Políticas CdR
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#234156] group-hover:text-emerald-700 transition-colors">
                Políticas y Reglamentos
              </h3>

              <div className="my-3 text-[11px] font-bold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 inline-block">
                Reglamento Interno &bull; Compras &bull; Viáticos &bull; Ética
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                Reglamento interno de trabajo, política de viajes, normas de viáticos, compras, contrataciones y código de ética.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-700 group-hover:text-emerald-900 transition-colors">
              <span>Consultar Reglamentos</span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>


          {/* CARD 3: FORMATOS Y PLANTILLAS */}
          <div
            onClick={() => onNavigate('documentos')}
            className="group relative rounded-3xl bg-white text-slate-900 p-6 border-2 border-amber-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-2xl group-hover:bg-[#234156] group-hover:text-[#f3a828] transition-all shadow-xs">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                  Formatos
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#234156] group-hover:text-amber-800 transition-colors">
                Formatos y Plantillas
              </h3>

              <div className="my-3 text-[11px] font-bold text-amber-950 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 inline-block">
                Vacaciones &bull; Viáticos &bull; Compras &bull; Legalizaciones
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                Plantillas editables en Excel y Word para solicitar viáticos, legalizar gastos, pedir vacaciones y presupuestar proyectos.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-amber-800 group-hover:text-amber-950 transition-colors">
              <span>Descargar Formatos</span>
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-[#234156] group-hover:text-[#f3a828] group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>


          {/* CARD 4: COMUNICADOS OFICIALES */}
          <div
            onClick={() => onNavigate('comunicados')}
            className="group relative rounded-3xl bg-white text-slate-900 p-6 border-2 border-purple-100 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center text-2xl group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs">
                  <Megaphone className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                  Boletín
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#234156] group-hover:text-purple-700 transition-colors">
                Comunicados Oficiales
              </h3>

              <div className="my-3 text-[11px] font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200/80 inline-block">
                Novedades &bull; Circulares &bull; Anuncios &bull; Bienestar
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                Anuncios oficiales de Dirección Ejecutiva, novedades de equipo, festivos, beneficios de bienestar y circulares.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-purple-700 group-hover:text-purple-900 transition-colors">
              <span>Ver {comunicados.length} Comunicados</span>
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>


          {/* CARD 5: AGENDA Y EVENTOS CdR */}
          <div
            onClick={() => onNavigate('agenda')}
            className="group relative rounded-3xl bg-white text-slate-900 p-6 border-2 border-teal-100 hover:border-teal-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center text-2xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200">
                  Agenda
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#234156] group-hover:text-teal-700 transition-colors">
                Agenda & Eventos CdR
              </h3>

              <div className="my-3 text-[11px] font-bold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200/80 inline-block">
                Talleres &bull; Capacitaciones &bull; Comités &bull; Calendario
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                Programación de capacitaciones internas, talleres periodísticos, comités editoriales y asambleas.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-teal-700 group-hover:text-teal-900 transition-colors">
              <span>Abrir Agenda</span>
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>


          {/* CARD 6: GOOGLE DRIVE CENTRAL */}
          <div
            onClick={() => onNavigate('drive')}
            className="group relative rounded-3xl bg-white text-slate-900 p-6 border-2 border-slate-200 hover:border-[#234156] shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[250px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#234156] border border-slate-200 flex items-center justify-center text-2xl group-hover:bg-[#234156] group-hover:text-[#f3a828] transition-all shadow-xs">
                  <DriveIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
                  Google Workspace
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#234156] group-hover:text-slate-900 transition-colors">
                Google Drive & Sync
              </h3>

              <div className="my-3 text-[11px] font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 inline-block">
                Carpetas Compartidas &bull; Nube CdR &bull; Directo
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                Acceso directo e integración a las carpetas compartidas de Google Drive institucional del Consejo de Redacción.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#234156] group-hover:text-slate-950 transition-colors">
              <span>Explorar Carpetas</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#234156] group-hover:text-[#f3a828] group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};