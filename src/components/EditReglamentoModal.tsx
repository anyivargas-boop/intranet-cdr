import React, { useEffect, useState } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Link as LinkIcon,
} from 'lucide-react';

import {
  Reglamento,
  ReglamentoSection,
} from '../types';

interface EditReglamentoModalProps {
  isOpen: boolean;
  reglamento: Reglamento | null;
  onClose: () => void;
  onSave: (reglamento: Reglamento) => void;
}

export const EditReglamentoModal: React.FC<
  EditReglamentoModalProps
> = ({
  isOpen,
  reglamento,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [lastRevision, setLastRevision] = useState('');
  const [articlesCount, setArticlesCount] = useState(0);
  const [driveLink, setDriveLink] = useState('');
  const [sections, setSections] = useState<ReglamentoSection[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    if (reglamento) {
      setTitle(reglamento.title || '');
      setCategory(reglamento.category || '');
      setDescription(reglamento.description || '');
      setLastRevision(reglamento.lastRevision || '');
      setArticlesCount(reglamento.articlesCount || 0);
      setDriveLink(reglamento.driveLink || '');
      setSections(
        reglamento.sections?.map((section, index) => ({
          ...section,
          sortOrder: section.sortOrder ?? index + 1,
        })) || []
      );
    } else {
      setTitle('');
      setCategory('');
      setDescription('');
      setLastRevision(
        new Date().toISOString().split('T')[0]
      );
      setArticlesCount(0);
      setDriveLink('');
      setSections([]);
    }
  }, [isOpen, reglamento]);

  if (!isOpen) return null;

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        title: '',
        content: '',
        sectionUrl: '',
        sortOrder: prev.length + 1,
      },
    ]);
  };

  const handleSectionChange = (
    index: number,
    field: keyof ReglamentoSection,
    value: string | number
  ) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index
          ? {
              ...section,
              [field]: value,
            }
          : section
      )
    );
  };

  const handleDeleteSection = (index: number) => {
    setSections((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((section, i) => ({
          ...section,
          sortOrder: i + 1,
        }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const cleanSections = sections.map(
      (section, index) => ({
        ...section,
        title: section.title.trim(),
        content: section.content.trim(),
        sectionUrl: section.sectionUrl?.trim() || '',
        sortOrder: index + 1,
      })
    );

    const updatedReglamento: Reglamento = {
      id: reglamento?.id ?? `temp-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      lastRevision,
      articlesCount: Number(articlesCount) || 0,
      driveLink: driveLink.trim(),
      pdfUrl: reglamento?.pdfUrl,
      sections: cleanSections,
    };

    onSave(updatedReglamento);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-300 shadow-2xl">

        {/* ENCABEZADO */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between gap-4 p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-[#234156]">
                {reglamento
                  ? 'Editar Política / Reglamento'
                  : 'Agregar Política / Reglamento'}
              </h2>

              <p className="text-xs text-slate-500">
                Modifica la información general y los capítulos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >
          {/* DATOS GENERALES */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#234156]">
              Información General
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#234156] mb-1">
                Título *
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Política de Compras y Contratación"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#234156] mb-1">
                  Categoría
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  placeholder="Ej: Normativa Laboral"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#234156] mb-1">
                  Fecha de revisión
                </label>

                <input
                  type="date"
                  value={lastRevision}
                  onChange={(e) =>
                    setLastRevision(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#234156] mb-1">
                Contexto / Descripción
              </label>

              <textarea
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Explique de qué trata esta política, manual o reglamento..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#234156] mb-1">
                  Número de artículos
                </label>

                <input
                  type="number"
                  min="0"
                  value={articlesCount}
                  onChange={(e) =>
                    setArticlesCount(
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#234156] mb-1">
                  Enlace del documento oficial
                </label>

                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                  <input
                    type="url"
                    value={driveLink}
                    onChange={(e) =>
                      setDriveLink(e.target.value)
                    }
                    placeholder="https://drive.google.com/..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CAPÍTULOS */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#234156]">
                  Capítulos / Secciones
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Puedes editar el título, resumen y enlace directo de cada capítulo.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="bg-[#234156] hover:bg-[#1a3142] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#f3a828]" />
                Agregar capítulo
              </button>
            </div>

            {sections.length === 0 && (
              <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center">
                <p className="text-xs text-slate-400">
                  Todavía no hay capítulos registrados.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id ?? index}
                  className="border border-slate-200 rounded-2xl p-4 bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-extrabold text-[#234156]">
                      Capítulo {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteSection(index)
                      }
                      className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#234156] mb-1">
                        Título del capítulo
                      </label>

                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleSectionChange(
                            index,
                            'title',
                            e.target.value
                          )
                        }
                        placeholder="Ej: Capítulo I: Objeto y alcance"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#234156] mb-1">
                        Resumen / contenido
                      </label>

                      <textarea
                        rows={3}
                        value={section.content}
                        onChange={(e) =>
                          handleSectionChange(
                            index,
                            'content',
                            e.target.value
                          )
                        }
                        placeholder="Resumen del contenido de este capítulo..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#234156] mb-1">
                        Enlace directo al capítulo
                      </label>

                      <input
                        type="url"
                        value={section.sectionUrl || ''}
                        onChange={(e) =>
                          handleSectionChange(
                            index,
                            'sectionUrl',
                            e.target.value
                          )
                        }
                        placeholder="https://docs.google.com/...#heading=..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold flex items-center gap-2"
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