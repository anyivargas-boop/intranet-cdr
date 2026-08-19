import React from 'react';
import {
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';

interface FooterProps {
  canUseAdminPanel: boolean;
  adminModeEnabled: boolean;
  onEnableAdminMode: () => void;
  onDisableAdminMode: () => void;
  onOpenAdminPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  canUseAdminPanel,
  adminModeEnabled,
  onEnableAdminMode,
  onDisableAdminMode,
  onOpenAdminPanel,
}) => {
  return (
    <footer className="bg-[#234156] border-t-2 border-[#f3a828] px-6 lg:px-10 py-2 flex items-center justify-between gap-4 shrink-0">

      {/* INFORMACIÓN INSTITUCIONAL */}
      <div className="text-[11px] text-slate-300 font-medium">
        © 2026 Consejo de Redacción (CdR) • Intranet Corporativa v2.1
      </div>

      {/* ZONA ADMINISTRATIVA */}
      {canUseAdminPanel && (
        <div className="flex items-center gap-2">

          {adminModeEnabled ? (
            <>
              {/* ABRIR PANEL */}
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className="flex items-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-sm border border-amber-300"
                title="Abrir Panel Administrativo"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Panel Administrativo</span>
              </button>

              {/* DESACTIVAR MODO */}
              <button
                type="button"
                onClick={onDisableAdminMode}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors border border-slate-600 hover:border-slate-400"
                title="Desactivar modo administrador"
              >
                <ShieldOff className="w-3.5 h-3.5" />
                <span>Desactivar modo administrador</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEnableAdminMode}
              className="flex items-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all shadow-sm border border-amber-300"
              title="Activar modo administrador"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Activar modo administrador</span>
            </button>
          )}

        </div>
      )}

    </footer>
  );
};