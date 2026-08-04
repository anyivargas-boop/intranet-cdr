import React from 'react';
import { Calendar, ShieldCheck, Lock } from 'lucide-react';
import { DriveIcon } from './DriveIcon';

interface FooterProps {
  isAdmin: boolean;
  setIsAdmin: (status: boolean) => void;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  isAdmin, 
  setIsAdmin, 
  onOpenAdminModal 
}) => {
  return (
    <footer className="py-2.5 bg-[#234156] text-white flex flex-wrap items-center justify-between px-6 lg:px-10 shrink-0 text-xs font-semibold border-t-2 border-[#f3a828] sticky bottom-0 z-20 shadow-lg gap-3">
      <p className="text-[11px] text-slate-300">
        © 2026 Consejo de Redacción (CdR) &bull; Intranet Corporativa v2.1
      </p>
      
      <div className="flex items-center gap-4 text-[11px]">
        <span className="hidden md:flex items-center gap-1.5 text-slate-300">
          <DriveIcon className="w-3.5 h-3.5 text-[#f3a828]" />
          Google Drive: <span className="text-amber-300 font-bold">Sincronizado</span>
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-[#f3a828]" />
          Calendar: <span className="text-amber-300 font-bold">Conectado</span>
        </span>

        {/* Administrator Access Button in Footer */}
        {isAdmin ? (
          <div className="flex items-center gap-2 bg-[#f3a828] text-slate-950 px-3 py-1 rounded-lg text-xs font-extrabold border border-amber-300 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
            <span>Modo Administrador</span>
            <button
              onClick={() => setIsAdmin(false)}
              className="ml-1 text-slate-950 hover:text-red-700 text-[10px] underline font-black"
              title="Cerrar modo administrador"
            >
              Salir
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAdminModal}
            className="flex items-center gap-1.5 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-3.5 py-1 rounded-lg text-xs font-extrabold transition-all shadow-sm border border-amber-300 cursor-pointer"
            title="Ingresar como administrador para publicar y editar formatos o comunicados"
          >
            <Lock className="w-3.5 h-3.5 text-slate-950" />
            <span>Ingresar como Administrador</span>
          </button>
        )}
      </div>
    </footer>
  );
};


