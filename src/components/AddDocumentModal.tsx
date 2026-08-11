import React, { useEffect, useState } from 'react';
import {
  FormatoDocumento,
  CategoryType,
  FileType,
} from '../types';
import {
  FileText,
  Upload,
  X,
} from 'lucide-react';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (doc: FormatoDocumento) => void;
}

export const AddDocumentModal: React.FC<
  AddDocumentModalProps
> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] =
    useState<CategoryType>('Documentación Institucional');
  const [description, setDescription] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [fileType, setFileType] =
    useState<FileType>('word');
  const [version, setVersion] = useState('v1.0');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory('Documentación Institucional');
      setDescription('');
      setDriveUrl('');
      setFileType('word');
      setVersion('v1.0');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim() || !driveUrl.trim()) {
      return;
    }

    const bgColors: Record<
      FileType,
      {
        bg: string;
        text: string;
      }
    > = {
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

    const newDoc: FormatoDocumento = {
      id: `temp-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      driveUrl: driveUrl.trim(),
      downloadUrl: driveUrl.trim(),
      fileType,
      version: version.trim() || 'v1.0',
      lastUpdated:
        new Date().toISOString().split('T')[0],
      iconBgColor: bgColors[fileType].bg,
      iconTextColor: bgColors[fileType].text,
      downloadsCount: 0,
    };

    onAdd(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 text-slate-900">

        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center border border-slate-700">
              <FileText className="w-5 h-5 text-[#f3a828]" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#234156]">
                Cargar Documento o Formato
              </h3>

              <p className="text-xs text-slate-500 font-semibold">
                Personal Administrativo CdR
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
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
              Nombre del Documento / Formato *
            </label>

            <input
              type="text"
              required
              placeholder="Ej: Certificado de Cámara de Comercio"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Categoría *
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as CategoryType
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              >
                <option value="Documentación Institucional">
                  Documentación Institucional
                </option>

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
                Tipo de Archivo
              </label>

              <select
                value={fileType}
                onChange={(e) =>
                  setFileType(
                    e.target.value as FileType
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              >
                <option value="excel">
                  Excel / Plantilla de Cálculo
                </option>

                <option value="word">
                  Documento de Texto (Word/Docs)
                </option>

                <option value="pdf">
                  Documento PDF Oficial
                </option>

                <option value="form">
                  Formulario
                </option>

                <option value="drive">
                  Enlace / Carpeta
                </option>
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
                placeholder="v1.0"
                value={version}
                onChange={(e) =>
                  setVersion(e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Enlace del archivo *
              </label>

              <input
                type="url"
                required
                placeholder="https://docs.google.com/..."
                value={driveUrl}
                onChange={(e) =>
                  setDriveUrl(e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>

          </div>

          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Descripción Corta e Instrucciones de Uso
            </label>

            <textarea
              rows={3}
              placeholder="Describe para qué sirve este documento o formato..."
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
              className="px-5 py-2.5 bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold rounded-xl flex items-center gap-2 shadow-sm border border-slate-700"
            >
              <Upload className="w-3.5 h-3.5 text-[#f3a828]" />
              Publicar Documento
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};