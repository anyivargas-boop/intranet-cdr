import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DocumentosView } from './components/DocumentosView';
import { ComunicadosView } from './components/ComunicadosView';
import { ReglamentosView } from './components/ReglamentosView';
import { AgendaView } from './components/AgendaView';
import { DriveIntegrationView } from './components/DriveIntegrationView';
import { Footer } from './components/Footer';

import { AddDocumentModal } from './components/AddDocumentModal';
import { EditDocumentModal } from './components/EditDocumentModal';
import { AddComunicadoModal } from './components/AddComunicadoModal';
import { AddEventModal } from './components/AddEventModal';
import { ComunicadoDetailModal } from './components/ComunicadoDetailModal';
import { DriveViewerModal } from './components/DriveViewerModal';
import { AdminLoginModal } from './components/AdminLoginModal';

import {
  initialFormatos,
  initialComunicados,
  initialReglamentos,
  initialEventos,
  initialDriveFolders,
  initialGoogleConfig,
} from './data/initialData';

import {
  FormatoDocumento,
  Comunicado,
  Reglamento,
  EventoAgenda,
  DriveFolder,
  GoogleIntegrationsConfig,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  // Información persistente
  const [formatos, setFormatos] = useState<FormatoDocumento[]>(() => {
    const saved = localStorage.getItem('cdr_formatos');
    return saved ? JSON.parse(saved) : initialFormatos;
  });

  const [comunicados, setComunicados] = useState<Comunicado[]>(() => {
    const saved = localStorage.getItem('cdr_comunicados');
    return saved ? JSON.parse(saved) : initialComunicados;
  });

  const [reglamentos] = useState<Reglamento[]>(() => {
    const saved = localStorage.getItem('cdr_reglamentos');
    return saved ? JSON.parse(saved) : initialReglamentos;
  });

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

  // Guardar cambios en el navegador
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

  // Estados de modales
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [isAddComunicadoOpen, setIsAddComunicadoOpen] =
    useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const [documentoEditando, setDocumentoEditando] =
    useState<FormatoDocumento | null>(null);

  const [selectedComunicado, setSelectedComunicado] =
    useState<Comunicado | null>(null);

  const [driveViewerFolder, setDriveViewerFolder] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // Documentos
  const handleAddDocument = (newDoc: FormatoDocumento) => {
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
      prev.filter((documento) => documento.id !== id)
    );
  };

  // Comunicados
  const handleAddComunicado = (newCom: Comunicado) => {
    setComunicados((prev) => [newCom, ...prev]);
  };

  const handleDeleteComunicado = (id: string) => {
    setComunicados((prev) =>
      prev.filter((comunicado) => comunicado.id !== id)
    );
  };

  // Eventos
  const handleAddEvent = (newEvt: EventoAgenda) => {
    setEventos((prev) => [newEvt, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    setEventos((prev) =>
      prev.filter((evento) => evento.id !== id)
    );
  };

  // Carpetas de Drive
  const handleAddDriveFolder = (newFolder: DriveFolder) => {
    setDriveFolders((prev) => [newFolder, ...prev]);
  };

  const handleDeleteDriveFolder = (id: string) => {
    setDriveFolders((prev) =>
      prev.filter((folder) => folder.id !== id)
    );
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={comunicados.length}
      />

      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
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
            onOpenComunicadoDetail={setSelectedComunicado}
            onOpenDriveModal={(url, name) =>
              setDriveViewerFolder({ url, name })
            }
          />
        )}

        {activeTab === 'documentos' && (
          <DocumentosView
            formatos={formatos}
            isAdmin={isAdmin}
            onOpenAddModal={() => setIsAddDocOpen(true)}
            onEditFormato={setDocumentoEditando}
            onDeleteFormato={handleDeleteDocument}
          />
        )}

        {activeTab === 'comunicados' && (
          <ComunicadosView
            comunicados={comunicados}
            isAdmin={isAdmin}
            onOpenAddModal={() =>
              setIsAddComunicadoOpen(true)
            }
            onSelectComunicado={setSelectedComunicado}
            onDeleteComunicado={handleDeleteComunicado}
          />
        )}

        {activeTab === 'reglamentos' && (
          <ReglamentosView
            reglamentos={reglamentos}
            isAdmin={isAdmin}
            onOpenDriveLink={(url) =>
              window.open(url, '_blank')
            }
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaView
            eventos={eventos}
            googleConfig={googleConfig}
            isAdmin={isAdmin}
            onOpenAddEventModal={() =>
              setIsAddEventOpen(true)
            }
            onUpdateGoogleConfig={setGoogleConfig}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'drive' && (
          <DriveIntegrationView
            driveFolders={driveFolders}
            googleConfig={googleConfig}
            isAdmin={isAdmin}
            onOpenFolderModal={(url, name) =>
              setDriveViewerFolder({ url, name })
            }
            onAddDriveFolder={handleAddDriveFolder}
            onDeleteDriveFolder={handleDeleteDriveFolder}
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

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />

      <AddDocumentModal
        isOpen={isAddDocOpen}
        onClose={() => setIsAddDocOpen(false)}
        onAdd={handleAddDocument}
      />

      <EditDocumentModal
        isOpen={!!documentoEditando}
        documento={documentoEditando}
        onClose={() => setDocumentoEditando(null)}
        onSave={handleEditDocument}
      />

      <AddComunicadoModal
        isOpen={isAddComunicadoOpen}
        onClose={() =>
          setIsAddComunicadoOpen(false)
        }
        onAdd={handleAddComunicado}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onAdd={handleAddEvent}
      />

      <ComunicadoDetailModal
        comunicado={selectedComunicado}
        onClose={() => setSelectedComunicado(null)}
      />

      {driveViewerFolder && (
        <DriveViewerModal
          isOpen={true}
          folderUrl={driveViewerFolder.url}
          folderName={driveViewerFolder.name}
          onClose={() => setDriveViewerFolder(null)}
        />
      )}
    </div>
  );
}