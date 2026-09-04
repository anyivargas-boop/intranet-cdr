import React from 'react';

import {
  Building2,
  BookOpen,
  FileText,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import {
  FormatoDocumento,
  Comunicado,
} from '../types';

interface DashboardViewProps {
  formatos: FormatoDocumento[];
  comunicados: Comunicado[];
  isAdmin: boolean;

  onNavigate: (
    tab: string
  ) => void;

  onOpenAddDocumentModal: () => void;

  onOpenAddComunicadoModal: () => void;

  onOpenComunicadoDetail: (
    comunicado: Comunicado
  ) => void;
}

export const DashboardView: React.FC<
  DashboardViewProps
> = ({
  formatos,
  comunicados,
  onNavigate,
  onOpenComunicadoDetail,
}) => {
  const documentosActivos =
    formatos.length;

  const comunicadosActivos =
    comunicados.length;

  const ultimosComunicados =
    comunicados.slice(
      0,
      4
    );

  const cards = [
    {
      id: 'institucional',
      title:
        'Documentación Institucional',
      badge:
        'INSTITUCIONAL',
      description:
        'Consulta los documentos legales y corporativos oficiales de Consejo de Redacción.',
      detail:
        'Certificados • RUT • Cámara de Comercio • Documentación corporativa',
      action:
        'Abrir Documentación',
      icon:
        Building2,
      wrapper:
        'border-sky-200',
      iconWrapper:
        'bg-sky-50 text-sky-700 border-sky-100',
      badgeClass:
        'bg-sky-50 text-sky-700 border-sky-200',
      actionClass:
        'text-sky-700',
      actionIconClass:
        'bg-sky-50 text-sky-700',
    },
    {
      id: 'reglamentos',
      title:
        'Reglamentos y Políticas',
      badge:
        'NORMATIVA',
      description:
        'Consulta políticas, reglamentos, manuales y lineamientos internos vigentes.',
      detail:
        'Políticas • Reglamentos • Manuales • Lineamientos',
      action:
        'Consultar Reglamentos',
      icon:
        BookOpen,
      wrapper:
        'border-emerald-200',
      iconWrapper:
        'bg-emerald-50 text-emerald-700 border-emerald-100',
      badgeClass:
        'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionClass:
        'text-emerald-700',
      actionIconClass:
        'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'documentos',
      title:
        'Formatos y Plantillas',
      badge:
        'FORMATOS',
      description:
        'Accede a los formatos, plantillas y documentos de trabajo disponibles para el equipo.',
      detail:
        'Formatos • Plantillas • Solicitudes • Documentos de trabajo',
      action:
        'Descargar Formatos',
      icon:
        FileText,
      wrapper:
        'border-amber-300',
      iconWrapper:
        'bg-amber-50 text-amber-700 border-amber-100',
      badgeClass:
        'bg-amber-50 text-amber-800 border-amber-200',
      actionClass:
        'text-amber-800',
      actionIconClass:
        'bg-amber-50 text-amber-700',
    },
    {
      id: 'comunicados',
      title:
        'Comunicados Oficiales',
      badge:
        'BOLETÍN',
      description:
        'Anuncios oficiales, novedades del equipo, circulares y comunicaciones internas.',
      detail:
        'Novedades • Circulares • Anuncios • Bienestar',
      action:
        `Ver ${comunicadosActivos} ${
          comunicadosActivos ===
          1
            ? 'Comunicado'
            : 'Comunicados'
        }`,
      icon:
        Bell,
      wrapper:
        'border-purple-200',
      iconWrapper:
        'bg-purple-50 text-purple-700 border-purple-100',
      badgeClass:
        'bg-purple-50 text-purple-700 border-purple-200',
      actionClass:
        'text-purple-700',
      actionIconClass:
        'bg-purple-50 text-purple-700',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-10">

      {/* ===================================================== */}
      {/* BIENVENIDA */}
      {/* ===================================================== */}

      <section className="bg-gradient-to-br from-white via-white to-amber-50 rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">

        <div className="max-w-5xl">

          <div className="inline-flex items-center gap-2 bg-[#234156] text-[#f3a828] rounded-full px-4 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">

            <Sparkles className="w-4 h-4" />

            Plataforma interna CdR • Edición 2026

          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#234156] mt-6 leading-tight">

            Bienvenido al Portal de{' '}

            <span className="text-orange-600">
              Consejo de Redacción
            </span>

          </h1>

          <p className="text-sm md:text-lg text-slate-600 mt-5 max-w-4xl leading-relaxed font-medium">

            Centro de documentación y gestión administrativa.
            Consulta documentación institucional, formatos,
            políticas, reglamentos y comunicados de CdR.

          </p>

          {/* CONTADORES - SIN EVENTOS */}

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-7">

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />

              <span className="text-sm font-bold text-slate-700">
                {documentosActivos} Documentos Activos
              </span>

            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">

              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />

              <span className="text-sm font-bold text-slate-700">
                {comunicadosActivos} Comunicados
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* ÚLTIMAS NOVEDADES */}
      {/* ===================================================== */}

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-7">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <Bell className="w-5 h-5 text-[#234156]" />

            <h2 className="text-base md:text-lg font-extrabold uppercase tracking-wide text-[#234156]">
              Últimas novedades y anuncios
            </h2>

          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate(
                'comunicados'
              )
            }
            className="flex items-center gap-2 text-xs font-extrabold text-[#234156] hover:text-orange-600"
          >
            Ver todos los comunicados

            <ArrowRight className="w-4 h-4" />
          </button>

        </div>


        {ultimosComunicados.length ===
        0 ? (

          <div className="py-10 text-center">

            <Bell className="w-9 h-9 text-slate-300 mx-auto mb-3" />

            <p className="text-sm font-bold text-slate-600">
              No hay comunicados publicados
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">

            {ultimosComunicados.map(
              (
                comunicado
              ) => (

                <button
                  key={
                    comunicado.id
                  }
                  type="button"
                  onClick={() =>
                    onOpenComunicadoDetail(
                      comunicado
                    )
                  }
                  className="text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#234156]/30 rounded-2xl p-5 transition-all"
                >

                  <div className="flex items-start justify-between gap-3">

                    <span className="inline-flex bg-amber-50 border border-amber-200 text-[#234156] rounded-md px-2.5 py-1 text-[9px] font-black uppercase tracking-wider">
                      {
                        comunicado.category
                      }
                    </span>

                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                      {
                        comunicado.date
                      }
                    </span>

                  </div>

                  <h3 className="text-sm md:text-base font-extrabold text-slate-900 mt-4 leading-snug">
                    {
                      comunicado.title
                    }
                  </h3>

                  {comunicado.summary && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                      {
                        comunicado.summary
                      }
                    </p>
                  )}

                </button>

              )
            )}

          </div>

        )}

      </section>


      {/* ===================================================== */}
      {/* ACCESOS RÁPIDOS */}
      {/* ===================================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-lg md:text-xl font-extrabold text-[#234156]">
            Accesos rápidos
          </h2>

          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Consulta rápidamente las principales secciones de la intranet.
          </p>

        </div>


        {/* IMPORTANTE: SOLO 4 MÓDULOS. NO HAY AGENDA */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {cards.map(
            (
              card
            ) => {
              const Icon =
                card.icon;

              return (
                <button
                  key={
                    card.id
                  }
                  type="button"
                  onClick={() =>
                    onNavigate(
                      card.id
                    )
                  }
                  className={`text-left bg-white rounded-3xl border-2 ${card.wrapper} p-6 md:p-7 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[310px]`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.iconWrapper}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-wider ${card.badgeClass}`}
                    >
                      {
                        card.badge
                      }
                    </span>

                  </div>


                  <h3 className="text-xl md:text-2xl font-black text-[#234156] mt-7">
                    {
                      card.title
                    }
                  </h3>


                  <div className={`mt-5 rounded-xl border px-4 py-3 ${card.badgeClass}`}>

                    <p className="text-xs font-extrabold">
                      {
                        card.detail
                      }
                    </p>

                  </div>


                  <p className="text-sm text-slate-600 mt-5 leading-relaxed">
                    {
                      card.description
                    }
                  </p>


                  <div className="mt-auto pt-6">

                    <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-4">

                      <span
                        className={`text-sm font-extrabold ${card.actionClass}`}
                      >
                        {
                          card.action
                        }
                      </span>

                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${card.actionIconClass}`}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </span>

                    </div>

                  </div>

                </button>
              );
            }
          )}

        </div>

      </section>

    </div>
  );
};