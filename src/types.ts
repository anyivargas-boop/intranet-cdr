export type CategoryType =
  | 'Documentación Institucional'
  | 'Administración'
  | 'Formatos de Viáticos'
  | 'Leyes y Reglamentos'
  | 'Redacción y Estilo'
  | 'Salud y Seguridad (SST)'
  | 'Proyectos y Becas';


export type FileType =
  | 'drive'
  | 'pdf'
  | 'excel'
  | 'word'
  | 'form';


export interface FormatoDocumento {
  id: number | string;
  title: string;
  category: CategoryType;
  description: string;
  driveUrl: string;
  downloadUrl?: string;
  fileType: FileType;
  version: string;
  lastUpdated: string;
  iconBgColor?: string;
  iconTextColor?: string;
  downloadsCount?: number;
}


// =========================================================
// COMUNICADOS
// =========================================================

export type ComunicadoCategory =
  | 'Institucional'
  | 'Bienestar'
  | 'Importante'
  | 'Formación';


export interface ComunicadoAttachment {
  name: string;
  url: string;
  type: string;
}


export interface Comunicado {
  id: string;
  title: string;
  category: ComunicadoCategory;
  summary: string;
  content: string;
  date: string;
  author: string;
  authorRole: string;
  pinned: boolean;
  attachments?: ComunicadoAttachment[];
}


// =========================================================
// REGLAMENTOS
// =========================================================

export interface ReglamentoSection {
  id?: number;
  title: string;
  content: string;
  sectionUrl?: string;
  sortOrder?: number;
}


export interface Reglamento {
  id: number | string;
  title: string;
  description: string;
  category: string;
  lastRevision: string;
  articlesCount: number;
  driveLink: string;
  pdfUrl?: string;
  sections: ReglamentoSection[];
}


// =========================================================
// AGENDA
// =========================================================

export type EventType =
  | 'Taller'
  | 'Capacitación'
  | 'Cierre Editorial'
  | 'Reunión General'
  | 'Fecha Límite';


export interface EventoAgenda {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  description: string;
  meetLink?: string;
  calendarUrl?: string;
}


// =========================================================
// USUARIOS Y ACCESOS
// =========================================================

export type AuthorizedUserRole =
  | 'admin'
  | 'employee';


export interface AuthorizedUser {
  id: string;
  email: string;
  name: string;
  role: AuthorizedUserRole;
  active: boolean;
  createdAt?: string;
}


// =========================================================
// GOOGLE DRIVE
// =========================================================

export interface DriveFolder {
  id: string;
  name: string;
  category: string;
  url: string;
  fileCount: number;
  description: string;
  iconBgColor: string;
  iconTextColor: string;
}


// =========================================================
// INTEGRACIONES
// =========================================================

export interface GoogleIntegrationsConfig {
  driveFolderUrl: string;
  calendarEmbedUrl: string;
  calendarId: string;
}