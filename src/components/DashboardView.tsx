import React from 'react';

import {
  FormatoDocumento,
  Comunicado,
  EventoAgenda,
} from '../types';

import {
  ShieldCheck,
  FileSpreadsheet,
  Megaphone,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
  Plus,
  Bell,
} from 'lucide-react';

interface DashboardViewProps {
  formatos: FormatoDocumento[];
  comunicados: Comunicado[];
  eventos: EventoAgenda[];
  isAdmin: boolean;

  onNavigate: (
    tab: string
  ) => void;

  onOpenAddDocumentModal:
    () => void;

  onOpenAddComunicadoModal:
    () => void;

  onOpenAddEventModal:
    () => void;

  onOpenComunicadoDetail: (
    comunicado: Comunicado
  ) => void;
}

export const DashboardView:
  React.FC<DashboardViewProps> = ({
    formatos,
    comunicados,
    eventos,
    isAdmin,
    onNavigate,
    onOpenAddDocumentModal,
    onOpenAddComunicadoModal,
    onOpenComunicadoDetail,
  }) => {

  const latestComunicados =
    comunicados.slice(
      0,
      2
    );

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 sm:pb-12 space-y-6 sm:space-y-8 overflow-x-hidden">

      {/* ===================================================== */}
      {/* PORTADA */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-slate-900 p-5 sm:p-7 md:p-10 border border-slate-200 shadow-sm">

        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-amber-50/60 via-sky-50/40 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div className="w-full min-w-0 max-w-3xl">

            <div className="inline-flex max-w-full items-start sm:items-center gap-2 bg-[#234156] text-[#f3a828] font-black text-[10px] sm:text-[11px] uppercase tracking-widest px-3.5 py-2 rounded-2xl sm:rounded-full shadow-xs mb-4">

              <Sparkles className="w-3.5 h-3.5 mt-0.5 sm:mt-0 text-[#f3a828] shrink-0" />

              <span className="min-w-0 break-words leading-snug">
                Plataforma Interna CdR • Edición 2026
              </span>

            </div>


            <h1 className="text-[28px] sm:text-3xl md:text-4xl font-extrabold text-[#234156] tracking-tight leading-[1.08] break-words [overflow-wrap:anywhere]">

              Bienvenido al Portal de{' '}

              <span className="text-amber-600">
                Consejo de Redacción
              </span>

            </h1>


            <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl font-medium break-words">

              Centro de documentación y gestión administrativa.
              Consulta documentación institucional, formatos,
              políticas, reglamentos, comunicados y la agenda
              interna de CdR.

            </p>


            {/* ================================================= */}
            {/* INDICADORES */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 min-[430px]:grid-cols-2 md:flex md:flex-wrap gap-2.5 mt-6 text-xs text-slate-700 font-semibold">

              <span className="min-w-0 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />

                <span className="break-words">
                  {formatos.length} Documentos Activos
                </span>

              </span>


              <span className="min-w-0 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />

                <span className="break-words">
                  {comunicados.length} Comunicados
                </span>

              </span>


              <span className="min-w-0 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />

                <span className="break-words">
                  {eventos.length} Eventos
                </span>

              </span>

            </div>

          </div>


          {/* ================================================= */}
          {/* PANEL ADMIN */}
          {/* ================================================= */}

          {isAdmin && (
            <div className="w-full lg:w-auto bg-amber-50/90 p-4 rounded-2xl border border-amber-300 shadow-xs">

              <span className="text-[10px] font-extrabold uppercase text-[#234156] tracking-wider flex items-center gap-1.5 mb-3">

                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />

                <span className="break-words">
                  Panel de Administración
                </span>

              </span>


              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">

                <button
                  type="button"
                  onClick={
                    onOpenAddDocumentModal
                  }
                  className="w-full bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                >

                  <Plus className="w-4 h-4 text-[#f3a828] shrink-0" />

                  Cargar Documento

                </button>


                <button
                  type="button"
                  onClick={
                    onOpenAddComunicadoModal
                  }
                  className="w-full bg-white hover:bg-slate-100 text-[#234156] font-extrabold text-xs px-4 py-3 rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition-all shadow-xs"
                >

                  <Plus className="w-4 h-4 text-[#234156] shrink-0" />

                  Publicar Comunicado

                </button>

              </div>

            </div>
          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOVEDADES */}
      {/* ===================================================== */}

      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">

          <div className="flex items-start sm:items-center gap-2 min-w-0">

            <Bell className="w-4 h-4 text-[#234156] mt-1 sm:mt-0 shrink-0" />

            <h3 className="text-sm font-extrabold text-[#234156] uppercase tracking-wider leading-snug break-words">
              Últimas Novedades y Anuncios
            </h3>

          </div>


          <button
            type="button"
            onClick={() =>
              onNavigate(
                'comunicados'
              )
            }
            className="self-start sm:self-auto text-xs text-[#234156] font-bold hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            Ver todos los comunicados
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>


        {latestComunicados.length ===
        0 ? (

          <div className="py-8 text-center">

            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />

            <p className="text-sm font-bold text-slate-600">
              No hay comunicados publicados.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {latestComunicados.map(
              (
                com
              ) => (

                <button
                  type="button"
                  key={
                    com.id
                  }
                  onClick={() =>
                    onOpenComunicadoDetail(
                      com
                    )
                  }
                  className="text-left min-w-0 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#234156] hover:bg-white transition-all group flex flex-col justify-between"
                >

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">

                      <span className="max-w-full text-[10px] font-extrabold text-[#234156] uppercase tracking-wider bg-amber-100 px-2 py-1 rounded border border-amber-200 break-words">
                        {
                          com.category
                        }
                      </span>

                      <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                        {
                          com.date
                        }
                      </span>

                    </div>


                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#234156] transition-colors break-words [overflow-wrap:anywhere]">
                      {
                        com.title
                      }
                    </h4>


                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {
                        com.summary
                      }
                    </p>

                  </div>


                  <span className="text-[11px] text-[#234156] font-bold mt-4 pt-3 border-t border-slate-200/60 inline-flex items-center gap-1">
                    Leer comunicado completo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                </button>

              )
            )}

          </div>

        )}

      </section>


      {/* ===================================================== */}
      {/* MÓDULOS */}
      {/* ===================================================== */}

      <section className="space-y-5">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#234156] tracking-tight flex items-start gap-3 min-w-0">

            <span className="w-2.5 h-8 bg-[#f3a828] rounded-full shrink-0 mt-1" />

            <span className="break-words">
              Módulos Principales de Consulta
            </span>

          </h2>


          <span className="text-xs sm:text-sm text-slate-500 font-semibold md:text-right leading-relaxed">
            Haga clic en una tarjeta para ir a la sección correspondiente
          </span>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* ================================================= */}
          {/* INSTITUCIONAL */}
          {/* ================================================= */}

          <ModuleCard
            title="Documentación Institucional"
            subtitle="RUT • Cámara de Comercio • Certificados • Documentos Legales"
            description="Consulta los documentos legales y corporativos oficiales de Consejo de Redacción."
            badge="Institucional"
            action="Abrir Documentación"
            color="sky"
            icon={
              <Building2 className="w-6 h-6" />
            }
            onClick={() =>
              onNavigate(
                'institucional'
              )
            }
          />


          {/* ================================================= */}
          {/* REGLAMENTOS */}
          {/* ================================================= */}

          <ModuleCard
            title="Políticas y Reglamentos"
            subtitle="Reglamento Interno • Compras • Viáticos • Ética"
            description="Reglamento interno, políticas, manuales, procedimientos y lineamientos institucionales."
            badge="Políticas CdR"
            action="Consultar Reglamentos"
            color="emerald"
            icon={
              <ShieldCheck className="w-6 h-6" />
            }
            onClick={() =>
              onNavigate(
                'reglamentos'
              )
            }
          />


          {/* ================================================= */}
          {/* FORMATOS */}
          {/* ================================================= */}

          <ModuleCard
            title="Formatos y Plantillas"
            subtitle="Vacaciones • Viáticos • Compras • Legalizaciones"
            description="Formatos y plantillas de trabajo para solicitudes, legalizaciones y procesos administrativos."
            badge="Formatos"
            action="Descargar Formatos"
            color="amber"
            icon={
              <FileSpreadsheet className="w-6 h-6" />
            }
            onClick={() =>
              onNavigate(
                'documentos'
              )
            }
          />


          {/* ================================================= */}
          {/* COMUNICADOS */}
          {/* ================================================= */}

          <ModuleCard
            title="Comunicados Oficiales"
            subtitle="Novedades • Circulares • Anuncios • Bienestar"
            description="Anuncios oficiales, novedades del equipo, circulares y comunicaciones internas."
            badge="Boletín"
            action={`Ver ${comunicados.length} Comunicados`}
            color="purple"
            icon={
              <Megaphone className="w-6 h-6" />
            }
            onClick={() =>
              onNavigate(
                'comunicados'
              )
            }
          />


          {/* ================================================= */}
          {/* AGENDA */}
          {/* ================================================= */}

          <ModuleCard
            title="Agenda & Eventos CdR"
            subtitle="Talleres • Capacitaciones • Comités • Calendario"
            description="Programación de capacitaciones, talleres, reuniones, comités y eventos internos."
            badge="Agenda"
            action="Abrir Agenda"
            color="teal"
            icon={
              <Calendar className="w-6 h-6" />
            }
            onClick={() =>
              onNavigate(
                'agenda'
              )
            }
          />

        </div>

      </section>

    </div>
  );
};


// =========================================================
// TARJETA DE MÓDULO
// =========================================================

interface ModuleCardProps {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  action: string;

  color:
    | 'sky'
    | 'emerald'
    | 'amber'
    | 'purple'
    | 'teal';

  icon: React.ReactNode;

  onClick: () => void;
}


const ModuleCard:
  React.FC<ModuleCardProps> = ({
    title,
    subtitle,
    description,
    badge,
    action,
    color,
    icon,
    onClick,
  }) => {

  const styles = {
    sky: {
      border:
        'border-sky-100 hover:border-sky-400',

      icon:
        'bg-sky-100 text-sky-700 border-sky-200',

      badge:
        'bg-sky-50 text-sky-800 border-sky-200',

      detail:
        'text-sky-900 bg-sky-50 border-sky-200',

      action:
        'text-sky-700',

      circle:
        'bg-sky-50 text-sky-700',
    },

    emerald: {
      border:
        'border-emerald-100 hover:border-emerald-400',

      icon:
        'bg-emerald-100 text-emerald-700 border-emerald-200',

      badge:
        'bg-emerald-50 text-emerald-800 border-emerald-200',

      detail:
        'text-emerald-900 bg-emerald-50 border-emerald-200',

      action:
        'text-emerald-700',

      circle:
        'bg-emerald-50 text-emerald-700',
    },

    amber: {
      border:
        'border-amber-200 hover:border-amber-400',

      icon:
        'bg-amber-100 text-amber-800 border-amber-300',

      badge:
        'bg-amber-50 text-amber-900 border-amber-200',

      detail:
        'text-amber-950 bg-amber-50 border-amber-200',

      action:
        'text-amber-800',

      circle:
        'bg-amber-50 text-amber-800',
    },

    purple: {
      border:
        'border-purple-100 hover:border-purple-400',

      icon:
        'bg-purple-100 text-purple-700 border-purple-200',

      badge:
        'bg-purple-50 text-purple-800 border-purple-200',

      detail:
        'text-purple-900 bg-purple-50 border-purple-200',

      action:
        'text-purple-700',

      circle:
        'bg-purple-50 text-purple-700',
    },

    teal: {
      border:
        'border-teal-100 hover:border-teal-400',

      icon:
        'bg-teal-100 text-teal-700 border-teal-200',

      badge:
        'bg-teal-50 text-teal-800 border-teal-200',

      detail:
        'text-teal-900 bg-teal-50 border-teal-200',

      action:
        'text-teal-700',

      circle:
        'bg-teal-50 text-teal-700',
    },
  };

  const current =
    styles[color];

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        group
        text-left
        w-full
        min-w-0
        rounded-2xl
        sm:rounded-3xl
        bg-white
        text-slate-900
        p-5
        sm:p-6
        border-2
        ${current.border}
        shadow-sm
        hover:shadow-lg
        transition-all
        flex
        flex-col
        justify-between
        min-h-[260px]
        overflow-hidden
      `}
    >

      <div className="min-w-0">

        <div className="flex items-start justify-between gap-3 mb-5">

          <div
            className={`
              w-12
              h-12
              rounded-2xl
              border
              flex
              items-center
              justify-center
              shrink-0
              ${current.icon}
            `}
          >
            {icon}
          </div>


          <span
            className={`
              max-w-[60%]
              text-[10px]
              font-extrabold
              uppercase
              tracking-wider
              px-3
              py-1
              rounded-full
              border
              text-center
              break-words
              ${current.badge}
            `}
          >
            {badge}
          </span>

        </div>


        <h3 className="text-xl sm:text-2xl font-extrabold text-[#234156] leading-tight break-words [overflow-wrap:anywhere]">
          {title}
        </h3>


        <div
          className={`
            my-4
            text-[11px]
            sm:text-xs
            font-bold
            px-3
            py-2
            rounded-xl
            border
            leading-relaxed
            break-words
            [overflow-wrap:anywhere]
            ${current.detail}
          `}
        >
          {subtitle}
        </div>


        <p className="text-sm text-slate-600 leading-relaxed font-medium break-words [overflow-wrap:anywhere]">
          {description}
        </p>

      </div>


      <div
        className={`
          mt-6
          pt-4
          border-t
          border-slate-100
          flex
          items-center
          justify-between
          gap-3
          text-sm
          font-extrabold
          ${current.action}
        `}
      >

        <span className="min-w-0 break-words">
          {action}
        </span>

        <div
          className={`
            w-9
            h-9
            rounded-full
            flex
            items-center
            justify-center
            shrink-0
            transition-transform
            group-hover:translate-x-1
            ${current.circle}
          `}
        >
          <ArrowRight className="w-4 h-4" />
        </div>

      </div>

    </button>
  );
};