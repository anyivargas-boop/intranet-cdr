import React from 'react';
import { ExternalLink, X, ShieldCheck } from 'lucide-react';
import { DriveIcon } from './DriveIcon';

interface DriveViewerModalProps {
  isOpen: boolean;
  folderUrl: string;
  folderName: string;
  onClose: () => void;
}

export const DriveViewerModal: React.FC<DriveViewerModalProps> = ({
  isOpen,
  folderUrl,
  folderName,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-4xl w-full p-6 flex flex-col h-[85vh]">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center border border-slate-700">
              <DriveIcon className="w-5 h-5 text-[#f3a828]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#234156]">
                {folderName || 'Carpeta de Google Drive'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Acceso directo a archivos institucionales CdR
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={folderUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs border border-slate-700"
            >
              <span>Abrir pestaña en Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#f3a828]" />
            </a>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Iframe or fallback preview box */}
        <div className="flex-grow w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
          <iframe
            src={folderUrl.replace('/view', '/preview').replace('/edit', '/preview')}
            className="w-full h-full border-0"
            title={folderName}
            onError={() => {}}
          />
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-md text-xs text-slate-700 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Si el navegador bloquea la vista previa, utilice el botón "Abrir pestaña"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

