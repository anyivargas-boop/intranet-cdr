import { FormatoDocumento, Comunicado, Reglamento, EventoAgenda, DriveFolder, GoogleIntegrationsConfig } from '../types';

export const initialGoogleConfig: GoogleIntegrationsConfig = {
  driveFolderUrl: 'https://drive.google.com/drive/folders/1CdR_Organizacion_Archivos_Compartidos',
  calendarEmbedUrl: 'https://calendar.google.com/calendar/embed?src=en.colombian%23holiday%40group.v.calendar.google.com&ctz=America%2FBogota',
  calendarId: 'contacto@consejoderedaccion.org',
};

export const initialFormatos: FormatoDocumento[] = [
  {
    id: 'fmt-1',
    title: 'Formatos de Viáticos y Legalizaciones',
    category: 'Formatos de Viáticos',
    description: 'Plantilla oficial para reporte de gastos de transporte, alojamiento y alimentación en coberturas de campo.',
    driveUrl: 'https://docs.google.com/spreadsheets/d/1CdR_Viaticos_2026/edit',
    downloadUrl: '#',
    fileType: 'excel',
    version: 'v3.2',
    lastUpdated: '2026-07-15',
    iconBgColor: 'bg-emerald-50',
    iconTextColor: 'text-emerald-600',
    downloadsCount: 142,
  },
  {
    id: 'fmt-2',
    title: 'Solicitud de Licencias y Vacaciones',
    category: 'Administración',
    description: 'Formulario oficial de talento humano para solicitar días de descanso, permisos remunerados o calamidades.',
    driveUrl: 'https://docs.google.com/document/d/1CdR_Vacaciones_Form/edit',
    downloadUrl: '#',
    fileType: 'word',
    version: 'v2.0',
    lastUpdated: '2026-06-01',
    iconBgColor: 'bg-blue-50',
    iconTextColor: 'text-blue-600',
    downloadsCount: 89,
  },
  {
    id: 'fmt-3',
    title: 'Manual de Estilo y Guía de Redacción CdR',
    category: 'Redacción y Estilo',
    description: 'Lineamientos editoriales, estándares éticos y guía tipográfica y gramatical para publicaciones de CdR.',
    driveUrl: 'https://docs.google.com/document/d/1CdR_Manual_Estilo/edit',
    downloadUrl: '#',
    fileType: 'pdf',
    version: 'v4.1',
    lastUpdated: '2026-05-10',
    iconBgColor: 'bg-amber-50',
    iconTextColor: 'text-amber-600',
    downloadsCount: 215,
  },
  {
    id: 'fmt-4',
    title: 'Formato ARL y Reporte de Incidentes de Campo',
    category: 'Salud y Seguridad (SST)',
    description: 'Documento normativo de la ARL y procedimiento para notificación inmediata de incidentes durante investigación.',
    driveUrl: 'https://drive.google.com/file/d/1CdR_SST_ARL_Reporte/view',
    downloadUrl: '#',
    fileType: 'pdf',
    version: 'v1.5',
    lastUpdated: '2026-04-20',
    iconBgColor: 'bg-rose-50',
    iconTextColor: 'text-rose-600',
    downloadsCount: 64,
  },
  {
    id: 'fmt-5',
    title: 'Formulario para Convocatorias y Fondo de Becas',
    category: 'Proyectos y Becas',
    description: 'Plantilla de presentación de proyectos periodísticos para aplicar a los fondos de becas de investigación de CdR.',
    driveUrl: 'https://docs.google.com/forms/d/1CdR_Becas_Convocatoria/viewform',
    downloadUrl: '#',
    fileType: 'form',
    version: 'v2026.1',
    lastUpdated: '2026-07-30',
    iconBgColor: 'bg-purple-50',
    iconTextColor: 'text-purple-600',
    downloadsCount: 178,
  },
  {
    id: 'fmt-6',
    title: 'Acta de Reunión y Acuerdos de Trabajo',
    category: 'Administración',
    description: 'Plantilla estandarizada para registrar asistencia, compromisos y fechas límite en reuniones de comité.',
    driveUrl: 'https://docs.google.com/document/d/1CdR_Acta_Reunion/edit',
    downloadUrl: '#',
    fileType: 'word',
    version: 'v1.2',
    lastUpdated: '2026-03-12',
    iconBgColor: 'bg-blue-50',
    iconTextColor: 'text-blue-600',
    downloadsCount: 95,
  },
];

export const initialComunicados: Comunicado[] = [
  {
    id: 'com-1',
    title: 'Actualización de Reglamento Interno de Trabajo 2026',
    category: 'Institucional',
    summary: 'Se han ajustado las políticas de teletrabajo, flexibilidad horaria y desconexión laboral para el equipo.',
    content: `Estimado equipo de Consejo de Redacción (CdR),

Nos complace presentar la actualización formal de nuestro Reglamento Interno de Trabajo para la vigencia 2026. Los principales cambios incluyen:

1. **Modalidad Híbrida y Teletrabajo**: Se consolidan los 2 días de trabajo en casa acordados por equipo.
2. **Derecho a la Desconexión Laboral**: Garantía de no atención de chats o correos fuera de la jornada convenida, salvo coberturas extraordinarias de fuerza mayor.
3. **Apoyo de Conectividad**: Ajuste del subsidio de conectividad conforme a la normativa laboral colombiana vigente.

Favor revisar el documento completo disponible en la sección de Reglamentos de esta intranet.`,
    date: '2026-08-01',
    author: 'Dirección Administrativa',
    authorRole: 'Gestión Humana y Jurídica',
    pinned: true,
    attachments: [
      { name: 'Reglamento_Interno_CdR_2026.pdf', url: '#', type: 'application/pdf' }
    ],
  },
  {
    id: 'com-2',
    title: 'Nueva Convocatoria: Fondo de Becas de Investigación CdR',
    category: 'Bienestar',
    summary: 'Ya están abiertas las postulaciones para el programa de incentivos a proyectos periodísticos de impacto nacional.',
    content: `Abrimos formalmente la V Convocatoria del Fondo de Becas de Consejo de Redacción para periodistas e investigadores asociados.

- **Monto por beca**: Hasta $12.000.000 COP para costos de cobertura y producción.
- **Líneas temáticas**: Medio ambiente y crisis climática, verificación de datos (Fact-checking), y derechos humanos.
- **Fecha límite de postulación**: 25 de Agosto de 2026.

Los interesados pueden ingresar al formulario de postulación ubicado en el repositorio de formatos.`,
    date: '2026-07-28',
    author: 'Coordinación de Proyectos',
    authorRole: 'Comité Editorial CdR',
    pinned: true,
    attachments: [
      { name: 'Bases_Convocatoria_Becas_2026.pdf', url: '#', type: 'application/pdf' }
    ],
  },
  {
    id: 'com-3',
    title: 'Taller Obligatorio: Ciberseguridad y Protección de Fuentes',
    category: 'Formación',
    summary: 'Capacitación presencial y virtual sobre herramientas avanzadas de cifrado Signal, PGP y resguardo de datos.',
    content: `En vista de los recientes desafíos de seguridad digital en la región, la Dirección de Investigación convoca a todo el equipo periodístico y técnico al taller interactivo de Ciberseguridad.

- **Fecha**: 18 de Agosto de 2026 - 10:00 AM.
- **Formato**: Híbrido (Sala Principal de CdR + Transmisión por Google Meet).
- **Temas**: Uso de gestores de contraseñas corporativos, auditoría de dispositivos y canal seguro de denuncias.`,
    date: '2026-07-22',
    author: 'Equipo Técnico & Seguridad',
    authorRole: 'Sistemas e Infraestructura',
    pinned: false,
  },
  {
    id: 'com-4',
    title: 'Calendario de Cierre Editorial y Entregas Mensuales',
    category: 'Importante',
    summary: 'Recordatorio de cronograma para revisiones de edición, facturación de viáticos y entrega de reportes.',
    content: `Recordamos a todos los coordinadores de proyecto que la fecha límite para entrega de legalización de gastos e informes financieros del mes vence el día 25 de cada mes a las 5:00 PM.

Agradecemos su puntualidad para facilitar la conciliación contable de la organización.`,
    date: '2026-07-10',
    author: 'Finanzas CdR',
    authorRole: 'Dirección Financiera',
    pinned: false,
  },
];

export const initialReglamentos: Reglamento[] = [
  {
    id: 'reg-1',
    title: 'Reglamento Interno de Trabajo CdR (Actualizado 2026)',
    description: 'Disposiciones legales, derechos, deberes, horarios y régimen disciplinario para todos los colaboradores de la asociación.',
    category: 'Normativa Laboral',
    lastRevision: '2026-08-01',
    articlesCount: 48,
    driveLink: 'https://docs.google.com/document/d/1CdR_Reglamento_Interno_2026/edit',
    pdfUrl: '#',
    sections: [
      {
        title: 'Capítulo I: Condiciones de Admisión y Jornada Laboral',
        content: 'La jornada ordinaria de trabajo comprende 42 horas semanales distribuidas de lunes a viernes con flexibilidad de ingreso entre 7:30 AM y 9:00 AM.'
      },
      {
        title: 'Capítulo II: Teletrabajo y Desconexión',
        content: 'El equipo dispondrá de un esquema de trabajo híbrido con 2 días semanales de trabajo remoto. Se respeta estrictamente el horario de desconexión.'
      },
      {
        title: 'Capítulo III: Licencias y Permisos',
        content: 'Las solicitudes de licencias personales o médicas deben radicarse con al menos 3 días de antelación mediante el formato oficial en la intranet.'
      }
    ]
  },
  {
    id: 'reg-2',
    title: 'Código de Ética y Rigor Periodístico CdR',
    description: 'Principios rectores de independencia, verificación de datos, manejo imparcial de fuentes y transparencia institucional.',
    category: 'Ética Editorial',
    lastRevision: '2026-03-15',
    articlesCount: 22,
    driveLink: 'https://docs.google.com/document/d/1CdR_Codigo_Etica/edit',
    pdfUrl: '#',
    sections: [
      {
        title: 'Sección 1: Proteccion y Confidencialidad de Fuentes',
        content: 'Ningún periodista asociado a CdR revelará la identidad de una fuente protegida bajo pacto de reserva de nombre sin consentimiento expreso y asesoría jurídica.'
      },
      {
        title: 'Sección 2: Conflictos de Interés y Transparencia',
        content: 'Todos los investigadores deben declarar ante la junta médica/editorial cualquier posible conflicto de interés previo a la asignación de un reportaje.'
      }
    ]
  },
  {
    id: 'reg-3',
    title: 'Manual de Políticas de Viáticos y Reembolsos',
    description: 'Guía práctica de límites tarifarios para viajes nacionales e internacionales, legalizaciones y justificantes válidos ante la DIAN.',
    category: 'Administración y Finanzas',
    lastRevision: '2026-05-20',
    articlesCount: 15,
    driveLink: 'https://docs.google.com/document/d/1CdR_Manual_Viaticos/edit',
    pdfUrl: '#',
    sections: [
      {
        title: 'Topes Tarifarios Diarios',
        content: 'Alimentación: $90.000 COP/día en ciudades principales. Transporte urbano: $50.000 COP/día con recibos o soportes de apps de transporte.'
      },
      {
        title: 'Tiempos de Legalización',
        content: 'Los anticipos de viáticos deberán legalizarse en los 5 días hábiles posteriores a la finalización del viaje de trabajo.'
      }
    ]
  },
  {
    id: 'reg-4',
    title: 'Política de Protección de Datos (Habeas Data & SG-SST)',
    description: 'Tratamiento de datos personales de asociados, participantes de talleres y normatividad de salud ocupacional.',
    category: 'Seguridad Legal',
    lastRevision: '2026-01-10',
    articlesCount: 18,
    driveLink: 'https://docs.google.com/document/d/1CdR_HabeasData_SGSST/edit',
    pdfUrl: '#',
    sections: [
      {
        title: 'Custodia de Bases de Datos',
        content: 'Se garantiza el estricto cumplimiento de la Ley 1581 de 2012 para toda la información almacenada en los servidores corporativos de CdR.'
      }
    ]
  }
];

export const initialEventos: EventoAgenda[] = [
  {
    id: 'evt-1',
    title: 'Taller de Periodismo de Datos e Inteligencia Artificial',
    date: '2026-08-12',
    time: '09:00 AM - 12:30 PM',
    location: 'Sala Principal CdR & Google Meet',
    type: 'Taller',
    description: 'Sesión pràctica de raspado de datos (scraping), análisis de presupuestos públicos y uso ético de herramientas de IA en redacción.',
    meetLink: 'https://meet.google.com/cdr-taller-datos',
    calendarUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Taller+de+Periodismo+de+Datos',
  },
  {
    id: 'evt-2',
    title: 'Cierre Editorial Mensual y Revisión de Proyectos',
    date: '2026-08-15',
    time: '03:00 PM - 05:00 PM',
    location: 'Oficina Central Bogotá',
    type: 'Cierre Editorial',
    description: 'Evaluación del avance del comité editorial, entregables de becarios e hitos de publicaciones del mes.',
    meetLink: 'https://meet.google.com/cdr-cierre-mensual',
    calendarUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Cierre+Editorial+CdR',
  },
  {
    id: 'evt-3',
    title: 'Capacitación en Seguridad Digital y Protocolo de Campo',
    date: '2026-08-18',
    time: '10:00 AM - 11:30 AM',
    location: 'Sesión Virtual Online',
    type: 'Capacitación',
    description: 'Instrucción sobre el uso de la aplicación de pánico en coberturas periodísticas y cifrado de dispositivos móviles.',
    meetLink: 'https://meet.google.com/cdr-seguridad-digital',
    calendarUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Capacitación+Seguridad+Digital',
  },
  {
    id: 'evt-4',
    title: 'Fecha Límite: Postulación a Fondo de Becas CdR',
    date: '2026-08-25',
    time: '05:00 PM (Hora Col)',
    location: 'Plataforma Intranet CdR',
    type: 'Fecha Límite',
    description: 'Cierre definitivo de recepción de propuestas para la V Convocatoria del Fondo de Becas de Investigación.',
    calendarUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Limite+Becas+CdR',
  },
  {
    id: 'evt-5',
    title: 'Reunión General de Equipo - Balance Q3',
    date: '2026-09-02',
    time: '08:30 AM - 10:00 AM',
    location: 'Auditorio CdR & Streaming',
    type: 'Reunión General',
    description: 'Presentación de resultados por áreas, presupuesto acumulado e integración del equipo de trabajo.',
    meetLink: 'https://meet.google.com/cdr-reunion-general',
    calendarUrl: 'https://calendar.google.com/calendar/r/eventedit?text=Reunion+General+CdR',
  },
];

export const initialDriveFolders: DriveFolder[] = [
  {
    id: 'drv-1',
    name: 'Carpeta General Administración',
    category: 'Administración',
    url: 'https://drive.google.com/drive/folders/1CdR_Administracion_General',
    fileCount: 45,
    description: 'Actas de asamblea, contratos marco, pólizas y documentos organizacionales.',
    iconBgColor: 'bg-blue-50',
    iconTextColor: 'text-blue-600',
  },
  {
    id: 'drv-2',
    name: 'Formatos y Plantillas 2026',
    category: 'Formatos',
    url: 'https://drive.google.com/drive/folders/1CdR_Formatos_Oficiales',
    fileCount: 18,
    description: 'Viáticos, cuentas de cobro, solicitudes de personal y vacaciones.',
    iconBgColor: 'bg-emerald-50',
    iconTextColor: 'text-emerald-600',
  },
  {
    id: 'drv-3',
    name: 'Manuales, Leyes y Reglamentos',
    category: 'Legales',
    url: 'https://drive.google.com/drive/folders/1CdR_Leyes_Reglamentos',
    fileCount: 12,
    description: 'Reglamento interno, código de ética y normatividad de seguridad.',
    iconBgColor: 'bg-purple-50',
    iconTextColor: 'text-purple-600',
  },
  {
    id: 'drv-4',
    name: 'Redacción, Marca y Guias de Estilo',
    category: 'Editorial',
    url: 'https://drive.google.com/drive/folders/1CdR_Manuales_Marca',
    fileCount: 24,
    description: 'Logotipos, manual de identidad visual, tipografías y plantilla de presentaciones.',
    iconBgColor: 'bg-amber-50',
    iconTextColor: 'text-amber-600',
  },
  {
    id: 'drv-5',
    name: 'Salud y Seguridad en el Trabajo (SST)',
    category: 'SST',
    url: 'https://drive.google.com/drive/folders/1CdR_SST_Documentos',
    fileCount: 15,
    description: 'Comité Paritario COPASST, formatos ARL y protocolos de evacuación.',
    iconBgColor: 'bg-rose-50',
    iconTextColor: 'text-rose-600',
  },
  {
    id: 'drv-6',
    name: 'Proyectos de Investigación y Becas',
    category: 'Investigaciones',
    url: 'https://drive.google.com/drive/folders/1CdR_Proyectos_Becas',
    fileCount: 38,
    description: 'Reportajes finalizados, bases de datos de investigación y convocatorias.',
    iconBgColor: 'bg-indigo-50',
    iconTextColor: 'text-indigo-600',
  },
];
