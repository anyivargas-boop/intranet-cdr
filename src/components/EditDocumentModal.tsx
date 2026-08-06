import React, { useEffect, useState } from 'react';
import { FormatoDocumento, CategoryType, FileType } from '../types';
import { FilePenLine, Save, X } from 'lucide-react';

interface EditDocumentModalProps {
  isOpen: boolean;
  documento: FormatoDocumento | null;
  onClose: () => void;
  onSave: (documento: FormatoDocumento) => void;
}

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  documento,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] =
    useState<CategoryType>('Administración');
  const [description, setDescription] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [fileType, setFileType] = useState<FileType>('word');
  const [version, setVersion] = useState('v1.0');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    if (!documento) return;

    setTitle(documento.title);
    setCategory(documento.category);
    setDescription(documento.description);
    setDriveUrl(documento.driveUrl);
    setFileType(documento.fileType);
    setVersion(documento.version);
    setLastUpdated(documento.lastUpdated);
  }, [documento]);

  if (!isOpen || !documento) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !driveUrl.trim()) return;

    const colors: Record<FileType, { bg: string; text: string }> = {
      excel: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
      },
      word: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
      },
      pdf: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
      },
      form: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
      },
      drive: {
        bg: 'bg-slate-100',
        text: 'text-[#234156]',
      },
    };

    const documentoActualizado: FormatoDocumento = {
      ...documento,
      title: title.trim(),
      category,
      description: description.trim(),
      driveUrl: driveUrl.trim(),
      downloadUrl: driveUrl.trim(),
      fileType,
      version: version.trim() || 'v1.0',
      lastUpdated:
        lastUpdated || new Date().toISOString().split('T')[0],
      iconBgColor: colors[fileType].bg,
      iconTextColor: colors[fileType].text,
    };

    onSave(documentoActualizado);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 text-slate-900">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center border border-slate-700">
              <FilePenLine className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#234156]">
                Editar documento
              </h3>

              <p className="text-xs text-slate-500 font-semibold">
                Modifique la información o el enlace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Nombre del documento *
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Categoría
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as CategoryType)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              >
                <option value="Administración">
                  Administración
                </option>
                <option value="Formatos de Viáticos">
                  Formatos de Viáticos
                </option>
                <option value="Leyes y Reglamentos">
                  Leyes y Reglamentos
                </option>
                <option value="Redacción y Estilo">
                  Redacción y Estilo
                </option>
                <option value="Salud y Seguridad (SST)">
                  Salud y Seguridad (SST)
                </option>
                <option value="Proyectos y Becas">
                  Proyectos y Becas
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Tipo de archivo
              </label>

              <select
                value={fileType}
                onChange={(e) =>
                  setFileType(e.target.value as FileType)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              >
                <option value="excel">Excel</option>
                <option value="word">Word / Google Docs</option>
                <option value="pdf">PDF</option>
                <option value="form">Google Forms</option>
                <option value="drive">Carpeta de Drive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Versión
              </label>

              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Fecha de revisión
              </label>

              <input
                type="date"
                value={lastUpdated}
                onChange={(e) =>
                  setLastUpdated(e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Enlace de Google Drive / Docs *
            </label>

            <input
              type="url"
              required
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://docs.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Descripción
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
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
              className="px-5 py-2.5 bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4 text-[#f3a828]" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};