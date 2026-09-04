import React, { useState } from 'react';

import {
  ShieldCheck,
  Building2,
  FileText,
  Bell,
  BookOpen,
  Users,
  ArrowRight,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  X,
  Save,
  KeyRound,
  Paperclip,
  Pin,
  ExternalLink,
} from 'lucide-react';

import {
  FormatoDocumento,
  Comunicado,
  Reglamento,
  AuthorizedUser,
  AuthorizedUserRole,
} from '../types';

interface AdminPanelViewProps {
  formatos: FormatoDocumento[];

  comunicados: Comunicado[];
  comunicadosLoading: boolean;

  reglamentos: Reglamento[];
  reglamentosLoading: boolean;

  authorizedUsers: AuthorizedUser[];
  authorizedUsersLoading: boolean;
  currentUserEmail: string;

  onAddDocument: () => void;

  onEditDocument: (
    documento: FormatoDocumento
  ) => void;

  onDeleteDocument: (
    id: number | string
  ) => void;

  onAddComunicado: () => void;

  onEditComunicado: (
    comunicado: Comunicado
  ) => void;

  onDeleteComunicado: (
    id: string
  ) => Promise<void>;

  onReloadComunicados: () => Promise<void>;

  onAddReglamento: () => void;

  onEditReglamento: (
    reglamento: Reglamento
  ) => void;

  onDeleteReglamento: (
    id: number | string
  ) => Promise<void>;

  onReloadReglamentos: () => Promise<void>;

  onAddAuthorizedUser: (
    user: {
      name: string;
      email: string;
      role: AuthorizedUserRole;
    }
  ) => Promise<boolean>;

  onUpdateAuthorizedUser: (
    user: AuthorizedUser
  ) => Promise<boolean>;

  onToggleAuthorizedUser: (
    user: AuthorizedUser
  ) => Promise<void>;

  onDeleteAuthorizedUser: (
    user: AuthorizedUser
  ) => Promise<void>;

  onResetUserPassword: (
    user: AuthorizedUser
  ) => Promise<boolean>;

  onReloadAuthorizedUsers: () => Promise<void>;
}

export const AdminPanelView: React.FC<
  AdminPanelViewProps
> = ({
  formatos,

  comunicados,
  comunicadosLoading,

  reglamentos,
  reglamentosLoading,

  authorizedUsers,
  authorizedUsersLoading,
  currentUserEmail,

  onAddDocument,
  onEditDocument,
  onDeleteDocument,

  onAddComunicado,
  onEditComunicado,
  onDeleteComunicado,
  onReloadComunicados,

  onAddReglamento,
  onEditReglamento,
  onDeleteReglamento,
  onReloadReglamentos,

  onAddAuthorizedUser,
  onUpdateAuthorizedUser,
  onToggleAuthorizedUser,
  onDeleteAuthorizedUser,
  onResetUserPassword,
  onReloadAuthorizedUsers,
}) => {
  const [
    activeSection,
    setActiveSection,
  ] = useState<string | null>(
    null
  );

  const [
    isUserModalOpen,
    setIsUserModalOpen,
  ] = useState(false);

  const [
    editingUser,
    setEditingUser,
  ] =
    useState<AuthorizedUser | null>(
      null
    );

  const [
    userName,
    setUserName,
  ] = useState('');

  const [
    userEmail,
    setUserEmail,
  ] = useState('');

  const [
    userRole,
    setUserRole,
  ] =
    useState<AuthorizedUserRole>(
      'employee'
    );

  const [
    userActive,
    setUserActive,
  ] = useState(true);

  const [
    savingUser,
    setSavingUser,
  ] = useState(false);

  const [
    resettingPasswordId,
    setResettingPasswordId,
  ] =
    useState<string | null>(
      null
    );


  // =========================================================
  // MÓDULOS
  // =========================================================

  const modules = [
    {
      id: 'institucional',
      title:
        'Documentación Institucional',
      description:
        'Administra certificados, documentos legales, Cámara de Comercio, RUT y documentación corporativa.',
      icon: Building2,
    },
    {
      id: 'documentos',
      title:
        'Formatos y Plantillas',
      description:
        'Administra formatos, plantillas, viáticos, solicitudes, formularios y documentos de trabajo.',
      icon: FileText,
    },
    {
      id: 'comunicados',
      title:
        'Comunicados',
      description:
        'Publica, revisa, edita y elimina comunicados, anuncios, circulares y novedades para el equipo.',
      icon: Bell,
    },
    {
      id: 'reglamentos',
      title:
        'Reglamentos y Políticas',
      description:
        'Administra políticas, manuales, reglamentos, capítulos, resúmenes y enlaces oficiales.',
      icon: BookOpen,
    },
    {
      id: 'usuarios',
      title:
        'Usuarios y Accesos',
      description:
        'Administra usuarios autorizados, roles, estado de acceso y permisos administrativos.',
      icon: Users,
    },
  ];


  // =========================================================
  // DOCUMENTOS
  // =========================================================

  const institutionalDocuments =
    formatos.filter(
      (fmt) =>
        fmt.category ===
        'Documentación Institucional'
    );

  const workingDocuments =
    formatos.filter(
      (fmt) =>
        fmt.category !==
        'Documentación Institucional'
    );


  // =========================================================
  // USUARIOS
  // =========================================================

  const handleOpenNewUser =
    () => {
      setEditingUser(null);
      setUserName('');
      setUserEmail('');
      setUserRole(
        'employee'
      );
      setUserActive(true);
      setIsUserModalOpen(
        true
      );
    };

  const handleOpenEditUser = (
    user: AuthorizedUser
  ) => {
    setEditingUser(user);
    setUserName(
      user.name
    );
    setUserEmail(
      user.email
    );
    setUserRole(
      user.role
    );
    setUserActive(
      user.active
    );
    setIsUserModalOpen(
      true
    );
  };

  const handleCloseUserModal =
    () => {
      if (savingUser) {
        return;
      }

      setIsUserModalOpen(
        false
      );
      setEditingUser(null);
      setUserName('');
      setUserEmail('');
      setUserRole(
        'employee'
      );
      setUserActive(true);
    };

  const handleSaveUser =
    async (
      e:
        React.FormEvent
    ) => {
      e.preventDefault();

      const cleanName =
        userName.trim();

      const cleanEmail =
        userEmail
          .trim()
          .toLowerCase();

      if (
        !cleanName ||
        !cleanEmail
      ) {
        alert(
          'Debes ingresar el nombre y el correo electrónico.'
        );

        return;
      }

      setSavingUser(
        true
      );

      let success =
        false;

      try {
        if (editingUser) {
          success =
            await onUpdateAuthorizedUser({
              ...editingUser,

              name:
                cleanName,

              email:
                cleanEmail,

              role:
                userRole,

              active:
                userActive,
            });
        } else {
          success =
            await onAddAuthorizedUser({
              name:
                cleanName,

              email:
                cleanEmail,

              role:
                userRole,
            });
        }
      } finally {
        setSavingUser(
          false
        );
      }

      if (success) {
        setIsUserModalOpen(
          false
        );

        setEditingUser(
          null
        );

        setUserName('');
        setUserEmail('');
        setUserRole(
          'employee'
        );
        setUserActive(
          true
        );
      }
    };

  const handleResetPassword =
    async (
      user:
        AuthorizedUser
    ) => {
      if (
        resettingPasswordId
      ) {
        return;
      }

      setResettingPasswordId(
        user.id
      );

      try {
        await onResetUserPassword(
          user
        );
      } finally {
        setResettingPasswordId(
          null
        );
      }
    };


  // =========================================================
  // DOCUMENTACIÓN INSTITUCIONAL
  // =========================================================

  if (
    activeSection ===
    'institucional'
  ) {
    return (
      <div className="w-full max-w-7xl mx-auto pb-12 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                null
              )
            }
            className="flex items-center gap-2 text-xs font-bold text-[#234156] hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a módulos
          </button>

          <button
            type="button"
            onClick={
              onAddDocument
            }
            className="flex items-center justify-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold border border-amber-300 shadow-sm"
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

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {institutionalDocuments.length ===
          0 ? (

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

              {institutionalDocuments.map(
                (doc) => (
                  <div
                    key={
                      doc.id
                    }
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >

                    <div className="flex-1">

                      <div className="flex items-center gap-2 flex-wrap">

                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          {
                            doc.version
                          }
                        </span>

                        <span className="text-[10px] font-bold text-slate-400">
                          {
                            doc.lastUpdated
                          }
                        </span>

                      </div>

                      <h3 className="text-sm font-extrabold text-[#234156] mt-2">
                        {
                          doc.title
                        }
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {
                          doc.description
                        }
                      </p>

                    </div>

                    <div className="flex items-center gap-2 shrink-0">

                      <button
                        type="button"
                        onClick={() =>
                          onEditDocument(
                            doc
                          )
                        }
                        className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-bold"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteDocument(
                            doc.id
                          )
                        }
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </div>

      </div>
    );
  }


  // =========================================================
  // FORMATOS Y PLANTILLAS
  // =========================================================

  if (
    activeSection ===
    'documentos'
  ) {
    return (
      <div className="w-full max-w-7xl mx-auto pb-12 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                null
              )
            }
            className="flex items-center gap-2 text-xs font-bold text-[#234156] hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a módulos
          </button>

          <button
            type="button"
            onClick={
              onAddDocument
            }
            className="flex items-center justify-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold border border-amber-300 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Agregar Formato
          </button>

        </div>

        <div className="bg-[#234156] text-white rounded-3xl p-7 border-b-4 border-[#f3a828] shadow-md">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl bg-[#f3a828] text-slate-950 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>

            <div>

              <h1 className="text-xl md:text-2xl font-extrabold">
                Administración de Formatos y Plantillas
              </h1>

              <p className="text-xs md:text-sm text-slate-200 mt-1 max-w-3xl">
                Administra formatos de trabajo, plantillas, viáticos, formularios y documentos operativos disponibles para el equipo.
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white border border-slate-200 rounded-2xl p-4">

            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Total de formatos
            </p>

            <p className="text-2xl font-black text-[#234156] mt-1">
              {
                workingDocuments.length
              }
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">

            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Categorías
            </p>

            <p className="text-2xl font-black text-[#234156] mt-1">
              {
                new Set(
                  workingDocuments.map(
                    (
                      doc
                    ) =>
                      doc.category
                  )
                ).size
              }
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">

            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Última revisión
            </p>

            <p className="text-sm font-extrabold text-[#234156] mt-2">
              {
                workingDocuments.length >
                0
                  ? workingDocuments
                      .map(
                        (
                          doc
                        ) =>
                          doc.lastUpdated
                      )
                      .filter(
                        Boolean
                      )
                      .sort()
                      .reverse()[0] ||
                    'Sin fecha'
                  : 'Sin registros'
              }
            </p>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-100">

            <h2 className="text-sm font-extrabold text-[#234156]">
              Formatos y Plantillas
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Documentos operativos visibles en la sección Formatos y Plantillas.
            </p>

          </div>

          {workingDocuments.length ===
          0 ? (

            <div className="p-10 text-center">

              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="text-sm font-bold text-slate-700">
                No hay formatos registrados
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {workingDocuments.map(
                (doc) => (

                  <div
                    key={
                      doc.id
                    }
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >

                    <div className="flex items-start gap-3 min-w-0 flex-1">

                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#234156] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                            {
                              doc.category
                            }
                          </span>

                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {
                              doc.fileType
                            }
                          </span>

                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            {
                              doc.version
                            }
                          </span>

                        </div>

                        <h3 className="text-sm font-extrabold text-[#234156] mt-2">
                          {
                            doc.title
                          }
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {
                            doc.description
                          }
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">

                      <button
                        type="button"
                        onClick={() =>
                          onEditDocument(
                            doc
                          )
                        }
                        className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-bold"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteDocument(
                            doc.id
                          )
                        }
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>
    );
  }


  // =========================================================
  // COMUNICADOS
  // =========================================================

  if (
    activeSection ===
    'comunicados'
  ) {
    const pinnedCount =
      comunicados.filter(
        (
          comunicado
        ) =>
          comunicado.pinned
      ).length;

    const categoriesCount =
      new Set(
        comunicados.map(
          (
            comunicado
          ) =>
            comunicado.category
        )
      ).size;

    return (
      <div className="w-full max-w-7xl mx-auto pb-12 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                null
              )
            }
            className="flex items-center gap-2 text-xs font-bold text-[#234156] hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a módulos
          </button>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={
                onReloadComunicados
              }
              disabled={
                comunicadosLoading
              }
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#234156] px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  comunicadosLoading
                    ? 'animate-spin'
                    : ''
                }`}
              />
              Actualizar
            </button>

            <button
              type="button"
              onClick={
                onAddComunicado
              }
              className="flex items-center justify-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold border border-amber-300 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Publicar comunicado
            </button>

          </div>

        </div>

        <div className="bg-[#234156] text-white rounded-3xl p-7 border-b-4 border-[#f3a828] shadow-md">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl bg-[#f3a828] text-slate-950 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6" />
            </div>

            <div>

              <h1 className="text-xl md:text-2xl font-extrabold">
                Administración de Comunicados
              </h1>

              <p className="text-xs md:text-sm text-slate-200 mt-1 max-w-3xl">
                Publica, revisa, edita y elimina comunicados, anuncios, circulares y novedades visibles para el equipo.
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Comunicados
            </p>

            <p className="text-2xl font-black text-[#234156] mt-1">
              {comunicados.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Destacados
            </p>

            <p className="text-2xl font-black text-amber-700 mt-1">
              {pinnedCount}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Categorías
            </p>

            <p className="text-2xl font-black text-[#234156] mt-1">
              {categoriesCount}
            </p>
          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-extrabold text-[#234156]">
              Comunicados publicados
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Contenido disponible actualmente en la Intranet.
            </p>
          </div>

          {comunicadosLoading ? (

            <div className="p-10 text-center">
              <RefreshCw className="w-7 h-7 text-[#234156] animate-spin mx-auto mb-3" />

              <p className="text-xs font-bold text-slate-500">
                Cargando comunicados...
              </p>
            </div>

          ) : comunicados.length === 0 ? (

            <div className="p-10 text-center">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="text-sm font-bold text-slate-700">
                No hay comunicados publicados
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Usa “Publicar comunicado” para crear el primero.
              </p>
            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {comunicados.map(
                (
                  comunicado
                ) => (

                  <div
                    key={
                      comunicado.id
                    }
                    className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4"
                  >

                    <div className="flex items-start gap-3 min-w-0 flex-1">

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          comunicado.pinned
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-[#234156]'
                        }`}
                      >
                        {comunicado.pinned ? (
                          <Pin className="w-5 h-5" />
                        ) : (
                          <Bell className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                            {
                              comunicado.category
                            }
                          </span>

                          {comunicado.pinned && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[#234156] text-white px-2 py-0.5 rounded-full">
                              Destacado
                            </span>
                          )}

                          <span className="text-[10px] font-bold text-slate-400">
                            {
                              comunicado.date
                            }
                          </span>

                        </div>

                        <h3 className="text-sm font-extrabold text-[#234156] mt-2">
                          {
                            comunicado.title
                          }
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {
                            comunicado.summary
                          }
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">

                          {comunicado.author && (
                            <span className="text-[10px] text-slate-400">
                              Remitente:{' '}

                              <strong>
                                {
                                  comunicado.author
                                }
                              </strong>
                            </span>
                          )}

                          {comunicado.media &&
                            comunicado.media.length >
                              0 && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />

                                {comunicado.media.length}{' '}
                                recurso
                                {comunicado.media.length !==
                                1
                                  ? 's'
                                  : ''}
                              </span>
                            )}

                        </div>

                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">

                      <button
                        type="button"
                        onClick={() =>
                          onEditComunicado(
                            comunicado
                          )
                        }
                        className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-bold"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteComunicado(
                            comunicado.id
                          )
                        }
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>
    );
  }


  // =========================================================
  // REGLAMENTOS Y POLÍTICAS
  // =========================================================

  if (
    activeSection ===
    'reglamentos'
  ) {
    const safeReglamentos =
      Array.isArray(
        reglamentos
      )
        ? reglamentos
        : [];

    const sectionsCount =
      safeReglamentos.reduce(
        (
          total,
          reglamento
        ) =>
          total +
          (
            reglamento.sections
              ?.length ||
            0
          ),
        0
      );

    const categoriesCount =
      new Set(
        safeReglamentos
          .map(
            (
              reglamento
            ) =>
              reglamento.category
          )
          .filter(
            Boolean
          )
      ).size;

    return (
      <div className="w-full max-w-7xl mx-auto pb-12 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                null
              )
            }
            className="flex items-center gap-2 text-xs font-bold text-[#234156] hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a módulos
          </button>

          <div className="flex flex-wrap items-center gap-2">

            <button
              type="button"
              onClick={
                onReloadReglamentos
              }
              disabled={
                reglamentosLoading
              }
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#234156] px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  reglamentosLoading
                    ? 'animate-spin'
                    : ''
                }`}
              />
              Actualizar
            </button>

            <button
              type="button"
              onClick={
                onAddReglamento
              }
              className="flex items-center justify-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold border border-amber-300 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Agregar Reglamento
            </button>

          </div>

        </div>

        <div className="bg-[#234156] text-white rounded-3xl p-7 border-b-4 border-[#f3a828] shadow-md">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl bg-[#f3a828] text-slate-950 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>

            <div>

              <h1 className="text-xl md:text-2xl font-extrabold">
                Administración de Reglamentos y Políticas
              </h1>

              <p className="text-xs md:text-sm text-slate-200 mt-1 max-w-3xl">
                Crea, edita y elimina reglamentos, políticas, manuales, capítulos y enlaces oficiales visibles para el equipo.
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white border border-slate-200 rounded-2xl p-4">

            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Reglamentos
            </p>

            <p className="text-2xl font-black text-[#234156] mt-1">
              {
                safeReglamentos.length
              }
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">

            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Capítulos / Secciones
            </p>

            <p className="text-2xl font-black text-amber-700 mt-1">
              {
                sectionsCount
              }
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">

            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Categorías
            </p>

            <p className="text-2xl font-black text-[#234156] mt-1">
              {
                categoriesCount
              }
            </p>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-100">

            <h2 className="text-sm font-extrabold text-[#234156]">
              Reglamentos y Políticas publicados
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Contenido disponible actualmente en la sección Reglamentos de la Intranet.
            </p>

          </div>

          {reglamentosLoading ? (

            <div className="p-10 text-center">

              <RefreshCw className="w-7 h-7 text-[#234156] animate-spin mx-auto mb-3" />

              <p className="text-xs font-bold text-slate-500">
                Cargando reglamentos...
              </p>

            </div>

          ) : safeReglamentos.length ===
            0 ? (

            <div className="p-10 text-center">

              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="text-sm font-bold text-slate-700">
                No hay reglamentos registrados
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Usa “Agregar Reglamento” para crear el primero.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {safeReglamentos.map(
                (
                  reglamento
                ) => (

                  <div
                    key={
                      reglamento.id
                    }
                    className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4"
                  >

                    <div className="flex items-start gap-3 min-w-0 flex-1">

                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2 flex-wrap">

                          {reglamento.category && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                              {
                                reglamento.category
                              }
                            </span>
                          )}

                          {reglamento.lastRevision && (
                            <span className="text-[10px] font-bold text-slate-400">
                              Revisión:{' '}
                              {
                                reglamento.lastRevision
                              }
                            </span>
                          )}

                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            {
                              reglamento.sections
                                ?.length ||
                              0
                            }{' '}
                            capítulos
                          </span>

                        </div>

                        <h3 className="text-sm font-extrabold text-[#234156] mt-2">
                          {
                            reglamento.title
                          }
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {
                            reglamento.description
                          }
                        </p>

                        <div className="flex flex-wrap gap-3 mt-2">

                          {reglamento.articlesCount >
                            0 && (
                            <span className="text-[10px] text-slate-400">
                              Artículos:{' '}
                              <strong>
                                {
                                  reglamento.articlesCount
                                }
                              </strong>
                            </span>
                          )}

                          {reglamento.driveLink && (
                            <a
                              href={
                                reglamento.driveLink
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Abrir documento
                            </a>
                          )}

                        </div>

                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">

                      <button
                        type="button"
                        onClick={() =>
                          onEditReglamento(
                            reglamento
                          )
                        }
                        className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-bold"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteReglamento(
                            reglamento.id
                          )
                        }
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>
    );
  }


  // =========================================================
  // USUARIOS Y ACCESOS
  // =========================================================

  if (
    activeSection ===
    'usuarios'
  ) {
    return (
      <div className="w-full max-w-7xl mx-auto pb-12 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                null
              )
            }
            className="flex items-center gap-2 text-xs font-bold text-[#234156] hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a módulos
          </button>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={
                onReloadAuthorizedUsers
              }
              disabled={
                authorizedUsersLoading
              }
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#234156] px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  authorizedUsersLoading
                    ? 'animate-spin'
                    : ''
                }`}
              />
              Actualizar
            </button>

            <button
              type="button"
              onClick={
                handleOpenNewUser
              }
              className="flex items-center justify-center gap-2 bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold border border-amber-300 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Agregar Usuario
            </button>

          </div>

        </div>

        <div className="bg-[#234156] text-white rounded-3xl p-7 border-b-4 border-[#f3a828] shadow-md">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl bg-[#f3a828] text-slate-950 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>

            <div>

              <h1 className="text-xl md:text-2xl font-extrabold">
                Usuarios y Accesos
              </h1>

              <p className="text-xs md:text-sm text-slate-200 mt-1 max-w-3xl">
                Administra las personas autorizadas para ingresar a la intranet, sus roles, estado de acceso y recuperación de contraseña.
              </p>

            </div>

          </div>

        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />

            <div>

              <p className="text-xs font-extrabold text-[#234156]">
                Autorización y contraseña
              </p>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Los permisos de acceso se administran en esta sección. La contraseña se gestiona mediante Supabase Authentication.
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Usuarios
            </p>

            <p className="text-2xl font-black text-[#234156] mt-1">
              {
                authorizedUsers.length
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Activos
            </p>

            <p className="text-2xl font-black text-emerald-700 mt-1">
              {
                authorizedUsers.filter(
                  (
                    user
                  ) =>
                    user.active
                ).length
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Administradores
            </p>

            <p className="text-2xl font-black text-amber-700 mt-1">
              {
                authorizedUsers.filter(
                  (
                    user
                  ) =>
                    user.role ===
                      'admin' &&
                    user.active
                ).length
              }
            </p>
          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-100">

            <h2 className="text-sm font-extrabold text-[#234156]">
              Usuarios autorizados
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Correos con autorización para acceder a la intranet.
            </p>

          </div>

          {authorizedUsersLoading ? (

            <div className="p-10 text-center">

              <RefreshCw className="w-7 h-7 text-[#234156] animate-spin mx-auto mb-3" />

              <p className="text-xs font-bold text-slate-500">
                Cargando usuarios...
              </p>

            </div>

          ) : authorizedUsers.length ===
            0 ? (

            <div className="p-10 text-center">

              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="text-sm font-bold text-slate-700">
                No hay usuarios autorizados
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {authorizedUsers.map(
                (
                  user
                ) => {
                  const isCurrentUser =
                    user.email
                      .toLowerCase() ===
                    currentUserEmail
                      .toLowerCase();

                  const isResetting =
                    resettingPasswordId ===
                    user.id;

                  return (
                    <div
                      key={
                        user.id
                      }
                      className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4"
                    >

                      <div className="flex items-start gap-3 min-w-0">

                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            user.active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {user.active ? (
                            <UserCheck className="w-5 h-5" />
                          ) : (
                            <UserX className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0">

                          <div className="flex items-center gap-2 flex-wrap">

                            <h3 className="text-sm font-extrabold text-[#234156]">
                              {
                                user.name ||
                                'Sin nombre'
                              }
                            </h3>

                            {isCurrentUser && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Tú
                              </span>
                            )}

                            <span
                              className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                user.role ===
                                'admin'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {user.role ===
                              'admin'
                                ? 'Administrador'
                                : 'Empleado'}
                            </span>

                            <span
                              className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                user.active
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {user.active
                                ? 'Activo'
                                : 'Inactivo'}
                            </span>

                          </div>

                          <p className="text-xs text-slate-500 mt-1 break-all">
                            {
                              user.email
                            }
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenEditUser(
                              user
                            )
                          }
                          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-bold"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleResetPassword(
                              user
                            )
                          }
                          disabled={
                            isResetting
                          }
                          className="flex items-center gap-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                        >
                          {isResetting ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <KeyRound className="w-3.5 h-3.5" />
                          )}

                          {isResetting
                            ? 'Enviando...'
                            : 'Restablecer contraseña'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onToggleAuthorizedUser(
                              user
                            )
                          }
                          disabled={
                            isCurrentUser &&
                            user.active
                          }
                          className={`flex items-center gap-1.5 border px-3 py-2 rounded-lg text-xs font-bold ${
                            user.active
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          } disabled:opacity-40`}
                        >
                          {user.active ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}

                          {user.active
                            ? 'Desactivar'
                            : 'Activar'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDeleteAuthorizedUser(
                              user
                            )
                          }
                          disabled={
                            isCurrentUser
                          }
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

        {isUserModalOpen && (
          <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

              <div className="flex items-center justify-between gap-4 p-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>

                  <div>

                    <h3 className="text-base font-extrabold text-[#234156]">
                      {editingUser
                        ? 'Editar usuario'
                        : 'Agregar usuario'}
                    </h3>

                    <p className="text-xs text-slate-500">
                      Usuarios y Accesos CdR
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    handleCloseUserModal
                  }
                  disabled={
                    savingUser
                  }
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              <form
                onSubmit={
                  handleSaveUser
                }
                className="p-5 space-y-4"
              >

                <div>

                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#234156] mb-1">
                    Nombre *
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      userName
                    }
                    onChange={(
                      e
                    ) =>
                      setUserName(
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] text-sm"
                  />

                </div>

                <div>

                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#234156] mb-1">
                    Correo institucional *
                  </label>

                  <input
                    type="email"
                    required
                    value={
                      userEmail
                    }
                    onChange={(
                      e
                    ) =>
                      setUserEmail(
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] text-sm"
                  />

                </div>

                <div>

                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#234156] mb-1">
                    Rol *
                  </label>

                  <select
                    value={
                      userRole
                    }
                    onChange={(
                      e
                    ) =>
                      setUserRole(
                        e.target
                          .value as AuthorizedUserRole
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] text-sm"
                  >
                    <option value="employee">
                      Empleado
                    </option>

                    <option value="admin">
                      Administrador
                    </option>
                  </select>

                </div>

                {editingUser && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">

                    <label className="flex items-center justify-between gap-4 cursor-pointer">

                      <div>

                        <p className="text-xs font-extrabold text-[#234156]">
                          Acceso activo
                        </p>

                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Si se desactiva, este correo dejará de tener acceso autorizado.
                        </p>

                      </div>

                      <input
                        type="checkbox"
                        checked={
                          userActive
                        }
                        onChange={(
                          e
                        ) =>
                          setUserActive(
                            e.target.checked
                          )
                        }
                        disabled={
                          editingUser.email
                            .toLowerCase() ===
                          currentUserEmail
                            .toLowerCase()
                        }
                        className="w-4 h-4 accent-[#234156]"
                      />

                    </label>

                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">

                  <button
                    type="button"
                    onClick={
                      handleCloseUserModal
                    }
                    disabled={
                      savingUser
                    }
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={
                      savingUser
                    }
                    className="flex items-center gap-2 bg-[#234156] hover:bg-[#1a3142] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold disabled:opacity-50"
                  >
                    {savingUser ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#f3a828]" />
                    ) : (
                      <Save className="w-4 h-4 text-[#f3a828]" />
                    )}

                    {savingUser
                      ? 'Guardando...'
                      : editingUser
                      ? 'Guardar cambios'
                      : 'Agregar usuario'}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    );
  }


  // =========================================================
  // PANEL PRINCIPAL
  // =========================================================

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
              Centro de gestión de contenidos de la intranet. Desde aquí puedes administrar documentación institucional, formatos, comunicados, reglamentos, políticas y accesos de usuarios.
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

          {modules.map(
            (
              module
            ) => {
              const Icon =
                module.icon;

              return (
                <button
                  type="button"
                  key={
                    module.id
                  }
                  onClick={() =>
                    setActiveSection(
                      module.id
                    )
                  }
                  className="text-left bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#234156] transition-all group"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 text-[#234156] group-hover:bg-[#234156] group-hover:text-[#f3a828] transition-all">
                      <Icon className="w-5 h-5" />
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#234156] group-hover:translate-x-1 transition-all" />

                  </div>

                  <h3 className="text-sm font-extrabold text-[#234156] mt-4">
                    {
                      module.title
                    }
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {
                      module.description
                    }
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">

                    <span className="text-[11px] font-extrabold text-[#234156]">
                      Administrar sección
                    </span>

                  </div>

                </button>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
};