import React from 'react';
import { Comunicado } from '../types';
import { Bell, Calendar, User, FileText, Download, ExternalLink, X, ShieldCheck } from 'lucide-react';

interface ComunicadoDetailModalProps {
  comunicado: Comunicado | null;
  onClose: () => void;
}

export const ComunicadoDetailModal: React.FC<ComunicadoDetailModalProps> = ({
  comunicado,
  onClose,
}) => {
  if (!comunicado) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto text-slate-900">
        <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold text-slate-900 bg-[#f3a828] px-2.5 py-1 rounded border border-amber-300 uppercase tracking-wider">
                {comunicado.category}
              </span>
              {comunicado.pinned && (
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200">
                  📌 Comunicado Fijado
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-[#234156] leading-snug">
              {comunicado.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
              <span className="flex items-center gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-[#234156]" />
                {comunicado.date}
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <User className="w-3.5 h-3.5 text-[#234156]" />
                {comunicado.author} ({comunicado.authorRole})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-700 space-y-4 leading-relaxed whitespace-pre-line py-2">
          {comunicado.content}
        </div>

        {/* Attachments Section */}
        {comunicado.attachments && comunicado.attachments.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider mb-3">
              Documentos Adjuntos
            </h4>
            <div className="space-y-2">
              {comunicado.attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#234156]" />
                    <span className="text-xs font-bold text-slate-800">{att.name}</span>
                  </div>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs border border-slate-700"
                  >
                    <span>Abrir / Descargar</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#f3a828]" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200"
          >
            Cerrar Comunicado
          </button>
        </div>
      </div>
    </div>
  );
};

