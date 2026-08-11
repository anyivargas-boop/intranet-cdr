import React, { useEffect, useState } from 'react';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DocumentacionInstitucionalView } from './components/DocumentacionInstitucionalView';
import { DocumentosView } from './components/DocumentosView';
import { ComunicadosView } from './components/ComunicadosView';
import { ReglamentosView } from './components/ReglamentosView';
import { AgendaView } from './components/AgendaView';
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
  CategoryType,
  FileType,
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
  // DOCUMENTOS DESDE SUPABASE
  // =========================================================

  const [formatos, setFormatos] = useState<FormatoDocumento[]>([]);
  const [documentosLoading, setDocumentosLoading] = useState(false);

  // =========================================================
  // OTROS DATOS
  // =========================================================

  const [comunicados, setComunicados] = useState<Comunicado[]>(() => {
    const saved = localStorage.getItem('cdr_comunicados');
    return saved ? JSON.parse(saved) : initialComunicados;
  });

  const [reglamentos, setReglamentos] = useState<Reglamento[]>([]);
  const [reglamentosLoading, setReglamentosLoading] = useState(false);

  const [eventos, setEventos] = useState<EventoAgenda[]>(() => {
    const saved = localStorage.getItem('cdr_eventos');
    return saved ? JSON.parse(saved) : initialEventos;
  });

  const [driveFolders] = useState<DriveFolder[]>(() => {
    const saved = localStorage.getItem('cdr_driveFolders');
    return saved ? JSON.parse(saved) : initialDriveFolders;
  });

  const [googleConfig, setGoogleConfig] =
    useState<GoogleIntegrationsConfig>(() => {
      const saved = localStorage.getItem('cdr_googleConfig');
      return saved ? JSON.parse(saved) : initialGoogleConfig;
    });

  // =========================================================
  // GUARDAR DATOS LOCALES QUE AÚN NO ESTÁN EN SUPABASE
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
    setFormatos([]);

    setActiveTab('inicio');
  };

  // =========================================================
  // CARGAR DOCUMENTOS DESDE SUPABASE
  // =========================================================

  const loadDocumentos = async () => {
    setDocumentosLoading(true);

    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: true });

    if (error) {
      console.error(
        'Error cargando documentos:',
        error
      );

      setFormatos([]);
      setDocumentosLoading(false);
      return;
    }

    const mappedDocumentos: FormatoDocumento[] =
      (data || []).map((doc) => ({
        id: doc.id,
        title: doc.title || '',
        category:
          (doc.category || 'Administración') as CategoryType,
        description: doc.description || '',
        driveUrl: doc.drive_url || '',
        downloadUrl:
          doc.download_url || doc.drive_url || '',
        fileType:
          (doc.file_type || 'word') as FileType,
        version: doc.version || 'v1.0',
        lastUpdated: doc.last_updated || '',
        iconBgColor:
          doc.icon_bg_color || undefined,
        iconTextColor:
          doc.icon_text_color || undefined,
        downloadsCount:
          doc.downloads_count || 0,
      }));

    setFormatos(mappedDocumentos);
    setDocumentosLoading(false);
  };

  // =========================================================
  // CARGAR REGLAMENTOS DESDE SUPABASE
  // =========================================================

  const loadReglamentos = async () => {
    setReglamentosLoading(true);

    const {
      data: reglamentosData,
      error: reglamentosError,
    } = await supabase
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

    const {
      data: sectionsData,
      error: sectionsError,
    } = await supabase
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

  // =========================================================
  // CARGAR DATOS AL INICIAR SESIÓN
  // =========================================================

  useEffect(() => {
    if (employeeAuthorized) {
      loadDocumentos();
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
  // DOCUMENTOS - AGREGAR
  // =========================================================

  const handleAddDocument = async (
    newDoc: FormatoDocumento
  ) => {
    if (currentUserRole !== 'admin') {
      alert(
        'Solo un administrador puede agregar documentos.'
      );
      return;
    }

    const { error } = await supabase
      .from('documentos')
      .insert({
        title: newDoc.title,
        category: newDoc.category,
        description: newDoc.description,
        drive_url: newDoc.driveUrl,
        download_url:
          newDoc.downloadUrl || newDoc.driveUrl,
        file_type: newDoc.fileType,
        version: newDoc.version,
        last_updated:
          newDoc.lastUpdated || null,
        icon_bg_color:
          newDoc.iconBgColor || null,
        icon_text_color:
          newDoc.iconTextColor || null,
        downloads_count:
          newDoc.downloadsCount || 0,
        active: true,
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

  const handleEditDocument = async (
    documentoActualizado: FormatoDocumento
  ) => {
    if (currentUserRole !== 'admin') {
      alert(
        'Solo un administrador puede editar documentos.'
      );
      return;
    }

    const { error } = await supabase
      .from('documentos')
      .update({
        title: documentoActualizado.title,
        category: documentoActualizado.category,
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
        active: true,
      })
      .eq(
        'id',
        Number(documentoActualizado.id)
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

    setDocumentoEditando(null);

    await loadDocumentos();
  };

  // =========================================================
  // DOCUMENTOS - ELIMINAR
  // =========================================================

  const handleDeleteDocument = async (
    id: number | string
  ) => {
    if (currentUserRole !== 'admin') {
      alert(
        'Solo un administrador puede eliminar documentos.'
      );
      return;
    }

    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar este documento?'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('documentos')
      .delete()
      .eq('id', Number(id));

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
    } else {
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
    setComunicados((prev) => [
      newCom,
      ...prev,
    ]);
  };

  const handleDeleteComunicado = (
    id: string
  ) => {
    setComunicados((prev) =>
      prev.filter(
        (comunicado) =>
          comunicado.id !== id
      )
    );
  };

  // =========================================================
  // EVENTOS
  // =========================================================

  const handleAddEvent = (
    newEvt: EventoAgenda
  ) => {
    setEventos((prev) => [
      newEvt,
      ...prev,
    ]);
  };

  const handleDeleteEvent = (
    id: string
  ) => {
    setEventos((prev) =>
      prev.filter(
        (evento) =>
          evento.id !== id
      )
    );
  };

  // =========================================================
  // CARGANDO ACCESO
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

      {/* USUARIO */}
      <div className="bg-slate-100 border-b border-slate-200 px-6 lg:px-10 py-1 flex items-center justify-end gap-3 text-[10px] text-slate-500">

        <span>
          Sesión:{' '}
          <strong>
            {currentUserEmail}
          </strong>
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
          />
        )}


        {/* DOCUMENTACIÓN INSTITUCIONAL */}
        {activeTab === 'institucional' && (
          <>
            {documentosLoading ? (
              <LoadingBox text="Cargando documentación institucional..." />
            ) : (
              <DocumentacionInstitucionalView
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
          </>
        )}


        {/* FORMATOS Y PLANTILLAS */}
        {activeTab === 'documentos' && (
          <>
            {documentosLoading ? (
              <LoadingBox text="Cargando formatos y plantillas..." />
            ) : (
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
          </>
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
              <LoadingBox text="Cargando reglamentos..." />
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

      </main>


      <Footer
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onOpenAdminModal={() =>
          setIsAdminLoginOpen(true)
        }
      />


      {/* ADMINISTRADOR */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() =>
          setIsAdminLoginOpen(false)
        }
        onSuccess={() => {
          if (
            currentUserRole === 'admin'
          ) {
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


      {/* VISOR DRIVE, SI ALGÚN COMPONENTE LO NECESITA */}
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
// INDICADOR DE CARGA
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