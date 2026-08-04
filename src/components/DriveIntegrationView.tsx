import React, { useState } from 'react';
import { DriveFolder, GoogleIntegrationsConfig } from '../types';
import { 
  Folder, 
  ExternalLink, 
  Plus, 
  Search, 
  Settings, 
  CheckCircle2, 
  Lock, 
  ShieldCheck,
  Eye,
  Trash2
} from 'lucide-react';
import { DriveIcon } from './DriveIcon';

interface DriveIntegrationViewProps {
  driveFolders: DriveFolder[];
  googleConfig: GoogleIntegrationsConfig;
  isAdmin: boolean;
  onOpenFolderModal: (url: string, name: string) => void;
  onAddDriveFolder: (folder: DriveFolder) => void;
  onDeleteDriveFolder?: (id: string) => void;
}

export const DriveIntegrationView: React.FC<DriveIntegrationViewProps> = ({
  driveFolders,
  googleConfig,
  isAdmin,
  onOpenFolderModal,
  onAddDriveFolder,
  onDeleteDriveFolder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderCategory, setNewFolderCategory] = useState('General');
  const [newFolderUrl, setNewFolderUrl] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  const filteredFolders = driveFolders.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !newFolderUrl.trim()) return;

    const newFolder: DriveFolder = {
      id: `drv-${Date.now()}`,
      name: newFolderName,
      category: newFolderCategory,
      url: newFolderUrl,
      fileCount: 0,
      description: newFolderDesc || 'Carpeta de archivos compartidos CdR',
      iconBgColor: 'bg-indigo-50',
      iconTextColor: 'text-indigo-600',
    };

    onAddDriveFolder(newFolder);
    setShowAddFolderModal(false);
    setNewFolderName('');
    setNewFolderUrl('');
    setNewFolderDesc('');
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Banner */}
      <div className="bg-[#234156] text-white rounded-2xl p-6 border-b-4 border-[#f3a828] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <DriveIcon className="w-6 h-6 text-[#f3a828]" />
            Vincular y Gestionar Google Drive CdR
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            Repositorio central de carpetas compartidas en la nube para el equipo de Consejo de Redacción.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setShowAddFolderModal(true)}
              className="bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0 border border-amber-300"
            >
              <Plus className="w-4 h-4" />
              <span>Vincular Nueva Carpeta</span>
            </button>
          )}

          <a
            href={googleConfig.driveFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#182c3b] hover:bg-[#12222e] text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-600 flex items-center gap-2 transition-colors shrink-0"
          >
            <span>Drive Raíz CdR</span>
            <ExternalLink className="w-4 h-4 text-[#f3a828]" />
          </a>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar carpeta en Google Drive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#234156] bg-slate-50 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Acceso seguro mediante dominio @consejoderedaccion.org</span>
        </div>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFolders.map((folder) => (
          <div
            key={folder.id}
            className="bg-white rounded-2xl border-l-4 border-l-[#234156] border-y border-r border-slate-200 p-6 shadow-xs hover:border-r-[#f3a828] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 text-[#234156] border border-amber-300 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  📂
                </div>
                <span className="text-[10px] font-extrabold text-slate-900 bg-[#f3a828] px-2.5 py-1 rounded border border-amber-300">
                  {folder.category}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#234156] transition-colors">
                {folder.name}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {folder.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-bold">
                {folder.fileCount > 0 ? `${folder.fileCount} elementos` : 'Carpeta activa'}
              </span>

              <div className="flex items-center gap-2">
                {isAdmin && onDeleteDriveFolder && (
                  <button
                    onClick={() => onDeleteDriveFolder(folder.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    title="Desvincular carpeta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onOpenFolderModal(folder.url, folder.name)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors border border-slate-200"
                >
                  <Eye className="w-3.5 h-3.5 text-[#234156]" />
                  <span>Vista Previa</span>
                </button>

                <a
                  href={folder.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors shadow-xs"
                >
                  <span>Drive</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#f3a828]" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Drive Folder Modal */}
      {showAddFolderModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-md w-full p-6 text-slate-900">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#234156] flex items-center gap-2">
                <DriveIcon className="w-5 h-5 text-[#f3a828]" />
                Vincular Carpeta de Google Drive
              </h3>
              <button
                onClick={() => setShowAddFolderModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                  Nombre de la Carpeta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Coberturas Periodísticas 2026"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                  Categoría
                </label>
                <select
                  value={newFolderCategory}
                  onChange={(e) => setNewFolderCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
                >
                  <option value="Administración">Administración</option>
                  <option value="Formatos">Formatos</option>
                  <option value="Legales">Legales</option>
                  <option value="Editorial">Editorial</option>
                  <option value="SST">Salud y Seguridad (SST)</option>
                  <option value="Investigaciones">Investigaciones</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                  Enlace URL de la Carpeta de Google Drive
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={newFolderUrl}
                  onChange={(e) => setNewFolderUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                  Descripción Corta
                </label>
                <textarea
                  rows={2}
                  placeholder="Indique qué tipo de archivos contiene esta carpeta..."
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFolderModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#234156] hover:bg-[#1a3142] text-white font-bold rounded-xl shadow-sm border border-slate-700"
                >
                  Vincular Carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

