import React, { useState } from 'react';
import { FormatoDocumento } from '../types';
import {
  Building2,
  Search,
  Plus,
  ExternalLink,
  Grid,
  List,
  Trash2,
  Pencil,
} from 'lucide-react';

interface DocumentacionInstitucionalViewProps {
  formatos: FormatoDocumento[];
  isAdmin: boolean;
  onOpenAddModal: () => void;
  onDeleteFormato?: (id: string) => void;
  onEditFormato?: (formato: FormatoDocumento) => void;
}

export const DocumentacionInstitucionalView: React.FC<
  DocumentacionInstitucionalViewProps
> = ({
  formatos,
  isAdmin,
  onOpenAddModal,
  onDeleteFormato,
  onEditFormato,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] =
    useState<'grid' | 'table'>('grid');

  const institutionalDocuments = formatos.filter((fmt) => {
    const matchesCategory =
      fmt.category === 'Documentación Institucional';

    const matchesSearch =
      fmt.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      fmt.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto pb-10">

      {/* ENCABEZADO */}
      <div className="bg-[#234156] text-white rounded-2xl p-6 border-b-4 border-[#f3a828] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#f3a828]" />
            Documentación Institucional
          </h1>

          <p className="text-xs text-slate-200 mt-1">
            Consulta de documentos legales, administrativos y
            corporativos de Consejo de Redacción.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0 border border-amber-300"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Documento</span>
          </button>
        )}
      </div>

      {/* BUSCADOR Y CAMBIO DE VISTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">

        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

          <input
            type="text"
            placeholder="Buscar documento institucional..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#234156] bg-slate-50 font-medium"
          />
        </div>

        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg ${
              viewMode === 'grid'
                ? 'bg-[#234156] shadow-xs text-[#f3a828]'
                : 'text-slate-500'
            }`}
            title="Vista en tarjetas"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg ${
              viewMode === 'table'
                ? 'bg-[#234156] shadow-xs text-[#f3a828]'
                : 'text-slate-500'
            }`}
            title="Vista en tabla"
          >
            <List className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* SIN DOCUMENTOS */}
      {institutionalDocuments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-300">

          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />

          <h3 className="text-base font-bold text-slate-700">
            No se encontraron documentos institucionales
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Los documentos aparecerán aquí cuando tengan
            seleccionada la categoría
            {' '}
            <strong>
              Documentación Institucional
            </strong>
            .
          </p>

        </div>
      ) : viewMode === 'grid' ? (

        /* VISTA EN TARJETAS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {institutionalDocuments.map((fmt) => (
            <div
              key={fmt.id}
              className="bg-white rounded-2xl border-t-4 border-t-[#234156] border-x border-b border-slate-200 p-6 shadow-xs hover:border-t-[#f3a828] hover:shadow-md transition-all flex flex-col justify-between"
            >

              <div>

                <div className="flex items-center justify-between mb-4">

                  <div
                    className={`w-12 h-12 ${
                      fmt.iconBgColor || 'bg-sky-50'
                    } ${
                      fmt.iconTextColor ||
                      'text-[#234156]'
                    } rounded-xl flex items-center justify-center text-xl font-bold border border-slate-200`}
                  >
                    {fmt.fileType === 'pdf' && '📄'}
                    {fmt.fileType === 'word' && '📑'}
                    {fmt.fileType === 'excel' && '📊'}
                    {fmt.fileType === 'drive' && '📂'}
                    {fmt.fileType === 'form' && '📝'}
                  </div>

                  <span className="text-[11px] font-extrabold text-slate-900 bg-[#f3a828] px-2.5 py-1 rounded-md border border-amber-300">
                    {fmt.version}
                  </span>

                </div>

                <span className="text-[10px] font-extrabold uppercase text-[#234156] tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  Documentación Institucional
                </span>

                <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                  {fmt.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {fmt.description}
                </p>

              </div>


              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">

                  <span>
                    Rev: {fmt.lastUpdated}
                  </span>

                  {isAdmin && (
                    <div className="flex items-center gap-2">

                      {onEditFormato && (
                        <button
                          type="button"
                          onClick={() =>
                            onEditFormato(fmt)
                          }
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 flex items-center gap-1 text-[10px]"
                          title="Editar documento"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                      )}

                      {onDeleteFormato && (
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteFormato(fmt.id)
                          }
                          className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 flex items-center gap-1 text-[10px]"
                          title="Eliminar documento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      )}

                    </div>
                  )}

                </div>

                <a
                  href={fmt.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors border border-slate-700 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#f3a828]" />
                  <span>Abrir Documento</span>
                </a>

              </div>

            </div>
          ))}

        </div>

      ) : (

        /* VISTA EN TABLA */
        <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-xs">

          <table className="w-full text-left text-xs">

            <thead className="bg-[#234156] text-white uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-4">
                  Documento
                </th>

                <th className="px-6 py-4">
                  Versión
                </th>

                <th className="px-6 py-4">
                  Última revisión
                </th>

                <th className="px-6 py-4 text-right">
                  Acciones
                </th>
              </tr>
            </thead>


            <tbody className="divide-y divide-slate-100">

              {institutionalDocuments.map((fmt) => (
                <tr
                  key={fmt.id}
                  className="hover:bg-amber-50/30 transition-colors"
                >

                  <td className="px-6 py-4">

                    <p className="font-bold text-slate-900">
                      {fmt.title}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {fmt.description}
                    </p>

                  </td>


                  <td className="px-6 py-4 font-bold text-slate-800">
                    {fmt.version}
                  </td>


                  <td className="px-6 py-4 text-slate-500">
                    {fmt.lastUpdated}
                  </td>


                  <td className="px-6 py-4">

                    <div className="flex justify-end items-center gap-2 flex-wrap">

                      {isAdmin && onEditFormato && (
                        <button
                          type="button"
                          onClick={() =>
                            onEditFormato(fmt)
                          }
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 border border-blue-200"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </button>
                      )}

                      {isAdmin && onDeleteFormato && (
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteFormato(fmt.id)
                          }
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      )}

                      <a
                        href={fmt.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#234156] hover:bg-[#1a3142] text-white font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#f3a828]" />
                        Abrir
                      </a>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};