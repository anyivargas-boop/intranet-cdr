import React, { useEffect, useState } from 'react';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DocumentosView } from './components/DocumentosView';
import { ComunicadosView } from './components/ComunicadosView';
import { ReglamentosView } from './components/ReglamentosView';
import { AgendaView } from './components/AgendaView';
import { DriveIntegrationView } from './components/DriveIntegrationView';
import { Footer } from './components/Footer';

import { EmployeeLogin } from './components/EmployeeLogin';

import { AddDocumentModal } from './components/AddDocumentModal';
import { EditDocumentModal } from './components/EditDocumentModal';
import { EditReglamentoModal } from './components/EditReglamentoModal';
import { AddComunicadoModal } from './components/AddComunicadoModal';
import { AddEventModal } from './components/AddEventModal';
import { ComunicadoDetailModal } from './components/ComunicadoDetailModal';
import { DriveViewerModal } from './components/DriveViewerModal';
import { AdminLoginModal } from './components/AdminLoginModal';

import { supabase } from './lib/supabase';

import {
  initialFormatos,
  initialComunicados,
  initialEventos,
  initialDriveFolders,
  initialGoogleConfig,
} from './data/initialData';

import {
  FormatoDocumento,
  Comunicado,
  Reglamento,
  ReglamentoSection,
  EventoAgenda,
  DriveFolder,
  GoogleIntegrationsConfig,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');

  // =========================================================
  // ACCESO Y ROLES
  // =========================================================

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [authLoading, setAuthLoading] = useState(true);
  const [employeeAuthorized, setEmployeeAuthorized] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  const [currentUserRole, setCurrentUserRole] = useState<
    'admin' | 'employee' | ''
  >('');

  // =========================================================
  // DATOS LOCALES EXISTENTES
  // =========================================================

  const [formatos, setFormatos] = useState<FormatoDocumento[]>(() => {
    const saved = localStorage.getItem('cdr_formatos');
    return saved ? JSON.parse(saved) : initialFormatos;
  });

  const [comunicados, setComunicados] = useState<Comunicado[]>(() => {
    const saved = localStorage.getItem('cdr_comunicados');
    return saved ? JSON.parse(saved) : initialComunicados;
  });

  // REGLAMENTOS AHORA VIENEN DE SUPABASE
  const [reglamentos, setReglamentos] = useState<Reglamento[]>([]);
  const [reglamentosLoading, setReglamentosLoading] = useState(false);

  const [eventos, setEventos] = useState<EventoAgenda[]>(() => {
    const saved = localStorage.getItem('cdr_eventos');
    return saved ? JSON.parse(saved) : initialEventos;
  });

  const [driveFolders, setDriveFolders] = useState<DriveFolder[]>(() => {
    const saved = localStorage.getItem('cdr_driveFolders');
    return saved ? JSON.parse(saved) : initialDriveFolders;
  });

  const [googleConfig, setGoogleConfig] =
    useState<GoogleIntegrationsConfig>(() => {
      const saved = localStorage.getItem('cdr_googleConfig');
      return saved ? JSON.parse(saved) : initialGoogleConfig;
    });

  // =========================================================
  // GUARDAR DATOS LOCALES
  // =========================================================

  useEffect(() => {
    localStorage.setItem('cdr_formatos', JSON.stringify(formatos));
  }, [formatos]);

  useEffect(() => {
    localStorage.setItem('cdr_comunicados', JSON.stringify(comunicados));
  }, [comunicados]);

  useEffect(() => {
    localStorage.setItem('cdr_eventos', JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    localStorage.setItem(
      'cdr_driveFolders',
      JSON.stringify(driveFolders)
    );
  }, [driveFolders]);

  useEffect(() => {
    localStorage.setItem(
      'cdr_googleConfig',
      JSON.stringify(googleConfig)
    );
  }, [googleConfig]);

  // =========================================================
  // VERIFICACIÓN DEL EMPLEADO
  // =========================================================

  const verifyEmployee = async (email?: string | null) => {
    if (!email) {
      setEmployeeAuthorized(false);
      setCurrentUserEmail('');
      setCurrentUserRole('');
      setIsAdmin(false);
      setAuthLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const validDomain =
      normalizedEmail.endsWith('@consejoderedaccion.org') ||
      normalizedEmail.endsWith('@colombiacheck.org');

    if (!validDomain) {
      await supabase.auth.signOut();

      setEmployeeAuthorized(false);
      setCurrentUserEmail('');
      setCurrentUserRole('');
      setIsAdmin(false);
      setAuthLoading(false);

      return;
    }

    const { data, error } = await supabase
      .from('authorized_users')
      .select('email, active, role')
      .eq('email', normalizedEmail)
      .eq('active', true)
      .maybeSingle();

    if (error || !data) {
      await supabase.auth.signOut();

      setEmployeeAuthorized(false);
      setCurrentUserEmail('');
      setCurrentUserRole('');
      setIsAdmin(false);
      setAuthLoading(false);

      return;
    }

    const role =
      data.role === 'admin' ? 'admin' : 'employee';

    setEmployeeAuthorized(true);
    setCurrentUserEmail(normalizedEmail);
    setCurrentUserRole(role);

    // Los usuarios con role=admin quedan habilitados
    // automáticamente para administrar.
    setIsAdmin(role === 'admin');

    setAuthLoading(false);
  };

  useEffect(() => {
    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await verifyEmployee(session?.user?.email);
    };

    checkInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      verifyEmployee(session?.user?.email);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleEmployeeLogout = async () => {
    await supabase.auth.signOut();

    setEmployeeAuthorized(false);
    setCurrentUserEmail('');
    setCurrentUserRole('');
    setIsAdmin(false);
    setReglamentos([]);

    setActiveTab('inicio');
  };

  // =========================================================
  // CARGAR REGLAMENTOS DESDE SUPABASE
  // =========================================================

  const loadReglamentos = async () => {
    setReglamentosLoading(true);

    const { data: reglamentosData, error: reglamentosError } =
      await supabase
        .from('reglamentos')
        .select('*')
        .eq('active', true)
        .order('id', { ascending: true });

    if (reglamentosError) {
      console.error(
        'Error cargando reglamentos:',
        reglamentosError
      );

      setReglamentos([]);
      setReglamentosLoading(false);
      return;
    }

    const { data: sectionsData, error: sectionsError } =
      await supabase
        .from('reglamento_sections')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

    if (sectionsError) {
      console.error(
        'Error cargando capítulos:',
        sectionsError
      );

      setReglamentosLoading(false);
      return;
    }

    const mappedReglamentos: Reglamento[] =
      (reglamentosData || []).map((reg) => {
        const sections: ReglamentoSection[] =
          (sectionsData || [])
            .filter(
              (section) =>
                section.reglamento_id === reg.id
            )
            .map((section) => ({
              id: section.id,
              title: section.title || '',
              content: section.content || '',
              sectionUrl: section.section_url || '',
              sortOrder: section.sort_order || 0,
            }));

        return {
          id: reg.id,
          title: reg.title || '',
          description: reg.description || '',
          category: reg.category || '',
          lastRevision: reg.last_revision || '',
          articlesCount: reg.articles_count || 0,
          driveLink: reg.drive_link || '',
          sections,
        };
      });

    setReglamentos(mappedReglamentos);
    setReglamentosLoading(false);
  };

  useEffect(() => {
    if (employeeAuthorized) {
      loadReglamentos();
    }
  }, [employeeAuthorized]);

  // =========================================================
  // MODALES
  // =========================================================

  const [isAddDocOpen, setIsAddDocOpen] = useState(false);

  const [isAddComunicadoOpen, setIsAddComunicadoOpen] =
    useState(false);

  const [isAddEventOpen, setIsAddEventOpen] =
    useState(false);

  const [isAdminLoginOpen, setIsAdminLoginOpen] =
    useState(false);

  const [documentoEditando, setDocumentoEditando] =
    useState<FormatoDocumento | null>(null);

  const [reglamentoEditando, setReglamentoEditando] =
    useState<Reglamento | null>(null);

  const [
    isEditReglamentoOpen,
    setIsEditReglamentoOpen,
  ] = useState(false);

  const [selectedComunicado, setSelectedComunicado] =
    useState<Comunicado | null>(null);

  const [driveViewerFolder, setDriveViewerFolder] =
    useState<{
      url: string;
      name: string;
    } | null>(null);

  // =========================================================
  // DOCUMENTOS
  // =========================================================

  const handleAddDocument = (
    newDoc: FormatoDocumento
  ) => {
    setFormatos((prev) => [newDoc, ...prev]);
  };

  const handleEditDocument = (
    documentoActualizado: FormatoDocumento
  ) => {
    setFormatos((prev) =>
      prev.map((documento) =>
        documento.id === documentoActualizado.id
          ? documentoActualizado
          : documento
      )
    );
  };

  const handleDeleteDocument = (id: string) => {
    setFormatos((prev) =>
      prev.filter(
        (documento) => documento.id !== id
      )
    );
  };

  // =========================================================
  // REGLAMENTOS - ABRIR MODALES
  // =========================================================

  const handleOpenAddReglamento = () => {
    setReglamentoEditando(null);
    setIsEditReglamentoOpen(true);
  };

  const handleOpenEditReglamento = (
    reglamento: Reglamento
  ) => {
    setReglamentoEditando(reglamento);
    setIsEditReglamentoOpen(true);
  };

  // =========================================================
  // REGLAMENTOS - GUARDAR EN SUPABASE
  // =========================================================

  const handleSaveReglamento = async (
    reglamento: Reglamento
  ) => {
    if (currentUserRole !== 'admin') {
      alert(
        'Solo un administrador puede modificar reglamentos.'
      );
      return;
    }

    const isNew =
      typeof reglamento.id === 'string' &&
      reglamento.id.startsWith('temp-');

    let reglamentoId: number;

    // -------------------------------------------------------
    // CREAR NUEVO
    // -------------------------------------------------------

    if (isNew) {
      const { data, error } = await supabase
        .from('reglamentos')
        .insert({
          title: reglamento.title,
          category: reglamento.category,
          description: reglamento.description,
          last_revision:
            reglamento.lastRevision || null,
          articles_count:
            reglamento.articlesCount || 0,
          drive_link: reglamento.driveLink,
          active: true,
        })
        .select('id')
        .single();

      if (error || !data) {
        console.error(
          'Error creando reglamento:',
          error
        );

        alert(
          'No fue posible guardar el reglamento.'
        );

        return;
      }

      reglamentoId = data.id;
    }

    // -------------------------------------------------------
    // EDITAR EXISTENTE
    // -------------------------------------------------------

    else {
      reglamentoId = Number(reglamento.id);

      const { error } = await supabase
        .from('reglamentos')
        .update({
          title: reglamento.title,
          category: reglamento.category,
          description: reglamento.description,
          last_revision:
            reglamento.lastRevision || null,
          articles_count:
            reglamento.articlesCount || 0,
          drive_link: reglamento.driveLink,
          active: true,
        })
        .eq('id', reglamentoId);

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

    // -------------------------------------------------------
    // REEMPLAZAR CAPÍTULOS
    // -------------------------------------------------------

    const { error: deleteSectionsError } =
      await supabase
        .from('reglamento_sections')
        .delete()
        .eq('reglamento_id', reglamentoId);

    if (deleteSectionsError) {
      console.error(
        'Error eliminando capítulos anteriores:',
        deleteSectionsError
      );

      alert(
        'El reglamento se guardó, pero hubo un problema actualizando los capítulos.'
      );

      return;
    }

    if (reglamento.sections.length > 0) {
      const sectionsToInsert =
        reglamento.sections.map(
          (section, index) => ({
            reglamento_id: reglamentoId,
            title: section.title,
            content: section.content,
            section_url:
              section.sectionUrl || '',
            sort_order: index + 1,
            active: true,
          })
        );

      const { error: sectionsInsertError } =
        await supabase
          .from('reglamento_sections')
          .insert(sectionsToInsert);

      if (sectionsInsertError) {
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

    setIsEditReglamentoOpen(false);
    setReglamentoEditando(null);

    await loadReglamentos();
  };

  // =========================================================
  // REGLAMENTOS - ELIMINAR
  // =========================================================

  const handleDeleteReglamento = async (
    id: number | string
  ) => {
    if (currentUserRole !== 'admin') {
      alert(
        'Solo un administrador puede eliminar reglamentos.'
      );
      return;
    }

    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar esta política, reglamento o manual? También se eliminarán sus capítulos.'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('reglamentos')
      .delete()
      .eq('id', Number(id));

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

  const handleAddComunicado = (
    newCom: Comunicado
  ) => {
    setComunicados((prev) => [newCom, ...prev]);
  };

  const handleDeleteComunicado = (
    id: string
  ) => {
    setComunicados((prev) =>
      prev.filter(
        (comunicado) => comunicado.id !== id
      )
    );
  };

  // =========================================================
  // EVENTOS
  // =========================================================

  const handleAddEvent = (
    newEvt: EventoAgenda
  ) => {
    setEventos((prev) => [newEvt, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    setEventos((prev) =>
      prev.filter(
        (evento) => evento.id !== id
      )
    );
  };

  // =========================================================
  // DRIVE
  // =========================================================

  const handleAddDriveFolder = (
    newFolder: DriveFolder
  ) => {
    setDriveFolders((prev) => [
      newFolder,
      ...prev,
    ]);
  };

  const handleDeleteDriveFolder = (
    id: string
  ) => {
    setDriveFolders((prev) =>
      prev.filter(
        (folder) => folder.id !== id
      )
    );
  };

  // =========================================================
  // PANTALLA DE CARGA
  // =========================================================

  if (authLoading) {
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

  if (!employeeAuthorized) {
    return <EmployeeLogin />;
  }

  // =========================================================
  // INTRANET
  // =========================================================

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={comunicados.length}
      />

      {/* USUARIO CONECTADO */}
      <div className="bg-slate-100 border-b border-slate-200 px-6 lg:px-10 py-1 flex items-center justify-end gap-3 text-[10px] text-slate-500">

        <span>
          Sesión:{' '}
          <strong>{currentUserEmail}</strong>
        </span>

        {currentUserRole === 'admin' && (
          <span className="bg-amber-100 text-amber-900 border border-amber-200 font-bold px-2 py-0.5 rounded-md">
            Administrador
          </span>
        )}

        <button
          type="button"
          onClick={handleEmployeeLogout}
          className="font-bold text-red-600 hover:text-red-800"
        >
          Cerrar sesión
        </button>
      </div>

      <main className="flex-grow p-4 md:p-8 overflow-y-auto">

        {/* INICIO */}
        {activeTab === 'inicio' && (
          <DashboardView
            formatos={formatos}
            comunicados={comunicados}
            eventos={eventos}
            driveFolders={driveFolders}
            isAdmin={isAdmin}
            onNavigate={setActiveTab}
            onOpenAddDocumentModal={() =>
              setIsAddDocOpen(true)
            }
            onOpenAddComunicadoModal={() =>
              setIsAddComunicadoOpen(true)
            }
            onOpenAddEventModal={() =>
              setIsAddEventOpen(true)
            }
            onOpenComunicadoDetail={
              setSelectedComunicado
            }
            onOpenDriveModal={(url, name) =>
              setDriveViewerFolder({
                url,
                name,
              })
            }
          />
        )}

        {/* DOCUMENTOS */}
        {activeTab === 'documentos' && (
          <DocumentosView
            formatos={formatos}
            isAdmin={isAdmin}
            onOpenAddModal={() =>
              setIsAddDocOpen(true)
            }
            onEditFormato={
              setDocumentoEditando
            }
            onDeleteFormato={
              handleDeleteDocument
            }
          />
        )}

        {/* COMUNICADOS */}
        {activeTab === 'comunicados' && (
          <ComunicadosView
            comunicados={comunicados}
            isAdmin={isAdmin}
            onOpenAddModal={() =>
              setIsAddComunicadoOpen(true)
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
        {activeTab === 'reglamentos' && (
          <>
            {reglamentosLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <BookOpenLoading />
              </div>
            ) : (
              <ReglamentosView
                reglamentos={reglamentos}
                isAdmin={isAdmin}
                onOpenDriveLink={(url) =>
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
        {activeTab === 'agenda' && (
          <AgendaView
            eventos={eventos}
            googleConfig={googleConfig}
            isAdmin={isAdmin}
            onOpenAddEventModal={() =>
              setIsAddEventOpen(true)
            }
            onUpdateGoogleConfig={
              setGoogleConfig
            }
            onDeleteEvent={
              handleDeleteEvent
            }
          />
        )}

        {/* DRIVE */}
        {activeTab === 'drive' && (
          <DriveIntegrationView
            driveFolders={driveFolders}
            googleConfig={googleConfig}
            isAdmin={isAdmin}
            onOpenFolderModal={(url, name) =>
              setDriveViewerFolder({
                url,
                name,
              })
            }
            onAddDriveFolder={
              handleAddDriveFolder
            }
            onDeleteDriveFolder={
              handleDeleteDriveFolder
            }
          />
        )}
      </main>

      <Footer
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onOpenAdminModal={() =>
          setIsAdminLoginOpen(true)
        }
      />

      {/* LOGIN ADMINISTRADOR ANTIGUO */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() =>
          setIsAdminLoginOpen(false)
        }
        onSuccess={() => {
          // La base de datos solamente permitirá
          // editar si el usuario tiene role=admin.
          if (currentUserRole === 'admin') {
            setIsAdmin(true);
          }

          setIsAdminLoginOpen(false);
        }}
      />

      {/* DOCUMENTOS */}
      <AddDocumentModal
        isOpen={isAddDocOpen}
        onClose={() =>
          setIsAddDocOpen(false)
        }
        onAdd={handleAddDocument}
      />

      <EditDocumentModal
        isOpen={!!documentoEditando}
        documento={documentoEditando}
        onClose={() =>
          setDocumentoEditando(null)
        }
        onSave={handleEditDocument}
      />

      {/* REGLAMENTOS */}
      <EditReglamentoModal
        isOpen={isEditReglamentoOpen}
        reglamento={reglamentoEditando}
        onClose={() => {
          setIsEditReglamentoOpen(false);
          setReglamentoEditando(null);
        }}
        onSave={handleSaveReglamento}
      />

      {/* COMUNICADOS */}
      <AddComunicadoModal
        isOpen={isAddComunicadoOpen}
        onClose={() =>
          setIsAddComunicadoOpen(false)
        }
        onAdd={handleAddComunicado}
      />

      {/* EVENTOS */}
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() =>
          setIsAddEventOpen(false)
        }
        onAdd={handleAddEvent}
      />

      {/* DETALLE COMUNICADO */}
      <ComunicadoDetailModal
        comunicado={selectedComunicado}
        onClose={() =>
          setSelectedComunicado(null)
        }
      />

      {/* DRIVE */}
      {driveViewerFolder && (
        <DriveViewerModal
          isOpen={true}
          folderUrl={
            driveViewerFolder.url
          }
          folderName={
            driveViewerFolder.name
          }
          onClose={() =>
            setDriveViewerFolder(null)
          }
        />
      )}
    </div>
  );
}

// =========================================================
// PEQUEÑO INDICADOR DE CARGA PARA REGLAMENTOS
// =========================================================

const BookOpenLoading = () => {
  return (
    <div>
      <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center mx-auto mb-3 font-black">
        CdR
      </div>

      <p className="text-xs font-bold text-[#234156]">
        Cargando reglamentos...
      </p>
    </div>
  );
};