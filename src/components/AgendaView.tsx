import React, { useState } from 'react';
import { EventoAgenda, GoogleIntegrationsConfig } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  Video, 
  ExternalLink, 
  Settings, 
  ListFilter, 
  CalendarDays,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface AgendaViewProps {
  eventos: EventoAgenda[];
  googleConfig: GoogleIntegrationsConfig;
  isAdmin: boolean;
  onOpenAddEventModal: () => void;
  onUpdateGoogleConfig: (newConfig: GoogleIntegrationsConfig) => void;
  onDeleteEvent?: (id: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  eventos,
  googleConfig,
  isAdmin,
  onOpenAddEventModal,
  onUpdateGoogleConfig,
  onDeleteEvent,
}) => {
  const [viewType, setViewType] = useState<'list' | 'googleEmbed'>('list');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [calendarEmbedInput, setCalendarEmbedInput] = useState(googleConfig.calendarEmbedUrl);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoogleConfig({
      ...googleConfig,
      calendarEmbedUrl: calendarEmbedInput,
    });
    setShowConfigModal(false);
  };

  const generateIcsFile = (evt: EventoAgenda) => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Consejo de Redacción//Intranet//ES
BEGIN:VEVENT
SUMMARY:${evt.title}
DESCRIPTION:${evt.description}
LOCATION:${evt.location}
DTSTART:${evt.date.replace(/-/g, '')}T090000Z
DTEND:${evt.date.replace(/-/g, '')}T110000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${evt.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Top Banner */}
      <div className="bg-[#234156] text-white rounded-2xl p-6 border-b-4 border-[#f3a828] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-[#f3a828]" />
            Agenda de Eventos y Capacitaciones CdR
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            Programación de talleres periodísticos, cierres editoriales, webinars y fechas límite de CdR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onOpenAddEventModal}
              className="bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0 border border-amber-300"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Evento</span>
            </button>
          )}

          <button
            onClick={() => setShowConfigModal(true)}
            className="bg-[#182c3b] hover:bg-[#12222e] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-600 flex items-center gap-2 transition-colors shrink-0"
            title="Vincular Google Calendar institucional"
          >
            <Settings className="w-4 h-4 text-[#f3a828]" />
            <span className="hidden sm:inline">Configurar Google Calendar</span>
          </button>
        </div>
      </div>

      {/* Switcher & View Selector */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setViewType('list')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-colors ${
              viewType === 'list'
                ? 'bg-[#234156] text-[#f3a828] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Vista Lista de Eventos</span>
          </button>
          <button
            onClick={() => setViewType('googleEmbed')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-colors ${
              viewType === 'googleEmbed'
                ? 'bg-[#234156] text-[#f3a828] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-[#f3a828]" />
            <span>Google Calendar En Vivo</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-bold hidden md:inline">
          {eventos.length} actividades programadas
        </span>
      </div>

      {/* Main Content Area */}
      {viewType === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventos.map((evt) => {
            const dateObj = new Date(evt.date);
            const month = dateObj.toLocaleDateString('es-ES', { month: 'short' });
            const day = dateObj.getDate() + 1;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border-l-4 border-l-[#234156] border-y border-r border-slate-200 p-6 shadow-xs hover:border-r-[#f3a828] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f3a828] text-slate-950 border border-amber-300 px-3.5 py-2 rounded-xl text-center shrink-0 font-black">
                        <span className="block text-[10px] uppercase font-bold text-slate-900">{month}</span>
                        <span className="block text-2xl font-black leading-none">{day}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-[#234156] bg-amber-100 px-2 py-0.5 rounded uppercase border border-amber-200">
                          {evt.type}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">
                          {evt.title}
                        </h3>
                      </div>
                    </div>

                    {isAdmin && onDeleteEvent && (
                      <button
                        onClick={() => onDeleteEvent(evt.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="Eliminar evento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#234156]" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#234156]" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {evt.meetLink ? (
                    <a
                      href={evt.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5 text-xs"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Google Meet</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[11px] font-semibold">Evento presencial</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateIcsFile(evt)}
                      className="text-slate-700 hover:text-slate-900 font-bold text-xs px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200"
                      title="Descargar archivo para Outlook/Apple Calendar"
                    >
                      Guardar .ics
                    </button>
                    {evt.calendarUrl && (
                      <a
                        href={evt.calendarUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs border border-slate-700 shadow-xs"
                      >
                        <span>Google Calendar</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#f3a828]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Live Google Calendar Embed Frame */
        <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-xs p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#234156] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
              Google Calendar Integrado (Sincronizado)
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Zona horaria: America/Bogota
            </span>
          </div>

          <div className="w-full h-[650px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            <iframe
              src={googleConfig.calendarEmbedUrl}
              style={{ border: 0 }}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              title="Google Calendar CdR"
            ></iframe>
          </div>
        </div>
      )}

      {/* Google Calendar Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 text-slate-900">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#234156] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#f3a828]" />
                Vincular Google Calendar Institucional
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                  Enlace de Embed o Calendar ID de Google Calendar
                </label>
                <input
                  type="text"
                  value={calendarEmbedInput}
                  onChange={(e) => setCalendarEmbedInput(e.target.value)}
                  placeholder="https://calendar.google.com/calendar/embed?src=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#234156] font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Obtenga este código en la configuración de Google Calendar de CdR -&gt; Integrar el calendario.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#234156] hover:bg-[#1a3142] text-white font-bold rounded-xl shadow-sm border border-slate-700"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

