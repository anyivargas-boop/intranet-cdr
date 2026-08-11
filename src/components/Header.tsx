import React from 'react';
import {
  FileText,
  Bell,
  BookOpen,
  Calendar,
  LayoutDashboard,
  Building2,
  ShieldCheck,
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
  unreadCount = 2,
  isAdmin,
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

  const visibleNavItems = isAdmin
    ? [
        ...navItems,
        {
          id: 'admin',
          label: 'Panel Administrativo',
          icon: ShieldCheck,
        },
      ]
    : navItems;

  return (
    <header className="bg-[#234156] border-b-4 border-[#f3a828] shadow-sm">

      {/* BARRA SUPERIOR */}
      <div className="bg-[#182c3b] text-slate-200 text-[10px] font-semibold px-6 lg:px-10 py-1.5 flex items-center justify-between">

        <span>
          <span className="text-[#f3a828]">
            ●
          </span>{' '}
          Intranet Oficial • Consejo de Redacción
        </span>

        <div className="flex items-center gap-3">

          {isAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1 bg-[#f3a828]/15 text-[#f3a828] border border-[#f3a828]/30 px-2 py-0.5 rounded-md font-bold">
              <ShieldCheck className="w-3 h-3" />
              Administrador
            </span>
          )}

          <span>
            Bogotá, Colombia
          </span>

        </div>

      </div>


      {/* NAVEGACIÓN PRINCIPAL */}
      <div className="min-h-16 px-6 lg:px-10 py-2 flex items-center justify-between gap-6">

        {/* LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() =>
            setActiveTab('inicio')
          }
        >

          <div className="w-10 h-10 bg-[#f3a828] text-slate-950 font-black flex items-center justify-center rounded-xl shadow-sm text-xl border border-amber-300">
            CdR
          </div>

          <div>

            <h1 className="text-lg font-extrabold tracking-tight text-white leading-none">
              Consejo de Redacción
            </h1>

            <span className="text-[10px] font-bold text-[#f3a828] uppercase tracking-wider block mt-0.5">
              Gestión Interna & Documentación
            </span>

          </div>

        </div>


        {/* MENÚ ESCRITORIO */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-200">

          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id;

            const isAdminButton =
              item.id === 'admin';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setActiveTab(item.id)
                }
                className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'bg-[#182c3b] text-[#f3a828] font-bold border border-[#f3a828]/40 shadow-inner'
                    : isAdminButton
                    ? 'bg-[#f3a828] text-slate-950 font-extrabold border border-amber-300 hover:bg-[#e0951a]'
                    : 'hover:bg-[#1a3243] hover:text-white'
                }`}
              >

                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-[#f3a828]'
                      : isAdminButton
                      ? 'text-slate-950'
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


        {/* MENÚ MÓVIL */}
        <div className="lg:hidden flex items-center">

          <select
            value={activeTab}
            onChange={(e) =>
              setActiveTab(e.target.value)
            }
            className="bg-[#182c3b] text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-[#f3a828]/40 focus:outline-none"
          >

            {visibleNavItems.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.label}
              </option>
            ))}

          </select>

        </div>

      </div>

    </header>
  );
};