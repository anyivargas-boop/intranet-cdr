import React from 'react';
import {
  ShieldCheck,
} from 'lucide-react';

interface FooterProps {
  isAdmin: boolean;
  onOpenAdminPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAdmin,
  onOpenAdminPanel,
}) => {
  return (
    <footer className="bg-[#234156] border-t-2 border-[#f3a828] px-6 lg:px-10 py-2 flex items-center justify-between gap-4 shrink-0">

      {/* INFORMACIÓN INSTITUCIONAL */}
      <div className="text-[11px] text-slate-300 font-medium">
        © 2026 Consejo de Redacción (CdR) • Intranet Corporativa v2.1
      </div>

      {/* ACCESO ADMINISTRATIVO */}
      {isAdmin && (
        <button
          type="button"
          onClick={onOpenAdminPanel}
          className="flex items-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-sm border border-amber-300"
          title="Abrir Panel Administrativo"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Panel Administrativo</span>
        </button>
      )}

    </footer>
  );
};