import React, { useState } from 'react';
import { Reglamento } from '../types';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Download,
  CheckCircle,
  Folder
} from 'lucide-react';
import { DriveIcon } from './DriveIcon';

interface ReglamentosViewProps {
  reglamentos: Reglamento[];
  isAdmin: boolean;
  onOpenDriveLink: (url: string) => void;
}

export const ReglamentosView: React.FC<React.PropsWithChildren<ReglamentosViewProps>> = ({
  reglamentos,
  isAdmin,
  onOpenDriveLink,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRegId, setExpandedRegId] = useState<string>(reglamentos[0]?.id || '');

  const filteredReglamentos = reglamentos.filter((reg) => {
    return (
      reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-[#234156] text-white rounded-2xl p-6 border-b-4 border-[#f3a828] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#f3a828]" />
            Reglamentos de Trabajo y Políticas CdR
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            Marco normativo, reglamentos internos de trabajo, código de ética y manuales corporativos para el equipo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noreferrer"
            className="bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0 border border-amber-300"
          >
            <DriveIcon className="w-4 h-4 text-slate-950" />
            <span>Carpeta de Reglamentos en Drive</span>
          </a>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar reglamento o política..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#234156] bg-slate-50 font-medium"
          />
        </div>
      </div>

      {/* Reglamentos Accordion Cards */}
      <div className="space-y-4">
        {filteredReglamentos.map((reg) => {
          const isExpanded = expandedRegId === reg.id;
          return (
            <div
              key={reg.id}
              className="bg-white rounded-2xl border-l-4 border-l-[#234156] border-y border-r border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedRegId(isExpanded ? '' : reg.id)}
                className="p-6 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#234156] text-[#f3a828] rounded-xl flex items-center justify-center shrink-0 font-bold border border-slate-700 shadow-xs">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-slate-900 bg-[#f3a828] px-2.5 py-0.5 rounded uppercase tracking-wider border border-amber-300">
                        {reg.category}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        Revisión: {reg.lastRevision}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                      {reg.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {reg.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                  <span className="text-xs text-slate-500 font-bold">
                    {reg.articlesCount} artículos
                  </span>
                  <div className="p-2 rounded-xl bg-[#234156] text-[#f3a828]">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Articles / Summary View */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 pt-2">
                    <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider">
                      Resumen de Artículos Clave
                    </h4>
                    <a
                      href={reg.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#234156] bg-amber-100 hover:bg-amber-200 px-3.5 py-1.5 rounded-lg border border-amber-300 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Abrir Documento Oficial en Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="space-y-3">
                    {reg.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs"
                      >
                        <h5 className="font-extrabold text-xs text-[#234156] mb-1 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          {sec.title}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {sec.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

