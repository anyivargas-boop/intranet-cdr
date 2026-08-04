import React, { useState } from 'react';
import { FormatoDocumento, CategoryType } from '../types';
import { 
  FileText, 
  Search, 
  Plus, 
  ExternalLink, 
  Download, 
  Filter, 
  Grid, 
  List, 
  FileSpreadsheet, 
  FileCheck, 
  FileCode, 
  Trash2, 
  Folder,
  Copy,
  Info
} from 'lucide-react';
import { DriveIcon } from './DriveIcon';
import { getFormatoLinks } from '../utils/documentHelpers';

interface DocumentosViewProps {
  formatos: FormatoDocumento[];
  isAdmin: boolean;
  onOpenAddModal: () => void;
  onDeleteFormato?: (id: string) => void;
}

export const DocumentosView: React.FC<DocumentosViewProps> = ({
  formatos,
  isAdmin,
  onOpenAddModal,
  onDeleteFormato,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = [
    'Todas',
    'Administración',
    'Formatos de Viáticos',
    'Leyes y Reglamentos',
    'Redacción y Estilo',
    'Salud y Seguridad (SST)',
    'Proyectos y Becas',
  ];

  const filteredFormatos = formatos.filter((fmt) => {
    const matchesSearch =
      fmt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fmt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' || fmt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Top Header & Search Bar Banner */}
      <div className="bg-[#234156] text-white rounded-2xl p-6 border-b-4 border-[#f3a828] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#f3a828]" />
            Formatos y Documentación Institucional
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            Repositorio central de plantillas, formatos de viáticos, guías de estilo y documentos administrativos de CdR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0 border border-amber-300"
            >
              <Plus className="w-4 h-4" />
              <span>Cargar Nuevo Formato</span>
            </button>
          )}
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noreferrer"
            className="bg-[#182c3b] hover:bg-[#12222e] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-600 flex items-center gap-2 transition-colors shrink-0"
          >
            <DriveIcon className="w-4 h-4 text-[#f3a828]" />
            <span className="hidden sm:inline">Abrir Google Drive</span>
          </a>
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar formato o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#234156] bg-slate-50 font-medium"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#234156] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg ${
              viewMode === 'grid' ? 'bg-[#234156] shadow-xs text-[#f3a828]' : 'text-slate-500'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg ${
              viewMode === 'table' ? 'bg-[#234156] shadow-xs text-[#f3a828]' : 'text-slate-500'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Helper Banner for Downloads & Master Template Protection */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950 shadow-xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-[#234156] flex items-center gap-1.5">
            <span>💡 Diligenciamiento Seguro de Formatos</span>
          </p>
          <p className="text-slate-700 mt-0.5 leading-relaxed font-medium">
            Los formatos están configurados para <strong>Descargar directamente (.xlsx / .docx)</strong> o <strong>Crear una copia privada en tu Google Drive</strong>. Esto te permite diligenciarlos de forma segura sin alterar las plantillas originales de CdR.
          </p>
        </div>
      </div>

      {/* Formatos Items Container */}
      {filteredFormatos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-300">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No se encontraron formatos</h3>
          <p className="text-xs text-slate-400 mt-1">
            Intente cambiar el término de búsqueda o seleccionar otra categoría.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormatos.map((fmt) => {
            const links = getFormatoLinks(fmt.driveUrl, fmt.fileType);
            return (
              <div
                key={fmt.id}
                className="bg-white rounded-2xl border-t-4 border-t-[#234156] border-x border-b border-slate-200 p-6 shadow-xs hover:border-t-[#f3a828] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${fmt.iconBgColor || 'bg-amber-50'} ${fmt.iconTextColor || 'text-[#234156]'} rounded-xl flex items-center justify-center text-xl font-bold border border-slate-200`}>
                      {fmt.fileType === 'excel' && '📊'}
                      {fmt.fileType === 'word' && '📑'}
                      {fmt.fileType === 'pdf' && '📄'}
                      {fmt.fileType === 'form' && '📝'}
                      {fmt.fileType === 'drive' && '📂'}
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-900 bg-[#f3a828] px-2.5 py-1 rounded-md border border-amber-300">
                      {fmt.version}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase text-[#234156] tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    {fmt.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                    {fmt.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {fmt.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Rev: {fmt.lastUpdated}</span>
                    {isAdmin && onDeleteFormato && (
                      <button
                        onClick={() => onDeleteFormato(fmt.id)}
                        className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 flex items-center gap-1 text-[10px]"
                        title="Eliminar formato"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>

                  {/* Actions: Download Direct or Copy to Drive */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={links.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors border border-slate-700 shadow-xs"
                      title="Descargar para diligenciar"
                    >
                      <Download className="w-3.5 h-3.5 text-[#f3a828]" />
                      <span>{links.isForm ? 'Responder Formulario' : 'Descargar Formato'}</span>
                    </a>

                    {!links.isForm && links.copyUrl !== links.downloadUrl && (
                      <a
                        href={links.copyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold px-3 py-2 rounded-xl flex items-center justify-center gap-1 text-xs transition-colors border border-amber-300 shadow-xs"
                        title="Crear una copia privada en Google Drive"
                      >
                        <Copy className="w-3.5 h-3.5 text-amber-800" />
                        <span>Copia Drive</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#234156] text-white uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Versión</th>
                <th className="px-6 py-4">Última Revisión</th>
                <th className="px-6 py-4 text-right">Descargar / Diligenciar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFormatos.map((fmt) => {
                const links = getFormatoLinks(fmt.driveUrl, fmt.fileType);
                return (
                  <tr key={fmt.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 ${fmt.iconBgColor || 'bg-amber-50'} ${fmt.iconTextColor || 'text-[#234156]'} rounded-lg flex items-center justify-center font-bold border border-slate-200`}>
                          {fmt.fileType === 'excel' && '📊'}
                          {fmt.fileType === 'word' && '📑'}
                          {fmt.fileType === 'pdf' && '📄'}
                          {fmt.fileType === 'form' && '📝'}
                          {fmt.fileType === 'drive' && '📂'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{fmt.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{fmt.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-[#234156] font-bold px-2.5 py-1 rounded-md text-[11px]">
                        {fmt.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">{fmt.version}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{fmt.lastUpdated}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={links.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors text-xs"
                          title="Descargar para diligenciar"
                        >
                          <Download className="w-3.5 h-3.5 text-[#f3a828]" />
                          <span>Descargar</span>
                        </a>
                        {!links.isForm && links.copyUrl !== links.downloadUrl && (
                          <a
                            href={links.copyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors text-xs border border-amber-300"
                            title="Crear copia en Drive"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copia Drive</span>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

