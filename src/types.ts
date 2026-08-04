export type CategoryType =
  | 'Administración'
  | 'Formatos de Viáticos'
  | 'Leyes y Reglamentos'
  | 'Redacción y Estilo'
  | 'Salud y Seguridad (SST)'
  | 'Proyectos y Becas';

export type FileType = 'drive' | 'pdf' | 'excel' | 'word' | 'form';

export interface FormatoDocumento {
  id: string;
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

export type ComunicadoCategory = 'Institucional' | 'Bienestar' | 'Importante' | 'Formación';

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

export interface ReglamentoSection {
  title: string;
  content: string;
}

export interface Reglamento {
  id: string;
  title: string;
  description: string;
  category: string;
  lastRevision: string;
  articlesCount: number;
  driveLink: string;
  pdfUrl?: string;
  sections: ReglamentoSection[];
}

export type EventType = 'Taller' | 'Capacitación' | 'Cierre Editorial' | 'Reunión General' | 'Fecha Límite';

export interface EventoAgenda {
  id: string;
  title: string;
  date: string; // ISO date format YYYY-MM-DD
  time: string;
  location: string;
  type: EventType;
  description: string;
  meetLink?: string;
  calendarUrl?: string;
}

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

export interface GoogleIntegrationsConfig {
  driveFolderUrl: string;
  calendarEmbedUrl: string;
  calendarId: string;
}
