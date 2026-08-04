import React, { useState } from 'react';
import { Comunicado, ComunicadoCategory } from '../types';
import { 
  Bell, 
  Search, 
  Plus, 
  Pin, 
  Calendar, 
  User, 
  FileText, 
  Download, 
  ExternalLink,
  ChevronRight,
  Filter,
  Trash2
} from 'lucide-react';

interface ComunicadosViewProps {
  comunicados: Comunicado[];
  isAdmin: boolean;
  onOpenAddModal: () => void;
  onSelectComunicado: (comunicado: Comunicado) => void;
  onDeleteComunicado?: (id: string) => void;
}

export const ComunicadosView: React.FC<ComunicadosViewProps> = ({
  comunicados,
  isAdmin,
  onOpenAddModal,
  onSelectComunicado,
  onDeleteComunicado,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Institucional', 'Bienestar', 'Importante', 'Formación'];

  const filtered = comunicados.filter((com) => {
    const matchesSearch =
      com.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      com.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      com.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || com.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const pinnedComunicados = filtered.filter((c) => c.pinned);
  const regularComunicados = filtered.filter((c) => !c.pinned);

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-[#234156] text-white rounded-2xl p-6 border-b-4 border-[#f3a828] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#f3a828]" />
            Comunicados e Información Oficial CdR
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            Canal institucional de notificaciones, boletines y novedades para el equipo de Consejo de Redacción.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenAddModal}
            className="bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0 border border-amber-300"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Comunicado</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar comunicado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#234156] bg-slate-50 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
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
      </div>

      {/* Pinned Announcements Section */}
      {pinnedComunicados.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-[#234156] flex items-center gap-2 uppercase tracking-wider">
            <Pin className="w-4 h-4 text-[#f3a828] rotate-45" />
            Comunicados Destacados & Fijados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedComunicados.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComunicado(item)}
                className="bg-white rounded-2xl border-2 border-[#f3a828] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider bg-[#f3a828] px-2.5 py-1 rounded border border-amber-300">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#234156] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-bold">{item.author}</span>
                  <span className="text-[#234156] font-extrabold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Leer detalles completos &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements Section */}
      <div className="space-y-3">
        {pinnedComunicados.length > 0 && (
          <h2 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider">
            Histórico de Comunicados
          </h2>
        )}

        {regularComunicados.length === 0 && pinnedComunicados.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-300">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No hay comunicados registrados</h3>
            <p className="text-xs text-slate-400 mt-1">
              {isAdmin ? 'Publica el primer comunicado con el botón superior.' : 'Vuelve más tarde para revisar novedades.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {regularComunicados.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComunicado(item)}
                className="bg-white rounded-2xl border-l-4 border-l-[#234156] border-y border-r border-slate-200 p-5 shadow-xs hover:border-r-[#f3a828] hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] font-extrabold text-[#234156] uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.date} &bull; <strong className="text-slate-700">{item.author}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#234156] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isAdmin && onDeleteComunicado && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComunicado(item.id);
                      }}
                      className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                      title="Eliminar comunicado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-xs font-extrabold text-[#234156] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Ver más <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

