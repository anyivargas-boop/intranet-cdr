import React from 'react';
import { 
  FileText, 
  Bell, 
  BookOpen, 
  Calendar, 
  LayoutInicio
} from 'lucide-react';
import { DriveIcon } from './DriveIcon';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadCount = 2,
}) => {
  const navItems = [
    { id: 'inicio', label: 'inicio', icon: Layoutinicio },
    { id: 'documentos', label: 'Formatos y Documentación', icon: FileText },
    { id: 'comunicados', label: 'Comunicados', icon: Bell, badge: unreadCount },
    { id: 'reglamentos', label: 'Reglamentos', icon: BookOpen },
    { id: 'agenda', label: 'Agenda CdR', icon: Calendar },
    { id: 'drive', label: 'Google Drive & Sync', icon: DriveIcon },
  ];

  return (
    <header className="bg-[#234156] border-b-4 border-[#f3a828] text-white shadow-md shrink-0 sticky top-0 z-30">
      {/* Top Banner Accent Line */}
      <div className="bg-[#1a3040] text-[11px] py-1 px-6 lg:px-10 flex justify-between items-center text-slate-300 font-medium border-b border-slate-700/50">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f3a828]"></span>
          Intranet Oficial &bull; <strong className="text-white">Consejo de Redacción</strong>
        </span>
        <div className="hidden sm:flex items-center gap-4 text-slate-300 font-medium">
          <span>Bogotá, Colombia</span>
        </div>
      </div>

      <div className="h-16 px-6 lg:px-10 flex items-center justify-between gap-6">
        {/* Brand Identity */}
        <div 
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => setActiveTab('inicio')}
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

        {/* Main Navigation Links */}
        <nav className="hidden lg:flex items-center gap-3 text-xs font-semibold text-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition-all relative ${
                  isActive
                    ? 'bg-[#182c3b] text-[#f3a828] font-bold border border-[#f3a828]/40 shadow-inner'
                    : 'hover:bg-[#1a3243] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#f3a828]' : 'text-slate-300'}`} />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="bg-[#f3a828] text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Nav Select Fallback */}
        <div className="lg:hidden flex items-center">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-[#182c3b] text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-[#f3a828]/40 focus:outline-none"
          >
            {navItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};


