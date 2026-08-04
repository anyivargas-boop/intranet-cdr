import React, { useState } from 'react';
import { Comunicado, ComunicadoCategory } from '../types';
import { Bell, Send, X, Paperclip } from 'lucide-react';

interface AddComunicadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (comunicado: Comunicado) => void;
}

export const AddComunicadoModal: React.FC<AddComunicadoModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComunicadoCategory>('Institucional');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Dirección Administrativa CdR');
  const [pinned, setPinned] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) return;

    const attachments = attachmentUrl.trim()
      ? [{ name: attachmentName || 'Anexo_Oficial.pdf', url: attachmentUrl, type: 'application/pdf' }]
      : undefined;

    const newComunicado: Comunicado = {
      id: `com-${Date.now()}`,
      title,
      category,
      summary,
      content,
      date: new Date().toISOString().split('T')[0],
      author,
      authorRole: 'Gestión Institucional',
      pinned,
      attachments,
    };

    onAdd(newComunicado);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto text-slate-900">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center border border-slate-700">
              <Bell className="w-5 h-5 text-[#f3a828]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#234156]">
                Publicar Comunicado Oficial
              </h3>
              <p className="text-xs text-slate-500 font-semibold">Personal Administrativo CdR</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Título del Comunicado *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Actualización de Horarios y Políticas de Teletrabajo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComunicadoCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              >
                <option value="Institucional">Institucional</option>
                <option value="Bienestar">Bienestar</option>
                <option value="Importante">Importante</option>
                <option value="Formación">Formación</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Remitente / Área Emisora
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Resumen Ejecutivo (Aparece en vista preliminar) *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Síntesis de 1 o 2 oraciones para la lista..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Contenido Completo del Comunicado *
            </label>
            <textarea
              rows={5}
              required
              placeholder="Escriba el cuerpo completo del mensaje..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Nombre de Anexo / Adjunto (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: Anexo_Reglamento_2026.pdf"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Enlace a Documento Adjunto (Drive/PDF)
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pinned"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="w-4 h-4 text-[#234156] rounded focus:ring-[#234156]"
            />
            <label htmlFor="pinned" className="font-extrabold text-[#234156] cursor-pointer">
              Fijar este comunicado en la parte superior del Dashboard
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold rounded-xl flex items-center gap-2 shadow-sm border border-slate-700"
            >
              <Send className="w-3.5 h-3.5 text-[#f3a828]" />
              Publicar Comunicado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

