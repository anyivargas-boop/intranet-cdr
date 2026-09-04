import React from 'react';

import {
  FileText,
  Bell,
  BookOpen,
  Calendar,
  LayoutDashboard,
  Building2,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadCount = 0,
}) => {
  const navItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: LayoutDashboard,
    },
    {
      id: 'institucional',
      label: 'Documentación Institucional',
      icon: Building2,
    },
    {
      id: 'documentos',
      label: 'Formatos y Plantillas',
      icon: FileText,
    },
    {
      id: 'comunicados',
      label: 'Comunicados',
      icon: Bell,
      badge: unreadCount,
    },
    {
      id: 'reglamentos',
      label: 'Reglamentos',
      icon: BookOpen,
    },
    {
      id: 'agenda',
      label: 'Agenda CdR',
      icon: Calendar,
    },
  ];

  return (
    <header className="w-full bg-[#234156] border-b-4 border-[#f3a828] shadow-sm overflow-hidden">

      {/* ===================================================== */}
      {/* BARRA SUPERIOR */}
      {/* ===================================================== */}

      <div className="bg-[#182c3b] text-slate-200 font-semibold px-4 sm:px-6 lg:px-10 py-2">

        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">

          <span className="text-[9px] sm:text-[10px] min-w-0 leading-tight">
            <span className="text-[#f3a828]">●</span>{' '}
            Intranet Oficial • Consejo de Redacción
          </span>

          <span className="text-[9px] sm:text-[10px] whitespace-nowrap shrink-0">
            Bogotá, Colombia
          </span>

        </div>

      </div>


      {/* ===================================================== */}
      {/* NAVEGACIÓN PRINCIPAL */}
      {/* ===================================================== */}

      <div className="px-4 sm:px-6 lg:px-10 py-3">

        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* ================================================= */}
          {/* LOGO */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={() => setActiveTab('inicio')}
            className="w-full lg:w-auto text-left flex items-center gap-3 min-w-0"
          >

            <div className="w-12 h-12 sm:w-11 sm:h-11 bg-[#f3a828] text-slate-950 font-black flex items-center justify-center rounded-xl shadow-sm text-xl border border-amber-300 shrink-0">
              CdR
            </div>

            <div className="min-w-0">

              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight break-words">
                Consejo de Redacción
              </h1>

              <span className="text-[9px] sm:text-[10px] font-bold text-[#f3a828] uppercase tracking-wider block mt-0.5 leading-snug break-words">
                Gestión Interna &amp; Documentación
              </span>

            </div>

          </button>


          {/* ================================================= */}
          {/* MENÚ ESCRITORIO */}
          {/* ================================================= */}

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-200">

            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(item.id)
                  }
                  className={`flex items-center gap-2 py-2 px-2.5 xl:px-3 rounded-lg transition-all relative whitespace-nowrap ${
                    isActive
                      ? 'bg-[#182c3b] text-[#f3a828] font-bold border border-[#f3a828]/40 shadow-inner'
                      : 'hover:bg-[#1a3243] hover:text-white'
                  }`}
                >

                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-[#f3a828]'
                        : 'text-slate-300'
                    }`}
                  />

                  <span>
                    {item.label}
                  </span>

                  {'badge' in item &&
                    item.badge !== undefined &&
                    item.badge > 0 && (
                      <span className="bg-[#f3a828] text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}

                </button>
              );
            })}

          </nav>


          {/* ================================================= */}
          {/* MENÚ MÓVIL */}
          {/* ================================================= */}

          <div className="lg:hidden w-full">

            <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Navegación
            </label>

            <div className="relative">

              <Menu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f3a828] pointer-events-none" />

              <select
                value={
                  activeTab === 'admin'
                    ? 'inicio'
                    : activeTab
                }
                onChange={(e) =>
                  setActiveTab(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-[#182c3b]
                  text-white
                  text-sm
                  font-bold
                  py-3
                  pl-10
                  pr-10
                  rounded-xl
                  border
                  border-[#f3a828]/40
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#f3a828]/40
                  appearance-auto
                "
              >

                {navItems.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.label}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
};