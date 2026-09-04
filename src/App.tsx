import React, {
  useEffect,
  useState,
} from 'react';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DocumentacionInstitucionalView } from './components/DocumentacionInstitucionalView';
import { DocumentosView } from './components/DocumentosView';
import { ComunicadosView } from './components/ComunicadosView';
import { ReglamentosView } from './components/ReglamentosView';
import { AdminPanelView } from './components/AdminPanelView';
import { Footer } from './components/Footer';

import { EmployeeLogin } from './components/EmployeeLogin';
import { ResetPassword } from './components/ResetPassword';

import { AddDocumentModal } from './components/AddDocumentModal';
import { EditDocumentModal } from './components/EditDocumentModal';
import { EditReglamentoModal } from './components/EditReglamentoModal';
import { AddComunicadoModal } from './components/AddComunicadoModal';
import { EditComunicadoModal } from './components/EditComunicadoModal';
import { ComunicadoDetailModal } from './components/ComunicadoDetailModal';

import { supabase } from './lib/supabase';

import {
  FormatoDocumento,
  Comunicado,
  ComunicadoCategory,
  ComunicadoMedia,
  ComunicadoMediaType,
  Reglamento,
  ReglamentoSection,
  CategoryType,
  FileType,
  AuthorizedUser,
  AuthorizedUserRole,
} from './types';


type AuthFlowMode =
  | 'recovery'
  | 'invite'
  | null;


export default function App() {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<string>(
      'inicio'
    );


  // =========================================================
  // ACCESO Y ROLES
  // =========================================================

  const [
    adminModeEnabled,
    setAdminModeEnabled,
  ] = useState(false);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

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
    'admin' |
    'employee' |
    ''
  >('');

  const [
    authFlowMode,
    setAuthFlowMode,
  ] =
    useState<AuthFlowMode>(
      null
    );


  // =========================================================
  // PERMISO ADMIN VS MODO ADMIN
  // =========================================================

  const canUseAdminPanel =
    currentUserRole ===
    'admin';

  const isAdmin =
    canUseAdminPanel &&
    adminModeEnabled;


  // =========================================================
  // USUARIOS AUTORIZADOS
  // =========================================================

  const [
    authorizedUsers,
    setAuthorizedUsers,
  ] =
    useState<
      AuthorizedUser[]
    >([]);

  const [
    authorizedUsersLoading,
    setAuthorizedUsersLoading,
  ] = useState(false);


  // =========================================================
  // DOCUMENTOS
  // =========================================================

  const [
    formatos,
    setFormatos,
  ] =
    useState<
      FormatoDocumento[]
    >([]);

  const [
    documentosLoading,
    setDocumentosLoading,
  ] = useState(false);


  // =========================================================
  // COMUNICADOS
  // =========================================================

  const [
    comunicados,
    setComunicados,
  ] =
    useState<
      Comunicado[]
    >([]);

  const [
    comunicadosLoading,
    setComunicadosLoading,
  ] = useState(false);


  // =========================================================
  // REGLAMENTOS
  // =========================================================

  const [
    reglamentos,
    setReglamentos,
  ] =
    useState<
      Reglamento[]
    >([]);

  const [
    reglamentosLoading,
    setReglamentosLoading,
  ] = useState(false);


  // =========================================================
  // VERIFICAR EMPLEADO
  // =========================================================

  const verifyEmployee =
    async (
      email?:
        string |
        null
    ) => {

      if (!email) {
        setEmployeeAuthorized(
          false
        );

        setCurrentUserEmail(
          ''
        );

        setCurrentUserRole(
          ''
        );

        setAdminModeEnabled(
          false
        );

        setAuthLoading(
          false
        );

        return;
      }


      const normalizedEmail =
        email
          .trim()
          .toLowerCase();


      const validDomain =
        normalizedEmail
          .endsWith(
            '@consejoderedaccion.org'
          ) ||
        normalizedEmail
          .endsWith(
            '@colombiacheck.org'
          );


      if (
        !validDomain
      ) {
        await supabase.auth
          .signOut();

        setEmployeeAuthorized(
          false
        );

        setCurrentUserEmail(
          ''
        );

        setCurrentUserRole(
          ''
        );

        setAdminModeEnabled(
          false
        );

        setAuthLoading(
          false
        );

        return;
      }


      const {
        data,
        error,
      } =
        await supabase
          .from(
            'authorized_users'
          )
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
        await supabase.auth
          .signOut();

        setEmployeeAuthorized(
          false
        );

        setCurrentUserEmail(
          ''
        );

        setCurrentUserRole(
          ''
        );

        setAdminModeEnabled(
          false
        );

        setAuthLoading(
          false
        );

        return;
      }


      const role =
        data.role ===
        'admin'
          ? 'admin'
          : 'employee';


      setEmployeeAuthorized(
        true
      );

      setCurrentUserEmail(
        normalizedEmail
      );

      setCurrentUserRole(
        role
      );


      if (
        role !==
        'admin'
      ) {
        setAdminModeEnabled(
          false
        );
      }


      setAuthLoading(
        false
      );
    };


  // =========================================================
  // DETECTAR RECUPERACIÓN O INVITACIÓN
  // =========================================================

  const detectAuthFlowFromUrl =
    (): AuthFlowMode => {

      const hash =
        window.location.hash ||
        '';

      const search =
        window.location.search ||
        '';

      const hashParams =
        new URLSearchParams(
          hash.startsWith(
            '#'
          )
            ? hash.substring(
                1
              )
            : hash
        );

      const searchParams =
        new URLSearchParams(
          search
        );


      const hashType =
        hashParams.get(
          'type'
        );

      const searchType =
        searchParams.get(
          'type'
        );


      if (
        hashType ===
          'recovery' ||
        searchType ===
          'recovery' ||
        searchParams.get(
          'recovery'
        ) ===
          '1'
      ) {
        return 'recovery';
      }


      if (
        hashType ===
          'invite' ||
        searchType ===
          'invite' ||
        searchParams.get(
          'invite'
        ) ===
          '1'
      ) {
        return 'invite';
      }


      return null;
    };


  // =========================================================
  // SESIÓN
  // =========================================================

  useEffect(
    () => {
      let mounted =
        true;


      const initialFlow =
        detectAuthFlowFromUrl();


      if (
        initialFlow
      ) {
        setAuthFlowMode(
          initialFlow
        );

        setEmployeeAuthorized(
          false
        );

        setAdminModeEnabled(
          false
        );

        setAuthLoading(
          false
        );
      }


      const {
        data: {
          subscription,
        },
      } =
        supabase.auth
          .onAuthStateChange(
            (
              event,
              session
            ) => {

              if (
                !mounted
              ) {
                return;
              }


              if (
                event ===
                'PASSWORD_RECOVERY'
              ) {
                setAuthFlowMode(
                  'recovery'
                );

                setEmployeeAuthorized(
                  false
                );

                setAdminModeEnabled(
                  false
                );

                setAuthLoading(
                  false
                );

                return;
              }


              const currentFlow =
                detectAuthFlowFromUrl();


              if (
                currentFlow
              ) {
                setAuthFlowMode(
                  currentFlow
                );

                setEmployeeAuthorized(
                  false
                );

                setAdminModeEnabled(
                  false
                );

                setAuthLoading(
                  false
                );

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

                setAdminModeEnabled(
                  false
                );

                setAuthLoading(
                  false
                );

                return;
              }


              verifyEmployee(
                session?.user
                  ?.email
              );
            }
          );


      const checkInitialSession =
        async () => {

          const urlFlow =
            detectAuthFlowFromUrl();


          if (
            urlFlow
          ) {
            setAuthFlowMode(
              urlFlow
            );

            setEmployeeAuthorized(
              false
            );

            setAdminModeEnabled(
              false
            );

            setAuthLoading(
              false
            );

            return;
          }


          const {
            data: {
              session,
            },
          } =
            await supabase.auth
              .getSession();


          if (
            !mounted
          ) {
            return;
          }


          const flowAfterSession =
            detectAuthFlowFromUrl();


          if (
            flowAfterSession
          ) {
            setAuthFlowMode(
              flowAfterSession
            );

            setEmployeeAuthorized(
              false
            );

            setAdminModeEnabled(
              false
            );

            setAuthLoading(
              false
            );

            return;
          }


          await verifyEmployee(
            session?.user
              ?.email
          );
        };


      checkInitialSession();


      return () => {
        mounted =
          false;

        subscription
          .unsubscribe();
      };
    },
    []
  );


  // =========================================================
  // PROTEGER PANEL ADMIN
  // =========================================================

  useEffect(
    () => {
      if (
        activeTab ===
          'admin' &&
        !isAdmin
      ) {
        setActiveTab(
          'inicio'
        );
      }
    },
    [
      activeTab,
      isAdmin,
    ]
  );


  // =========================================================
  // CERRAR SESIÓN
  // =========================================================

  const handleEmployeeLogout =
    async () => {

      await supabase.auth
        .signOut();

      setEmployeeAuthorized(
        false
      );

      setCurrentUserEmail(
        ''
      );

      setCurrentUserRole(
        ''
      );

      setAdminModeEnabled(
        false
      );

      setFormatos(
        []
      );

      setComunicados(
        []
      );

      setReglamentos(
        []
      );

      setAuthorizedUsers(
        []
      );

      setActiveTab(
        'inicio'
      );
    };


  // =========================================================
  // CARGAR USUARIOS
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
      } =
        await supabase
          .from(
            'authorized_users'
          )
          .select(
            'id, email, name, role, active, created_at'
          )
          .order(
            'name',
            {
              ascending:
                true,
            }
          );


      if (
        error
      ) {
        console.error(
          'Error cargando usuarios autorizados:',
          error
        );

        setAuthorizedUsers(
          []
        );

        setAuthorizedUsersLoading(
          false
        );

        return;
      }


      const mappedUsers:
        AuthorizedUser[] =
        (
          data ||
          []
        ).map(
          (
            user
          ) => ({
            id:
              user.id,

            email:
              user.email ||
              '',

            name:
              user.name ||
              '',

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
  // AGREGAR USUARIO
  // =========================================================

  const handleAddAuthorizedUser =
    async (
      user: {
        name: string;
        email: string;
        role:
          AuthorizedUserRole;
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

      const normalizedName =
        user.name
          .trim();


      if (
        !normalizedName
      ) {
        alert(
          'Debes ingresar el nombre del usuario.'
        );

        return false;
      }


      const validDomain =
        normalizedEmail
          .endsWith(
            '@consejoderedaccion.org'
          ) ||
        normalizedEmail
          .endsWith(
            '@colombiacheck.org'
          );


      if (
        !validDomain
      ) {
        alert(
          'El correo debe pertenecer a @consejoderedaccion.org o @colombiacheck.org.'
        );

        return false;
      }


      const existingUser =
        authorizedUsers
          .find(
            (
              existing
            ) =>
              existing.email
                .trim()
                .toLowerCase() ===
              normalizedEmail
          );


      if (
        existingUser
      ) {
        alert(
          'Este correo ya está registrado en Usuarios y Accesos.'
        );

        return false;
      }


      try {
        const {
          data,
          error,
        } =
          await supabase
            .functions
            .invoke(
              'invite-user',
              {
                body: {
                  name:
                    normalizedName,

                  email:
                    normalizedEmail,

                  role:
                    user.role,
                },
              }
            );


        if (
          error
        ) {
          console.error(
            'Error ejecutando invite-user:',
            error
          );

          alert(
            `No fue posible crear la invitación.\n\n${error.message}`
          );

          return false;
        }


        if (
          !data ||
          data.ok !==
            true
        ) {
          console.error(
            'invite-user respondió con error:',
            data
          );

          alert(
            data?.message ||
            'No fue posible invitar al usuario.'
          );

          return false;
        }


        await loadAuthorizedUsers();


        alert(
          `Usuario agregado correctamente.\n\nSe envió una invitación a:\n${normalizedEmail}\n\nEl usuario deberá abrir el correo y configurar su contraseña.`
        );


        return true;

      } catch (
        error
      ) {
        console.error(
          'Error inesperado agregando usuario:',
          error
        );

        alert(
          'Ocurrió un error inesperado al agregar el usuario.'
        );

        return false;
      }
    };


  // =========================================================
  // EDITAR USUARIO
  // =========================================================

  const handleUpdateAuthorizedUser =
    async (
      user:
        AuthorizedUser
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
        normalizedEmail
          .endsWith(
            '@consejoderedaccion.org'
          ) ||
        normalizedEmail
          .endsWith(
            '@colombiacheck.org'
          );


      if (
        !validDomain
      ) {
        alert(
          'El correo debe pertenecer a @consejoderedaccion.org o @colombiacheck.org.'
        );

        return false;
      }


      const {
        error,
      } =
        await supabase
          .from(
            'authorized_users'
          )
          .update({
            email:
              normalizedEmail,

            name:
              user.name
                .trim(),

            role:
              user.role,

            active:
              user.active,
          })
          .eq(
            'id',
            user.id
          );


      if (
        error
      ) {
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
      user:
        AuthorizedUser
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
      } =
        await supabase
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


      if (
        error
      ) {
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
  // ELIMINAR USUARIO
  // =========================================================

  const handleDeleteAuthorizedUser =
    async (
      user:
        AuthorizedUser
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


      if (
        !confirmed
      ) {
        return;
      }


      const {
        error,
      } =
        await supabase
          .from(
            'authorized_users'
          )
          .delete()
          .eq(
            'id',
            user.id
          );


      if (
        error
      ) {
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
  // RESTABLECER CONTRASEÑA
  // =========================================================

  const handleResetUserPassword =
    async (
      user:
        AuthorizedUser
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


      if (
        !normalizedEmail
      ) {
        alert(
          'Este usuario no tiene un correo electrónico válido.'
        );

        return false;
      }


      const confirmed =
        window.confirm(
          `¿Deseas enviar un enlace para restablecer la contraseña de ${user.name || normalizedEmail}?\n\nEl correo será enviado a:\n${normalizedEmail}`
        );


      if (
        !confirmed
      ) {
        return false;
      }


      const redirectUrl =
        `${window.location.origin}/?recovery=1`;


      const {
        error,
      } =
        await supabase.auth
          .resetPasswordForEmail(
            normalizedEmail,
            {
              redirectTo:
                redirectUrl,
            }
          );


      if (
        error
      ) {
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
        `Correo de recuperación solicitado correctamente.\n\nDestino:\n${normalizedEmail}`
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
      } =
        await supabase
          .from(
            'documentos'
          )
          .select(
            '*'
          )
          .eq(
            'active',
            true
          )
          .order(
            'id',
            {
              ascending:
                true,
            }
          );


      if (
        error
      ) {
        console.error(
          'Error cargando documentos:',
          error
        );

        setFormatos(
          []
        );

        setDocumentosLoading(
          false
        );

        return;
      }


      const mappedDocumentos:
        FormatoDocumento[] =
        (
          data ||
          []
        ).map(
          (
            doc
          ) => ({
            id:
              doc.id,

            title:
              doc.title ||
              '',

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
  // CARGAR COMUNICADOS + MULTIMEDIA
  // =========================================================

  const loadComunicados =
    async () => {

      setComunicadosLoading(
        true
      );


      const {
        data:
          comunicadosData,
        error:
          comunicadosError,
      } =
        await supabase
          .from(
            'comunicados'
          )
          .select(
            '*'
          )
          .eq(
            'active',
            true
          )
          .order(
            'pinned',
            {
              ascending:
                false,
            }
          )
          .order(
            'published_at',
            {
              ascending:
                false,
            }
          );


      if (
        comunicadosError
      ) {
        console.error(
          'Error cargando comunicados:',
          comunicadosError
        );

        setComunicados(
          []
        );

        setComunicadosLoading(
          false
        );

        return;
      }


      const {
        data:
          mediaData,
        error:
          mediaError,
      } =
        await supabase
          .from(
            'comunicado_media'
          )
          .select(
            'id, comunicado_id, media_type, name, url, sort_order'
          )
          .order(
            'sort_order',
            {
              ascending:
                true,
            }
          );


      if (
        mediaError
      ) {
        console.error(
          'Error cargando multimedia de comunicados:',
          mediaError
        );
      }


      const mappedComunicados:
        Comunicado[] =
        (
          comunicadosData ||
          []
        ).map(
          (
            com
          ) => {

            const attachments =
              (
                com.attachment_name ||
                com.attachment_url
              )
                ? [
                    {
                      name:
                        com.attachment_name ||
                        'Documento adjunto',

                      url:
                        com.attachment_url ||
                        '',

                      type:
                        com.attachment_type ||
                        'document',
                    },
                  ]
                : undefined;


            const media:
              ComunicadoMedia[] =
              (
                mediaData ||
                []
              )
                .filter(
                  (
                    item
                  ) =>
                    item.comunicado_id ===
                    com.id
                )
                .map(
                  (
                    item
                  ) => ({
                    id:
                      item.id,

                    comunicadoId:
                      item.comunicado_id,

                    mediaType:
                      (
                        item.media_type ||
                        'link'
                      ) as ComunicadoMediaType,

                    name:
                      item.name ||
                      '',

                    url:
                      item.url ||
                      '',

                    sortOrder:
                      item.sort_order ??
                      0,
                  })
                );


            return {
              id:
                com.id,

              title:
                com.title ||
                '',

              category:
                (
                  com.category ||
                  'Institucional'
                ) as ComunicadoCategory,

              summary:
                com.summary ||
                '',

              content:
                com.content ||
                '',

              date:
                com.published_at
                  ? new Date(
                      com.published_at
                    )
                      .toISOString()
                      .split(
                        'T'
                      )[0]
                  : '',

              author:
                com.author ||
                '',

              authorRole:
                com.author_role ||
                '',

              pinned:
                Boolean(
                  com.pinned
                ),

              attachments,

              media,
            };
          }
        );


      setComunicados(
        mappedComunicados
      );

      setComunicadosLoading(
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
      } =
        await supabase
          .from(
            'reglamentos'
          )
          .select(
            '*'
          )
          .eq(
            'active',
            true
          )
          .order(
            'id',
            {
              ascending:
                true,
            }
          );


      if (
        reglamentosError
      ) {
        console.error(
          'Error cargando reglamentos:',
          reglamentosError
        );

        setReglamentos(
          []
        );

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
      } =
        await supabase
          .from(
            'reglamento_sections'
          )
          .select(
            '*'
          )
          .eq(
            'active',
            true
          )
          .order(
            'sort_order',
            {
              ascending:
                true,
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


      const mappedReglamentos:
        Reglamento[] =
        (
          reglamentosData ||
          []
        ).map(
          (
            reg
          ) => {

            const sections:
              ReglamentoSection[] =
              (
                sectionsData ||
                []
              )
                .filter(
                  (
                    section
                  ) =>
                    section.reglamento_id ===
                    reg.id
                )
                .map(
                  (
                    section
                  ) => ({
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
          }
        );


      setReglamentos(
        mappedReglamentos
      );

      setReglamentosLoading(
        false
      );
    };


  // =========================================================
  // CARGAR DATOS TRAS LOGIN
  // =========================================================

  useEffect(
    () => {

      if (
        employeeAuthorized &&
        authFlowMode ===
          null
      ) {
        loadDocumentos();

        loadComunicados();

        loadReglamentos();


        if (
          currentUserRole ===
          'admin'
        ) {
          loadAuthorizedUsers();
        }
      }

    },
    [
      employeeAuthorized,
      currentUserRole,
      authFlowMode,
    ]
  );


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
    documentoEditando,
    setDocumentoEditando,
  ] =
    useState<
      FormatoDocumento |
      null
    >(null);

  const [
    reglamentoEditando,
    setReglamentoEditando,
  ] =
    useState<
      Reglamento |
      null
    >(null);

  const [
    isEditReglamentoOpen,
    setIsEditReglamentoOpen,
  ] = useState(false);

  const [
    comunicadoEditando,
    setComunicadoEditando,
  ] =
    useState<
      Comunicado |
      null
    >(null);

  const [
    selectedComunicado,
    setSelectedComunicado,
  ] =
    useState<
      Comunicado |
      null
    >(null);


  // =========================================================
  // DOCUMENTOS - AGREGAR
  // =========================================================

  const handleAddDocument =
    async (
      newDoc:
        FormatoDocumento
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
      } =
        await supabase
          .from(
            'documentos'
          )
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


      if (
        error
      ) {
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
      } =
        await supabase
          .from(
            'documentos'
          )
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


      if (
        error
      ) {
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
        number |
        string
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


      if (
        !confirmed
      ) {
        return;
      }


      const {
        error,
      } =
        await supabase
          .from(
            'documentos'
          )
          .delete()
          .eq(
            'id',
            Number(
              id
            )
          );


      if (
        error
      ) {
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
  // COMUNICADOS - AGREGAR
  // =========================================================

  const handleAddComunicado =
    async (
      newCom:
        Comunicado
    ) => {

      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede publicar comunicados.'
        );

        return;
      }


      const firstAttachment =
        newCom.attachments?.[0];


      const {
        data:
          comunicadoCreado,
        error:
          comunicadoError,
      } =
        await supabase
          .from(
            'comunicados'
          )
          .insert({
            title:
              newCom.title,

            category:
              newCom.category,

            summary:
              newCom.summary,

            content:
              newCom.content,

            author:
              newCom.author,

            author_role:
              newCom.authorRole,

            pinned:
              newCom.pinned,

            attachment_name:
              firstAttachment?.name ||
              null,

            attachment_url:
              firstAttachment?.url ||
              null,

            attachment_type:
              firstAttachment?.type ||
              null,

            published_at:
              newCom.date
                ? new Date(
                    `${newCom.date}T12:00:00`
                  ).toISOString()
                : new Date()
                    .toISOString(),

            active:
              true,
          })
          .select(
            'id'
          )
          .single();


      if (
        comunicadoError ||
        !comunicadoCreado
      ) {
        console.error(
          'Error publicando comunicado:',
          comunicadoError
        );

        throw new Error(
          'No fue posible publicar el comunicado.'
        );
      }


      const comunicadoId =
        comunicadoCreado.id;


      const validMedia =
        (
          newCom.media ||
          []
        ).filter(
          (
            item
          ) =>
            item.name
              .trim() &&
            item.url
              .trim()
        );


      if (
        validMedia.length >
        0
      ) {
        const mediaToInsert =
          validMedia.map(
            (
              item,
              index
            ) => ({
              comunicado_id:
                comunicadoId,

              media_type:
                item.mediaType,

              name:
                item.name
                  .trim(),

              url:
                item.url
                  .trim(),

              sort_order:
                item.sortOrder ??
                index,
            })
          );


        const {
          error:
            mediaInsertError,
        } =
          await supabase
            .from(
              'comunicado_media'
            )
            .insert(
              mediaToInsert
            );


        if (
          mediaInsertError
        ) {
          console.error(
            'Error guardando multimedia:',
            mediaInsertError
          );


          await supabase
            .from(
              'comunicados'
            )
            .delete()
            .eq(
              'id',
              comunicadoId
            );


          throw new Error(
            'No fue posible guardar los recursos multimedia.'
          );
        }
      }


      setIsAddComunicadoOpen(
        false
      );

      await loadComunicados();
    };


  // =========================================================
  // COMUNICADOS - EDITAR
  // =========================================================

  const handleEditComunicado =
    (
      comunicado:
        Comunicado
    ) => {

      setComunicadoEditando(
        comunicado
      );

      setSelectedComunicado(
        null
      );
    };


  // =========================================================
  // COMUNICADOS - GUARDAR EDICIÓN
  // =========================================================

  const handleSaveComunicado =
    async (
      comunicadoActualizado:
        Comunicado
    ) => {

      if (
        currentUserRole !==
        'admin'
      ) {
        throw new Error(
          'No tienes permisos para editar comunicados.'
        );
      }


      const comunicadoId =
        comunicadoActualizado.id;


      const previousMedia =
        comunicadoEditando
          ?.media ||
        [];


      const {
        error:
          comunicadoUpdateError,
      } =
        await supabase
          .from(
            'comunicados'
          )
          .update({
            title:
              comunicadoActualizado.title,

            category:
              comunicadoActualizado.category,

            summary:
              comunicadoActualizado.summary,

            content:
              comunicadoActualizado.content,

            author:
              comunicadoActualizado.author,

            author_role:
              comunicadoActualizado.authorRole,

            pinned:
              comunicadoActualizado.pinned,

            attachment_name:
              null,

            attachment_url:
              null,

            attachment_type:
              null,

            active:
              true,
          })
          .eq(
            'id',
            comunicadoId
          );


      if (
        comunicadoUpdateError
      ) {
        console.error(
          'Error actualizando comunicado:',
          comunicadoUpdateError
        );

        throw comunicadoUpdateError;
      }


      const {
        error:
          deleteMediaError,
      } =
        await supabase
          .from(
            'comunicado_media'
          )
          .delete()
          .eq(
            'comunicado_id',
            comunicadoId
          );


      if (
        deleteMediaError
      ) {
        console.error(
          'Error eliminando multimedia anterior:',
          deleteMediaError
        );

        throw deleteMediaError;
      }


      const validMedia =
        (
          comunicadoActualizado.media ||
          []
        ).filter(
          (
            item
          ) =>
            item.name
              .trim() &&
            item.url
              .trim()
        );


      if (
        validMedia.length >
        0
      ) {
        const mediaToInsert =
          validMedia.map(
            (
              item,
              index
            ) => ({
              comunicado_id:
                comunicadoId,

              media_type:
                item.mediaType,

              name:
                item.name
                  .trim(),

              url:
                item.url
                  .trim(),

              sort_order:
                item.sortOrder ??
                index,
            })
          );


        const {
          error:
            insertMediaError,
        } =
          await supabase
            .from(
              'comunicado_media'
            )
            .insert(
              mediaToInsert
            );


        if (
          insertMediaError
        ) {
          console.error(
            'Error insertando multimedia actualizada:',
            insertMediaError
          );


          if (
            previousMedia.length >
            0
          ) {
            const restoreMedia =
              previousMedia
                .filter(
                  (
                    item
                  ) =>
                    item.name
                      .trim() &&
                    item.url
                      .trim()
                )
                .map(
                  (
                    item,
                    index
                  ) => ({
                    comunicado_id:
                      comunicadoId,

                    media_type:
                      item.mediaType,

                    name:
                      item.name
                        .trim(),

                    url:
                      item.url
                        .trim(),

                    sort_order:
                      item.sortOrder ??
                      index,
                  })
                );


            if (
              restoreMedia.length >
              0
            ) {
              await supabase
                .from(
                  'comunicado_media'
                )
                .insert(
                  restoreMedia
                );
            }
          }


          throw insertMediaError;
        }
      }


      setComunicadoEditando(
        null
      );


      await loadComunicados();
    };


  // =========================================================
  // COMUNICADOS - ELIMINAR
  // =========================================================

  const handleDeleteComunicado =
    async (
      id:
        string
    ) => {

      if (
        currentUserRole !==
        'admin'
      ) {
        alert(
          'Solo un administrador puede eliminar comunicados.'
        );

        return;
      }


      const confirmed =
        window.confirm(
          '¿Seguro que deseas eliminar este comunicado?'
        );


      if (
        !confirmed
      ) {
        return;
      }


      const {
        error,
      } =
        await supabase
          .from(
            'comunicados'
          )
          .delete()
          .eq(
            'id',
            id
          );


      if (
        error
      ) {
        console.error(
          'Error eliminando comunicado:',
          error
        );

        alert(
          'No fue posible eliminar el comunicado.'
        );

        return;
      }


      if (
        selectedComunicado
          ?.id ===
        id
      ) {
        setSelectedComunicado(
          null
        );
      }


      if (
        comunicadoEditando
          ?.id ===
        id
      ) {
        setComunicadoEditando(
          null
        );
      }


      await loadComunicados();
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
        reglamento.id
          .startsWith(
            'temp-'
          );


      let reglamentoId:
        number;


      if (
        isNew
      ) {
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


        if (
          error
        ) {
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
        reglamento.sections
          .length >
        0
      ) {
        const sectionsToInsert =
          reglamento.sections
            .map(
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
                  index +
                  1,

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
        number |
        string
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


      if (
        !confirmed
      ) {
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
            Number(
              id
            )
          );


      if (
        error
      ) {
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
  // RECUPERACIÓN / INVITACIÓN
  // =========================================================

  if (
    authFlowMode
  ) {
    return (
      <ResetPassword
        mode={
          authFlowMode
        }
        onSuccess={() => {

          setAuthFlowMode(
            null
          );

          setEmployeeAuthorized(
            false
          );

          setCurrentUserEmail(
            ''
          );

          setCurrentUserRole(
            ''
          );

          setAdminModeEnabled(
            false
          );

          setActiveTab(
            'inicio'
          );

          window.history
            .replaceState(
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
    <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans">


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


      {/* ===================================================== */}
      {/* BARRA DE SESIÓN */}
      {/* ===================================================== */}

      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 lg:px-10 py-2 shrink-0">

        <div className="w-full max-w-7xl mx-auto flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end lg:gap-3 text-[10px] text-slate-500">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:gap-3 min-w-0">

            <span className="min-w-0 truncate">
              Sesión:{' '}

              <strong className="break-all sm:break-normal">
                {
                  currentUserEmail
                }
              </strong>
            </span>


            <button
              type="button"
              onClick={
                handleEmployeeLogout
              }
              className="font-bold text-red-600 hover:text-red-800 whitespace-nowrap shrink-0"
            >
              Cerrar sesión
            </button>

          </div>


          {canUseAdminPanel && (
            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">

              <span className="bg-amber-100 text-amber-900 border border-amber-200 font-bold px-2 py-1 rounded-md whitespace-nowrap">
                Administrador
              </span>


              <span
                className={`font-bold px-2 py-1 rounded-md border whitespace-nowrap ${
                  adminModeEnabled
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {
                  adminModeEnabled
                    ? 'Modo admin activo'
                    : 'Modo admin inactivo'
                }
              </span>

            </div>
          )}

        </div>

      </div>


      {/* ===================================================== */}
      {/* CONTENIDO */}
      {/* ===================================================== */}

      <main className="flex-grow p-4 md:p-8">


        {/* =================================================== */}
        {/* INICIO */}
        {/* =================================================== */}

        {activeTab ===
          'inicio' && (
          <DashboardView
            formatos={
              formatos
            }
            comunicados={
              comunicados
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
            onOpenComunicadoDetail={
              setSelectedComunicado
            }
          />
        )}


        {/* =================================================== */}
        {/* ADMINISTRACIÓN */}
        {/* =================================================== */}

        {activeTab ===
          'admin' &&
          isAdmin && (
          <AdminPanelView
            formatos={
              formatos
            }

            comunicados={
              comunicados
            }

            comunicadosLoading={
              comunicadosLoading
            }

            reglamentos={
              reglamentos
            }

            reglamentosLoading={
              reglamentosLoading
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

            onAddComunicado={() =>
              setIsAddComunicadoOpen(
                true
              )
            }

            onEditComunicado={
              handleEditComunicado
            }

            onDeleteComunicado={
              handleDeleteComunicado
            }

            onReloadComunicados={
              loadComunicados
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

            onReloadReglamentos={
              loadReglamentos
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


        {/* =================================================== */}
        {/* DOCUMENTACIÓN INSTITUCIONAL */}
        {/* =================================================== */}

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


        {/* =================================================== */}
        {/* FORMATOS */}
        {/* =================================================== */}

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


        {/* =================================================== */}
        {/* COMUNICADOS */}
        {/* =================================================== */}

        {activeTab ===
          'comunicados' && (
          <>
            {comunicadosLoading ? (
              <LoadingBox
                text="Cargando comunicados..."
              />
            ) : (
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
          </>
        )}


        {/* =================================================== */}
        {/* REGLAMENTOS */}
        {/* =================================================== */}

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

      </main>


      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <Footer
        canUseAdminPanel={
          canUseAdminPanel
        }

        adminModeEnabled={
          adminModeEnabled
        }

        onEnableAdminMode={() => {
          setAdminModeEnabled(
            true
          );
        }}

        onDisableAdminMode={() => {

          setAdminModeEnabled(
            false
          );

          if (
            activeTab ===
            'admin'
          ) {
            setActiveTab(
              'inicio'
            );
          }
        }}

        onOpenAdminPanel={() =>
          setActiveTab(
            'admin'
          )
        }
      />


      {/* ===================================================== */}
      {/* MODAL AGREGAR DOCUMENTO */}
      {/* ===================================================== */}

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


      {/* ===================================================== */}
      {/* MODAL EDITAR DOCUMENTO */}
      {/* ===================================================== */}

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


      {/* ===================================================== */}
      {/* MODAL REGLAMENTOS */}
      {/* ===================================================== */}

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


      {/* ===================================================== */}
      {/* MODAL AGREGAR COMUNICADO */}
      {/* ===================================================== */}

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


      {/* ===================================================== */}
      {/* MODAL EDITAR COMUNICADO */}
      {/* ===================================================== */}

      <EditComunicadoModal
        isOpen={
          !!comunicadoEditando
        }
        comunicado={
          comunicadoEditando
        }
        onClose={() =>
          setComunicadoEditando(
            null
          )
        }
        onSave={
          handleSaveComunicado
        }
      />


      {/* ===================================================== */}
      {/* DETALLE COMUNICADO */}
      {/* ===================================================== */}

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
        {
          text
        }
      </p>

    </div>
  );
};