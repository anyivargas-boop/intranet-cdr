import React, { useEffect, useState } from 'react';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DocumentacionInstitucionalView } from './components/DocumentacionInstitucionalView';
import { DocumentosView } from './components/DocumentosView';
import { ComunicadosView } from './components/ComunicadosView';
import { ReglamentosView } from './components/ReglamentosView';
import { AgendaView } from './components/AgendaView';
import { AdminPanelView } from './components/AdminPanelView';
import { Footer } from './components/Footer';

import { EmployeeLogin } from './components/EmployeeLogin';
import { ResetPassword } from './components/ResetPassword';

import { AddDocumentModal } from './components/AddDocumentModal';
import { EditDocumentModal } from './components/EditDocumentModal';
import { EditReglamentoModal } from './components/EditReglamentoModal';
import { AddComunicadoModal } from './components/AddComunicadoModal';
import { AddEventModal } from './components/AddEventModal';
import { ComunicadoDetailModal } from './components/ComunicadoDetailModal';
import { AdminLoginModal } from './components/AdminLoginModal';

import { supabase } from './lib/supabase';

import {
  initialComunicados,
  initialEventos,
  initialGoogleConfig,
} from './data/initialData';

import {
  FormatoDocumento,
  Comunicado,
  Reglamento,
  ReglamentoSection,
  EventoAgenda,
  GoogleIntegrationsConfig,
  CategoryType,
  FileType,
  AuthorizedUser,
  AuthorizedUserRole,
} from './types';


export default function App() {
  const [activeTab, setActiveTab] =
    useState<string>('inicio');

  // =========================================================
  // ACCESO Y ROLES
  // =========================================================

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [
    employeeAuthorized,
    setEmployeeAuthorized,
  ] = useState(false);

  const [
    currentUserEmail,
    setCurrentUserEmail,
  ] = useState('');

  const [
    currentUserRole,
    setCurrentUserRole,
  ] = useState<
    'admin' | 'employee' | ''
  >('');

  const [
    isPasswordRecovery,
    setIsPasswordRecovery,
  ] = useState(false);


  // =========================================================
  // USUARIOS AUTORIZADOS - SUPABASE
  // =========================================================

  const [
    authorizedUsers,
    setAuthorizedUsers,
  ] = useState<AuthorizedUser[]>([]);

  const [
    authorizedUsersLoading,
    setAuthorizedUsersLoading,
  ] = useState(false);


  // =========================================================
  // DOCUMENTOS - SUPABASE
  // =========================================================

  const [formatos, setFormatos] =
    useState<FormatoDocumento[]>([]);

  const [
    documentosLoading,
    setDocumentosLoading,
  ] = useState(false);


  // =========================================================
  // COMUNICADOS - LOCAL POR AHORA
  // =========================================================

  const [
    comunicados,
    setComunicados,
  ] = useState<Comunicado[]>(() => {
    const saved =
      localStorage.getItem(
        'cdr_comunicados'
      );

    return saved
      ? JSON.parse(saved)
      : initialComunicados;
  });


  // =========================================================
  // REGLAMENTOS - SUPABASE
  // =========================================================

  const [
    reglamentos,
    setReglamentos,
  ] = useState<Reglamento[]>([]);

  const [
    reglamentosLoading,
    setReglamentosLoading,
  ] = useState(false);


  // =========================================================
  // AGENDA - LOCAL POR AHORA
  // =========================================================

  const [
    eventos,
    setEventos,
  ] = useState<EventoAgenda[]>(() => {
    const saved =
      localStorage.getItem(
        'cdr_eventos'
      );

    return saved
      ? JSON.parse(saved)
      : initialEventos;
  });

  const [
    googleConfig,
    setGoogleConfig,
  ] =
    useState<GoogleIntegrationsConfig>(
      () => {
        const saved =
          localStorage.getItem(
            'cdr_googleConfig'
          );

        return saved
          ? JSON.parse(saved)
          : initialGoogleConfig;
      }
    );


  // =========================================================
  // LOCAL STORAGE
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      'cdr_comunicados',
      JSON.stringify(comunicados)
    );
  }, [comunicados]);

  useEffect(() => {
    localStorage.setItem(
      'cdr_eventos',
      JSON.stringify(eventos)
    );
  }, [eventos]);

  useEffect(() => {
    localStorage.setItem(
      'cdr_googleConfig',
      JSON.stringify(googleConfig)
    );
  }, [googleConfig]);


  // =========================================================
  // VERIFICAR EMPLEADO
  // =========================================================

  const verifyEmployee = async (
    email?: string | null
  ) => {
    if (!email) {
      setEmployeeAuthorized(false);
      setCurrentUserEmail('');
      setCurrentUserRole('');
      setIsAdmin(false);
      setAuthLoading(false);

      return;
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const validDomain =
      normalizedEmail.endsWith(
        '@consejoderedaccion.org'
      ) ||
      normalizedEmail.endsWith(
        '@colombiacheck.org'
      );

    if (!validDomain) {
      await supabase.auth.signOut();

      setEmployeeAuthorized(false);
      setCurrentUserEmail('');
      setCurrentUserRole('');
      setIsAdmin(false);
      setAuthLoading(false);

      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from('authorized_users')
      .select(
        'email, active, role'
      )
      .eq(
        'email',
        normalizedEmail
      )
      .eq(
        'active',
        true
      )
      .maybeSingle();

    if (
      error ||
      !data
    ) {
      await supabase.auth.signOut();

      setEmployeeAuthorized(false);
      setCurrentUserEmail('');
      setCurrentUserRole('');
      setIsAdmin(false);
      setAuthLoading(false);

      return;
    }

    const role =
      data.role === 'admin'
        ? 'admin'
        : 'employee';

    setEmployeeAuthorized(true);

    setCurrentUserEmail(
      normalizedEmail
    );

    setCurrentUserRole(
      role
    );

    setIsAdmin(
      role === 'admin'
    );

    setAuthLoading(false);
  };


  // =========================================================
  // DETECTAR URL DE RECUPERACIÓN
  // =========================================================

  const hasRecoveryUrl = () => {
    const hash =
      window.location.hash || '';

    const search =
      window.location.search || '';

    const hashParams =
      new URLSearchParams(
        hash.startsWith('#')
          ? hash.substring(1)
          : hash
      );

    const searchParams =
      new URLSearchParams(search);

    return (
      hashParams.get('type') ===
        'recovery' ||
      searchParams.get('type') ===
        'recovery' ||
      searchParams.get(
        'recovery'
      ) === '1'
    );
  };


  // =========================================================
  // SESIÓN / RECUPERACIÓN DE CONTRASEÑA
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!mounted) {
            return;
          }

          console.log(
            'Supabase auth event:',
            event
          );

          if (
            event ===
            'PASSWORD_RECOVERY'
          ) {
            setIsPasswordRecovery(
              true
            );

            setAuthLoading(false);

            return;
          }

          if (hasRecoveryUrl()) {
            setIsPasswordRecovery(
              true
            );

            setAuthLoading(false);

            return;
          }

          if (
            event ===
            'SIGNED_OUT'
          ) {
            setEmployeeAuthorized(
              false
            );

            setCurrentUserEmail(
              ''
            );

            setCurrentUserRole(
              ''
            );

            setIsAdmin(false);

            setAuthLoading(false);

            return;
          }

          verifyEmployee(
            session?.user?.email
          );
        }
      );

    const checkInitialSession =
      async () => {
        if (hasRecoveryUrl()) {
          setIsPasswordRecovery(
            true
          );

          setAuthLoading(false);

          return;
        }

        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (hasRecoveryUrl()) {
          setIsPasswordRecovery(
            true
          );

          setAuthLoading(false);

          return;
        }

        await verifyEmployee(
          session?.user?.email
        );
      };

    checkInitialSession();

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, []);


  // =========================================================
  // PROTEGER PANEL ADMIN
  // =========================================================

  useEffect(() => {
    if (
      activeTab === 'admin' &&
      !isAdmin
    ) {
      setActiveTab('inicio');
    }
  }, [
    activeTab,
    isAdmin,
  ]);


  // =========================================================
  // CERRAR SESIÓN
  // =========================================================

  const handleEmployeeLogout =
    async () => {
      await supabase.auth.signOut();

      setEmployeeAuthorized(
        false
      );

      setCurrentUserEmail('');

      setCurrentUserRole('');

      setIsAdmin(false);

      setFormatos([]);

      setReglamentos([]);

      setAuthorizedUsers([]);

      setActiveTab('inicio');
    };


  // =========================================================
  // CARGAR USUARIOS AUTORIZADOS
  // =========================================================

  const loadAuthorizedUsers =
    async () => {
      if (
        currentUserRole !==
        'admin'
      ) {
        return;
      }

      setAuthorizedUsersLoading(
        true
      );

      const {
        data,
        error,
      } = await supabase
        .from('authorized_users')
        .select(
          'id, email, name, role, active, created_at'
        )
        .order(
          'name',
          {
            ascending: true,
          }
        );

      if (error) {
        console.error(
          'Error cargando usuarios autorizados:',
          error
        );

        setAuthorizedUsers([]);

        setAuthorizedUsersLoading(
          false
        );

        return;
      }

      const mappedUsers: AuthorizedUser[] =
        (data || []).map(
          (user) => ({
            id:
              user.id,

            email:
              user.email || '',

            name:
              user.name || '',

            role:
              user.role ===
              'admin'
                ? 'admin'
                : 'employee',

            active:
              Boolean(
                user.active
              ),

            createdAt:
              user.created_at ||
              undefined,
          })
        );

      setAuthorizedUsers(
        mappedUsers
      );

      setAuthorizedUsersLoading(
        false
      );
    };


  // =========================================================
  // AGREGAR USUARIO AUTORIZADO
  // =========================================================

  const handleAddAuthorizedUser =
    async (
      user: {
        name: string;
        email: string;
        role: AuthorizedUserRole;
      }
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede agregar usuarios.'
        );

        return false;
      }

      const normalizedEmail =
        user.email
          .trim()
          .toLowerCase();

      const validDomain =
        normalizedEmail.endsWith(
          '@consejoderedaccion.org'
        ) ||
        normalizedEmail.endsWith(
          '@colombiacheck.org'
        );

      if (!validDomain) {
        alert(
          'El correo debe pertenecer a @consejoderedaccion.org o @colombiacheck.org.'
        );

        return false;
      }

      const existingUser =
        authorizedUsers.find(
          (existing) =>
            existing.email
              .toLowerCase() ===
            normalizedEmail
        );

      if (existingUser) {
        alert(
          'Este correo ya está registrado en Usuarios y Accesos.'
        );

        return false;
      }

      const id =
        crypto.randomUUID();

      const {
        error,
      } = await supabase
        .from(
          'authorized_users'
        )
        .insert({
          id,
          email:
            normalizedEmail,
          name:
            user.name.trim(),
          role:
            user.role,
          active:
            true,
        });

      if (error) {
        console.error(
          'Error agregando usuario:',
          error
        );

        alert(
          'No fue posible agregar el usuario. Revisa las políticas RLS de authorized_users.'
        );

        return false;
      }

      await loadAuthorizedUsers();

      return true;
    };


  // =========================================================
  // EDITAR USUARIO AUTORIZADO
  // =========================================================

  const handleUpdateAuthorizedUser =
    async (
      user: AuthorizedUser
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede editar usuarios.'
        );

        return false;
      }

      const normalizedEmail =
        user.email
          .trim()
          .toLowerCase();

      const validDomain =
        normalizedEmail.endsWith(
          '@consejoderedaccion.org'
        ) ||
        normalizedEmail.endsWith(
          '@colombiacheck.org'
        );

      if (!validDomain) {
        alert(
          'El correo debe pertenecer a @consejoderedaccion.org o @colombiacheck.org.'
        );

        return false;
      }

      const {
        error,
      } = await supabase
        .from(
          'authorized_users'
        )
        .update({
          email:
            normalizedEmail,

          name:
            user.name.trim(),

          role:
            user.role,

          active:
            user.active,
        })
        .eq(
          'id',
          user.id
        );

      if (error) {
        console.error(
          'Error actualizando usuario:',
          error
        );

        alert(
          'No fue posible actualizar el usuario.'
        );

        return false;
      }

      await loadAuthorizedUsers();

      if (
        normalizedEmail ===
        currentUserEmail
      ) {
        await verifyEmployee(
          normalizedEmail
        );
      }

      return true;
    };


  // =========================================================
  // ACTIVAR / DESACTIVAR USUARIO
  // =========================================================

  const handleToggleAuthorizedUser =
    async (
      user: AuthorizedUser
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede modificar accesos.'
        );

        return;
      }

      if (
        user.email
          .toLowerCase() ===
          currentUserEmail
            .toLowerCase() &&
        user.active
      ) {
        alert(
          'No puedes desactivar tu propio acceso mientras estás usando esta sesión.'
        );

        return;
      }

      const {
        error,
      } = await supabase
        .from(
          'authorized_users'
        )
        .update({
          active:
            !user.active,
        })
        .eq(
          'id',
          user.id
        );

      if (error) {
        console.error(
          'Error cambiando estado del usuario:',
          error
        );

        alert(
          'No fue posible cambiar el estado del usuario.'
        );

        return;
      }

      await loadAuthorizedUsers();
    };


  // =========================================================
  // ELIMINAR AUTORIZACIÓN
  // =========================================================

  const handleDeleteAuthorizedUser =
    async (
      user: AuthorizedUser
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede eliminar accesos.'
        );

        return;
      }

      if (
        user.email
          .toLowerCase() ===
        currentUserEmail
          .toLowerCase()
      ) {
        alert(
          'No puedes eliminar tu propio acceso desde esta sesión.'
        );

        return;
      }

      const confirmed =
        window.confirm(
          `¿Seguro que deseas eliminar la autorización de ${user.name || user.email}?`
        );

      if (!confirmed) {
        return;
      }

      const {
        error,
      } = await supabase
        .from(
          'authorized_users'
        )
        .delete()
        .eq(
          'id',
          user.id
        );

      if (error) {
        console.error(
          'Error eliminando autorización:',
          error
        );

        alert(
          'No fue posible eliminar la autorización.'
        );

        return;
      }

      await loadAuthorizedUsers();
    };


  // =========================================================
  // RESTABLECER CONTRASEÑA DE USUARIO
  // =========================================================

  const handleResetUserPassword =
    async (
      user: AuthorizedUser
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede solicitar el restablecimiento de contraseña.'
        );

        return false;
      }

      const normalizedEmail =
        user.email
          .trim()
          .toLowerCase();

      if (!normalizedEmail) {
        alert(
          'Este usuario no tiene un correo electrónico válido.'
        );

        return false;
      }

      const confirmed =
        window.confirm(
          `¿Deseas enviar un enlace para restablecer la contraseña de ${user.name || normalizedEmail}?\n\nEl correo será enviado a:\n${normalizedEmail}`
        );

      if (!confirmed) {
        return false;
      }

      const redirectUrl =
        `${window.location.origin}/?recovery=1`;

      const {
        error,
      } =
        await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo:
              redirectUrl,
          }
        );

      if (error) {
        console.error(
          'Error enviando recuperación de contraseña:',
          error
        );

        alert(
          `No fue posible enviar el correo de recuperación.\n\n${error.message}`
        );

        return false;
      }

      alert(
        `Correo de recuperación solicitado correctamente.\n\nDestino:\n${normalizedEmail}\n\nEl usuario debe revisar su bandeja de entrada y la carpeta de spam.`
      );

      return true;
    };


  // =========================================================
  // CARGAR DOCUMENTOS
  // =========================================================

  const loadDocumentos =
    async () => {
      setDocumentosLoading(
        true
      );

      const {
        data,
        error,
      } = await supabase
        .from('documentos')
        .select('*')
        .eq(
          'active',
          true
        )
        .order(
          'id',
          {
            ascending: true,
          }
        );

      if (error) {
        console.error(
          'Error cargando documentos:',
          error
        );

        setFormatos([]);

        setDocumentosLoading(
          false
        );

        return;
      }

      const mappedDocumentos: FormatoDocumento[] =
        (data || []).map(
          (doc) => ({
            id:
              doc.id,

            title:
              doc.title || '',

            category:
              (
                doc.category ||
                'Administración'
              ) as CategoryType,

            description:
              doc.description ||
              '',

            driveUrl:
              doc.drive_url ||
              '',

            downloadUrl:
              doc.download_url ||
              doc.drive_url ||
              '',

            fileType:
              (
                doc.file_type ||
                'word'
              ) as FileType,

            version:
              doc.version ||
              'v1.0',

            lastUpdated:
              doc.last_updated ||
              '',

            iconBgColor:
              doc.icon_bg_color ||
              undefined,

            iconTextColor:
              doc.icon_text_color ||
              undefined,

            downloadsCount:
              doc.downloads_count ||
              0,
          })
        );

      setFormatos(
        mappedDocumentos
      );

      setDocumentosLoading(
        false
      );
    };


  // =========================================================
  // CARGAR REGLAMENTOS
  // =========================================================

  const loadReglamentos =
    async () => {
      setReglamentosLoading(
        true
      );

      const {
        data:
          reglamentosData,
        error:
          reglamentosError,
      } = await supabase
        .from('reglamentos')
        .select('*')
        .eq(
          'active',
          true
        )
        .order(
          'id',
          {
            ascending: true,
          }
        );

      if (
        reglamentosError
      ) {
        console.error(
          'Error cargando reglamentos:',
          reglamentosError
        );

        setReglamentos([]);

        setReglamentosLoading(
          false
        );

        return;
      }

      const {
        data:
          sectionsData,
        error:
          sectionsError,
      } = await supabase
        .from(
          'reglamento_sections'
        )
        .select('*')
        .eq(
          'active',
          true
        )
        .order(
          'sort_order',
          {
            ascending: true,
          }
        );

      if (
        sectionsError
      ) {
        console.error(
          'Error cargando capítulos:',
          sectionsError
        );

        setReglamentosLoading(
          false
        );

        return;
      }

      const mappedReglamentos: Reglamento[] =
        (
          reglamentosData ||
          []
        ).map((reg) => {
          const sections: ReglamentoSection[] =
            (
              sectionsData ||
              []
            )
              .filter(
                (section) =>
                  section.reglamento_id ===
                  reg.id
              )
              .map(
                (section) => ({
                  id:
                    section.id,

                  title:
                    section.title ||
                    '',

                  content:
                    section.content ||
                    '',

                  sectionUrl:
                    section.section_url ||
                    '',

                  sortOrder:
                    section.sort_order ||
                    0,
                })
              );

          return {
            id:
              reg.id,

            title:
              reg.title ||
              '',

            description:
              reg.description ||
              '',

            category:
              reg.category ||
              '',

            lastRevision:
              reg.last_revision ||
              '',

            articlesCount:
              reg.articles_count ||
              0,

            driveLink:
              reg.drive_link ||
              '',

            sections,
          };
        });

      setReglamentos(
        mappedReglamentos
      );

      setReglamentosLoading(
        false
      );
    };


  // =========================================================
  // CARGAR DATOS DESPUÉS DEL LOGIN
  // =========================================================

  useEffect(() => {
    if (
      employeeAuthorized &&
      !isPasswordRecovery
    ) {
      loadDocumentos();

      loadReglamentos();

      if (
        currentUserRole ===
        'admin'
      ) {
        loadAuthorizedUsers();
      }
    }
  }, [
    employeeAuthorized,
    currentUserRole,
    isPasswordRecovery,
  ]);


  // =========================================================
  // MODALES
  // =========================================================

  const [
    isAddDocOpen,
    setIsAddDocOpen,
  ] = useState(false);

  const [
    isAddComunicadoOpen,
    setIsAddComunicadoOpen,
  ] = useState(false);

  const [
    isAddEventOpen,
    setIsAddEventOpen,
  ] = useState(false);

  const [
    isAdminLoginOpen,
    setIsAdminLoginOpen,
  ] = useState(false);

  const [
    documentoEditando,
    setDocumentoEditando,
  ] =
    useState<FormatoDocumento | null>(
      null
    );

  const [
    reglamentoEditando,
    setReglamentoEditando,
  ] =
    useState<Reglamento | null>(
      null
    );

  const [
    isEditReglamentoOpen,
    setIsEditReglamentoOpen,
  ] = useState(false);

  const [
    selectedComunicado,
    setSelectedComunicado,
  ] =
    useState<Comunicado | null>(
      null
    );


  // =========================================================
  // DOCUMENTOS - AGREGAR
  // =========================================================

  const handleAddDocument =
    async (
      newDoc: FormatoDocumento
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede agregar documentos.'
        );

        return;
      }

      const {
        error,
      } = await supabase
        .from('documentos')
        .insert({
          title:
            newDoc.title,

          category:
            newDoc.category,

          description:
            newDoc.description,

          drive_url:
            newDoc.driveUrl,

          download_url:
            newDoc.downloadUrl ||
            newDoc.driveUrl,

          file_type:
            newDoc.fileType,

          version:
            newDoc.version,

          last_updated:
            newDoc.lastUpdated ||
            null,

          icon_bg_color:
            newDoc.iconBgColor ||
            null,

          icon_text_color:
            newDoc.iconTextColor ||
            null,

          downloads_count:
            newDoc.downloadsCount ||
            0,

          active:
            true,
        });

      if (error) {
        console.error(
          'Error agregando documento:',
          error
        );

        alert(
          'No fue posible guardar el documento.'
        );

        return;
      }

      await loadDocumentos();
    };


  // =========================================================
  // DOCUMENTOS - EDITAR
  // =========================================================

  const handleEditDocument =
    async (
      documentoActualizado:
        FormatoDocumento
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede editar documentos.'
        );

        return;
      }

      const {
        error,
      } = await supabase
        .from('documentos')
        .update({
          title:
            documentoActualizado.title,

          category:
            documentoActualizado.category,

          description:
            documentoActualizado.description,

          drive_url:
            documentoActualizado.driveUrl,

          download_url:
            documentoActualizado.downloadUrl ||
            documentoActualizado.driveUrl,

          file_type:
            documentoActualizado.fileType,

          version:
            documentoActualizado.version,

          last_updated:
            documentoActualizado.lastUpdated ||
            null,

          icon_bg_color:
            documentoActualizado.iconBgColor ||
            null,

          icon_text_color:
            documentoActualizado.iconTextColor ||
            null,

          downloads_count:
            documentoActualizado.downloadsCount ||
            0,

          active:
            true,
        })
        .eq(
          'id',
          Number(
            documentoActualizado.id
          )
        );

      if (error) {
        console.error(
          'Error editando documento:',
          error
        );

        alert(
          'No fue posible actualizar el documento.'
        );

        return;
      }

      setDocumentoEditando(
        null
      );

      await loadDocumentos();
    };


  // =========================================================
  // DOCUMENTOS - ELIMINAR
  // =========================================================

  const handleDeleteDocument =
    async (
      id:
        | number
        | string
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede eliminar documentos.'
        );

        return;
      }

      const confirmed =
        window.confirm(
          '¿Seguro que deseas eliminar este documento?'
        );

      if (!confirmed) {
        return;
      }

      const {
        error,
      } = await supabase
        .from('documentos')
        .delete()
        .eq(
          'id',
          Number(id)
        );

      if (error) {
        console.error(
          'Error eliminando documento:',
          error
        );

        alert(
          'No fue posible eliminar el documento.'
        );

        return;
      }

      await loadDocumentos();
    };


  // =========================================================
  // REGLAMENTOS
  // =========================================================

  const handleOpenAddReglamento =
    () => {
      setReglamentoEditando(
        null
      );

      setIsEditReglamentoOpen(
        true
      );
    };


  const handleOpenEditReglamento =
    (
      reglamento:
        Reglamento
    ) => {
      setReglamentoEditando(
        reglamento
      );

      setIsEditReglamentoOpen(
        true
      );
    };


  const handleSaveReglamento =
    async (
      reglamento:
        Reglamento
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede modificar reglamentos.'
        );

        return;
      }

      const isNew =
        typeof reglamento.id ===
          'string' &&
        reglamento.id.startsWith(
          'temp-'
        );

      let reglamentoId:
        number;

      if (isNew) {
        const {
          data,
          error,
        } =
          await supabase
            .from(
              'reglamentos'
            )
            .insert({
              title:
                reglamento.title,

              category:
                reglamento.category,

              description:
                reglamento.description,

              last_revision:
                reglamento.lastRevision ||
                null,

              articles_count:
                reglamento.articlesCount ||
                0,

              drive_link:
                reglamento.driveLink,

              active:
                true,
            })
            .select(
              'id'
            )
            .single();

        if (
          error ||
          !data
        ) {
          console.error(
            'Error creando reglamento:',
            error
          );

          alert(
            'No fue posible guardar el reglamento.'
          );

          return;
        }

        reglamentoId =
          data.id;
      } else {
        reglamentoId =
          Number(
            reglamento.id
          );

        const {
          error,
        } =
          await supabase
            .from(
              'reglamentos'
            )
            .update({
              title:
                reglamento.title,

              category:
                reglamento.category,

              description:
                reglamento.description,

              last_revision:
                reglamento.lastRevision ||
                null,

              articles_count:
                reglamento.articlesCount ||
                0,

              drive_link:
                reglamento.driveLink,

              active:
                true,
            })
            .eq(
              'id',
              reglamentoId
            );

        if (error) {
          console.error(
            'Error actualizando reglamento:',
            error
          );

          alert(
            'No fue posible actualizar el reglamento.'
          );

          return;
        }
      }

      const {
        error:
          deleteSectionsError,
      } =
        await supabase
          .from(
            'reglamento_sections'
          )
          .delete()
          .eq(
            'reglamento_id',
            reglamentoId
          );

      if (
        deleteSectionsError
      ) {
        console.error(
          'Error eliminando capítulos anteriores:',
          deleteSectionsError
        );

        alert(
          'El reglamento se guardó, pero hubo un problema actualizando los capítulos.'
        );

        return;
      }

      if (
        reglamento
          .sections
          .length > 0
      ) {
        const sectionsToInsert =
          reglamento.sections.map(
            (
              section,
              index
            ) => ({
              reglamento_id:
                reglamentoId,

              title:
                section.title,

              content:
                section.content,

              section_url:
                section.sectionUrl ||
                '',

              sort_order:
                index + 1,

              active:
                true,
            })
          );

        const {
          error:
            sectionsInsertError,
        } =
          await supabase
            .from(
              'reglamento_sections'
            )
            .insert(
              sectionsToInsert
            );

        if (
          sectionsInsertError
        ) {
          console.error(
            'Error guardando capítulos:',
            sectionsInsertError
          );

          alert(
            'El reglamento se guardó, pero hubo un problema guardando los capítulos.'
          );

          return;
        }
      }

      setIsEditReglamentoOpen(
        false
      );

      setReglamentoEditando(
        null
      );

      await loadReglamentos();
    };


  const handleDeleteReglamento =
    async (
      id:
        | number
        | string
    ) => {
      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede eliminar reglamentos.'
        );

        return;
      }

      const confirmed =
        window.confirm(
          '¿Seguro que deseas eliminar esta política, reglamento o manual? También se eliminarán sus capítulos.'
        );

      if (!confirmed) {
        return;
      }

      const {
        error,
      } =
        await supabase
          .from(
            'reglamentos'
          )
          .delete()
          .eq(
            'id',
            Number(id)
          );

      if (error) {
        console.error(
          'Error eliminando reglamento:',
          error
        );

        alert(
          'No fue posible eliminar el reglamento.'
        );

        return;
      }

      await loadReglamentos();
    };


  // =========================================================
  // COMUNICADOS
  // =========================================================

  const handleAddComunicado =
    (
      newCom:
        Comunicado
    ) => {
      setComunicados(
        (prev) => [
          newCom,
          ...prev,
        ]
      );
    };


  const handleDeleteComunicado =
    (
      id:
        string
    ) => {
      setComunicados(
        (prev) =>
          prev.filter(
            (
              comunicado
            ) =>
              comunicado.id !==
              id
          )
      );
    };


  // =========================================================
  // EVENTOS
  // =========================================================

  const handleAddEvent =
    (
      newEvt:
        EventoAgenda
    ) => {
      setEventos(
        (prev) => [
          newEvt,
          ...prev,
        ]
      );
    };


  const handleDeleteEvent =
    (
      id:
        string
    ) => {
      setEventos(
        (prev) =>
          prev.filter(
            (
              evento
            ) =>
              evento.id !==
              id
          )
      );
    };


  // =========================================================
  // RECUPERACIÓN DE CONTRASEÑA
  // =========================================================

  if (
    isPasswordRecovery
  ) {
    return (
      <ResetPassword
        onSuccess={() => {
          setIsPasswordRecovery(
            false
          );

          setEmployeeAuthorized(
            false
          );

          setCurrentUserEmail('');

          setCurrentUserRole('');

          setIsAdmin(false);

          setActiveTab('inicio');

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }}
      />
    );
  }


  // =========================================================
  // CARGANDO
  // =========================================================

  if (
    authLoading
  ) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#234156] text-[#f3a828] flex items-center justify-center font-black text-xl mb-3">
            CdR
          </div>

          <p className="text-sm font-bold text-[#234156]">
            Verificando acceso...
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // LOGIN
  // =========================================================

  if (
    !employeeAuthorized
  ) {
    return (
      <EmployeeLogin />
    );
  }


  // =========================================================
  // INTRANET
  // =========================================================

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">

      <Header
        activeTab={
          activeTab
        }
        setActiveTab={
          setActiveTab
        }
        unreadCount={
          comunicados.length
        }
        isAdmin={
          isAdmin
        }
      />


      {/* USUARIO CONECTADO */}

      <div className="bg-slate-100 border-b border-slate-200 px-6 lg:px-10 py-1 flex items-center justify-end gap-3 text-[10px] text-slate-500">

        <span>
          Sesión:{' '}

          <strong>
            {
              currentUserEmail
            }
          </strong>
        </span>

        {currentUserRole ===
          'admin' && (
          <span className="bg-amber-100 text-amber-900 border border-amber-200 font-bold px-2 py-0.5 rounded-md">
            Administrador
          </span>
        )}

        <button
          type="button"
          onClick={
            handleEmployeeLogout
          }
          className="font-bold text-red-600 hover:text-red-800"
        >
          Cerrar sesión
        </button>

      </div>


      <main className="flex-grow p-4 md:p-8 overflow-y-auto">

        {/* INICIO */}

        {activeTab ===
          'inicio' && (
          <DashboardView
            formatos={
              formatos
            }
            comunicados={
              comunicados
            }
            eventos={
              eventos
            }
            isAdmin={
              isAdmin
            }
            onNavigate={
              setActiveTab
            }
            onOpenAddDocumentModal={() =>
              setIsAddDocOpen(
                true
              )
            }
            onOpenAddComunicadoModal={() =>
              setIsAddComunicadoOpen(
                true
              )
            }
            onOpenAddEventModal={() =>
              setIsAddEventOpen(
                true
              )
            }
            onOpenComunicadoDetail={
              setSelectedComunicado
            }
          />
        )}


        {/* PANEL ADMINISTRATIVO */}

        {activeTab ===
          'admin' &&
          isAdmin && (
            <AdminPanelView
              formatos={
                formatos
              }

              authorizedUsers={
                authorizedUsers
              }

              authorizedUsersLoading={
                authorizedUsersLoading
              }

              currentUserEmail={
                currentUserEmail
              }

              onAddDocument={() =>
                setIsAddDocOpen(
                  true
                )
              }

              onEditDocument={
                setDocumentoEditando
              }

              onDeleteDocument={
                handleDeleteDocument
              }

              onAddAuthorizedUser={
                handleAddAuthorizedUser
              }

              onUpdateAuthorizedUser={
                handleUpdateAuthorizedUser
              }

              onToggleAuthorizedUser={
                handleToggleAuthorizedUser
              }

              onDeleteAuthorizedUser={
                handleDeleteAuthorizedUser
              }

              onResetUserPassword={
                handleResetUserPassword
              }

              onReloadAuthorizedUsers={
                loadAuthorizedUsers
              }
            />
          )}


        {/* DOCUMENTACIÓN INSTITUCIONAL */}

        {activeTab ===
          'institucional' && (
          <>
            {documentosLoading ? (
              <LoadingBox
                text="Cargando documentación institucional..."
              />
            ) : (
              <DocumentacionInstitucionalView
                formatos={
                  formatos
                }
                isAdmin={
                  isAdmin
                }
                onOpenAddModal={() =>
                  setIsAddDocOpen(
                    true
                  )
                }
                onEditFormato={
                  setDocumentoEditando
                }
                onDeleteFormato={
                  handleDeleteDocument
                }
              />
            )}
          </>
        )}


        {/* FORMATOS */}

        {activeTab ===
          'documentos' && (
          <>
            {documentosLoading ? (
              <LoadingBox
                text="Cargando formatos y plantillas..."
              />
            ) : (
              <DocumentosView
                formatos={
                  formatos
                }
                isAdmin={
                  isAdmin
                }
                onOpenAddModal={() =>
                  setIsAddDocOpen(
                    true
                  )
                }
                onEditFormato={
                  setDocumentoEditando
                }
                onDeleteFormato={
                  handleDeleteDocument
                }
              />
            )}
          </>
        )}


        {/* COMUNICADOS */}

        {activeTab ===
          'comunicados' && (
          <ComunicadosView
            comunicados={
              comunicados
            }
            isAdmin={
              isAdmin
            }
            onOpenAddModal={() =>
              setIsAddComunicadoOpen(
                true
              )
            }
            onSelectComunicado={
              setSelectedComunicado
            }
            onDeleteComunicado={
              handleDeleteComunicado
            }
          />
        )}


        {/* REGLAMENTOS */}

        {activeTab ===
          'reglamentos' && (
          <>
            {reglamentosLoading ? (
              <LoadingBox
                text="Cargando reglamentos..."
              />
            ) : (
              <ReglamentosView
                reglamentos={
                  reglamentos
                }
                isAdmin={
                  isAdmin
                }
                onOpenDriveLink={(
                  url
                ) =>
                  window.open(
                    url,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                onAddReglamento={
                  handleOpenAddReglamento
                }
                onEditReglamento={
                  handleOpenEditReglamento
                }
                onDeleteReglamento={
                  handleDeleteReglamento
                }
              />
            )}
          </>
        )}


        {/* AGENDA */}

        {activeTab ===
          'agenda' && (
          <AgendaView
            eventos={
              eventos
            }
            googleConfig={
              googleConfig
            }
            isAdmin={
              isAdmin
            }
            onOpenAddEventModal={() =>
              setIsAddEventOpen(
                true
              )
            }
            onUpdateGoogleConfig={
              setGoogleConfig
            }
            onDeleteEvent={
              handleDeleteEvent
            }
          />
        )}

      </main>


      {/* FOOTER */}

      <Footer
        isAdmin={
          isAdmin
        }
        setIsAdmin={
          setIsAdmin
        }
        onOpenAdminModal={() =>
          setIsAdminLoginOpen(
            true
          )
        }
        onOpenAdminPanel={() =>
          setActiveTab(
            'admin'
          )
        }
      />


      {/* LOGIN ADMIN */}

      <AdminLoginModal
        isOpen={
          isAdminLoginOpen
        }
        onClose={() =>
          setIsAdminLoginOpen(
            false
          )
        }
        onSuccess={() => {
          if (
            currentUserRole ===
            'admin'
          ) {
            setIsAdmin(
              true
            );

            setActiveTab(
              'admin'
            );
          }

          setIsAdminLoginOpen(
            false
          );
        }}
      />


      {/* AGREGAR DOCUMENTO */}

      <AddDocumentModal
        isOpen={
          isAddDocOpen
        }
        onClose={() =>
          setIsAddDocOpen(
            false
          )
        }
        onAdd={
          handleAddDocument
        }
      />


      {/* EDITAR DOCUMENTO */}

      <EditDocumentModal
        isOpen={
          !!documentoEditando
        }
        documento={
          documentoEditando
        }
        onClose={() =>
          setDocumentoEditando(
            null
          )
        }
        onSave={
          handleEditDocument
        }
      />


      {/* EDITAR REGLAMENTO */}

      <EditReglamentoModal
        isOpen={
          isEditReglamentoOpen
        }
        reglamento={
          reglamentoEditando
        }
        onClose={() => {
          setIsEditReglamentoOpen(
            false
          );

          setReglamentoEditando(
            null
          );
        }}
        onSave={
          handleSaveReglamento
        }
      />


      {/* AGREGAR COMUNICADO */}

      <AddComunicadoModal
        isOpen={
          isAddComunicadoOpen
        }
        onClose={() =>
          setIsAddComunicadoOpen(
            false
          )
        }
        onAdd={
          handleAddComunicado
        }
      />


      {/* AGREGAR EVENTO */}

      <AddEventModal
        isOpen={
          isAddEventOpen
        }
        onClose={() =>
          setIsAddEventOpen(
            false
          )
        }
        onAdd={
          handleAddEvent
        }
      />


      {/* DETALLE COMUNICADO */}

      <ComunicadoDetailModal
        comunicado={
          selectedComunicado
        }
        onClose={() =>
          setSelectedComunicado(
            null
          )
        }
      />

    </div>
  );
}


// =========================================================
// CAJA DE CARGA
// =========================================================

const LoadingBox = ({
  text,
}: {
  text: string;
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

      <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center mx-auto mb-3 font-black">
        CdR
      </div>

      <p className="text-xs font-bold text-[#234156]">
        {text}
      </p>

    </div>
  );
};