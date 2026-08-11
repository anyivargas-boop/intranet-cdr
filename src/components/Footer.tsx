import React from 'react';
import {
  ShieldCheck,
  LogOut,
} from 'lucide-react';

interface FooterProps {
  isAdmin: boolean;
  setIsAdmin: (status: boolean) => void;
  onOpenAdminModal: () => void;
  onOpenAdminPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAdmin,
  setIsAdmin,
  onOpenAdminModal,
  onOpenAdminPanel,
}) => {
  return (
    <footer className="bg-[#234156] border-t-2 border-[#f3a828] px-6 lg:px-10 py-2 flex items-center justify-between gap-4 shrink-0">
      
      {/* INFORMACIÓN INSTITUCIONAL */}
      <div className="text-[11px] text-slate-300 font-medium">
        © 2026 Consejo de Redacción (CdR) • Intranet Corporativa v2.1
      </div>

      {/* ZONA ADMINISTRATIVA */}
      <div className="flex items-center gap-2">

        {isAdmin ? (
          <>
            {/* ABRIR PANEL ADMINISTRATIVO */}
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="flex items-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-sm border border-amber-300"
              title="Abrir Panel Administrativo"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Administrativo</span>
            </button>

            {/* SALIR DEL MODO ADMINISTRADOR */}
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white px-2 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
              title="Salir del modo administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onOpenAdminModal}
            className="flex items-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-sm border border-amber-300"
            title="Ingresar como administrador"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ingresar como Administrador</span>
          </button>
        )}

      </div>
    </footer>
  );
};
