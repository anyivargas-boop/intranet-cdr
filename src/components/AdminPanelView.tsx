import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  FileText,
  Bell,
  BookOpen,
  Calendar,
  Users,
  ArrowRight,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { FormatoDocumento } from '../types';

interface AdminPanelViewProps {
  formatos: FormatoDocumento[];
  onAddDocument: () => void;
  onEditDocument: (documento: FormatoDocumento) => void;
  onDeleteDocument: (id: number | string) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  formatos,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
}) => {
  const [activeSection, setActiveSection] =
    useState<string | null>(null);

  const modules = [
    {
      id: 'institucional',
      title: 'Documentación Institucional',
      description:
        'Administra certificados, documentos legales, Cámara de Comercio, RUT y documentación corporativa.',
      icon: Building2,
    },
    {
      id: 'documentos',
      title: 'Formatos y Plantillas',
      description:
        'Administra formatos, plantillas, viáticos, solicitudes, formularios y documentos de trabajo.',
      icon: FileText,
    },
    {
      id: 'comunicados',
      title: 'Comunicados',
      description:
        'Publica, revisa y elimina comunicados, anuncios, circulares y novedades para el equipo.',
      icon: Bell,
    },
    {
      id: 'reglamentos',
      title: 'Reglamentos y Políticas',
      description:
        'Administra políticas, manuales, reglamentos, capítulos, resúmenes y enlaces oficiales.',
      icon: BookOpen,
    },
    {
      id: 'agenda',
      title: 'Agenda y Eventos',
      description:
        'Administra talleres, capacitaciones, reuniones, fechas límite y eventos internos.',
      icon: Calendar,
    },
    {
      id: 'usuarios',
      title: 'Usuarios y Accesos',
      description:
        'Administra usuarios autorizados, roles, estado de acceso y permisos administrativos.',
      icon: Users,
    },
  ];

  const handleOpenModule = (id: string) => {
    setActiveSection(id);
  };

  const institutionalDocuments = formatos.filter(
    (fmt) =>
      fmt.category === 'Documentación Institucional'
  );

  if (activeSection === 'institucional') {
    return (
      <div className="w-full max-w-7xl mx-auto pb-12 space-y-6">

        <div className="flex items-center justify-between gap-4">

          <button
            type="button"
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-xs font-bold text-[#234156] hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a módulos
          </button>

          <button
            type="button"
            onClick={onAddDocument}
            className="flex items-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold border border-amber-300 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Agregar Documento
          </button>

        </div>

        <div className="bg-[#234156] text-white rounded-3xl p-7 border-b-4 border-[#f3a828] shadow-md">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl bg-[#f3a828] text-slate-950 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-extrabold">
                Administración de Documentación Institucional
              </h1>

              <p className="text-xs md:text-sm text-slate-200 mt-1">
                Crea, edita o elimina documentos institucionales visibles para el equipo.
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

          {institutionalDocuments.length === 0 ? (
            <div className="p-10 text-center">

              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="text-sm font-bold text-slate-700">
                No hay documentos institucionales
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Usa “Agregar Documento” para crear el primero.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {institutionalDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >

                  <div className="flex-1">

                    <div className="flex items-center gap-2 flex-wrap">

                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {doc.version}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        {doc.lastUpdated}
                      </span>

                    </div>

                    <h3 className="text-sm font-extrabold text-[#234156] mt-2">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {doc.description}
                    </p>

                  </div>

                  <div className="flex items-center gap-2 shrink-0">

                    <button
                      type="button"
                      onClick={() =>
                        onEditDocument(doc)
                      }
                      className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-bold"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDeleteDocument(doc.id)
                      }
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 space-y-6">

      <div className="bg-[#234156] text-white rounded-3xl p-7 border-b-4 border-[#f3a828] shadow-md">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-2xl bg-[#f3a828] text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-extrabold">
              Panel Administrativo CdR
            </h1>

            <p className="text-xs md:text-sm text-slate-200 mt-1 max-w-3xl leading-relaxed">
              Centro de gestión de contenidos de la intranet.
              Desde aquí puedes administrar documentos,
              formatos, comunicados, reglamentos, agenda y
              accesos de usuarios.
            </p>
          </div>

        </div>
      </div>

      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4">

        <div className="flex items-start gap-3">

          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />

          <div>
            <p className="text-xs font-extrabold text-[#234156]">
              Área exclusiva para administradores
            </p>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Los cambios realizados desde estos módulos pueden modificar la información visible para todos los empleados autorizados en la intranet.
            </p>
          </div>

        </div>

      </div>

      <div>

        <div className="mb-4">

          <h2 className="text-base font-extrabold text-[#234156]">
            Módulos de administración
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Selecciona la sección que deseas administrar.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <button
                type="button"
                key={module.id}
                onClick={() =>
                  handleOpenModule(module.id)
                }
                className="text-left bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#234156] transition-all group"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 text-[#234156] group-hover:bg-[#234156] group-hover:text-[#f3a828] transition-all">
                    <Icon className="w-5 h-5" />
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#234156] group-hover:translate-x-1 transition-all" />

                </div>

                <h3 className="text-sm font-extrabold text-[#234156] mt-4">
                  {module.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {module.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100">

                  <span className="text-[11px] font-extrabold text-[#234156]">
                    Administrar sección
                  </span>

                </div>

              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
};