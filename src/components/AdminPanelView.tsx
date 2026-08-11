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
} from 'lucide-react';

interface AdminPanelViewProps {
  onNavigate: (tab: string) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
    onNavigate(id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 space-y-6">

      {/* ENCABEZADO */}
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


      {/* AVISO */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4">

        <div className="flex items-start gap-3">

          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />

          <div>
            <p className="text-xs font-extrabold text-[#234156]">
              Área exclusiva para administradores
            </p>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Los cambios realizados desde estos módulos pueden
              modificar la información visible para todos los
              empleados autorizados en la intranet.
            </p>
          </div>

        </div>

      </div>


      {/* MÓDULOS */}
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
            const isActive = activeSection === module.id;

            return (
              <button
                type="button"
                key={module.id}
                onClick={() =>
                  handleOpenModule(module.id)
                }
                className={`text-left bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all group ${
                  isActive
                    ? 'border-[#f3a828]'
                    : 'border-slate-200 hover:border-[#234156]'
                }`}
              >

                <div className="flex items-start justify-between gap-4">

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#234156] text-[#f3a828]'
                        : 'bg-slate-100 text-[#234156] group-hover:bg-[#234156] group-hover:text-[#f3a828]'
                    }`}
                  >
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


      {/* NOTA FUTURA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">

        <h3 className="text-xs font-extrabold text-[#234156]">
          Próxima mejora del panel
        </h3>

        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          En los siguientes pasos moveremos aquí los botones de
          crear, editar y eliminar para que las pantallas normales
          de los empleados queden únicamente para consulta.
        </p>

      </div>

    </div>
  );
};