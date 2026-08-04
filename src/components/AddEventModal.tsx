import React, { useState } from 'react';
import { EventoAgenda, EventType } from '../types';
import { Calendar, Plus, X, Video } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (evento: EventoAgenda) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00 AM - 11:00 AM');
  const [location, setLocation] = useState('Sala Principal CdR & Google Meet');
  const [type, setType] = useState<EventType>('Taller');
  const [description, setDescription] = useState('');
  const [meetLink, setMeetLink] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
      title
    )}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    const newEvent: EventoAgenda = {
      id: `evt-${Date.now()}`,
      title,
      date,
      time,
      location,
      type,
      description,
      meetLink: meetLink.trim() || undefined,
      calendarUrl,
    };

    onAdd(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 text-slate-900">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center border border-slate-700">
              <Calendar className="w-5 h-5 text-[#f3a828]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#234156]">
                Agendar Nuevo Evento o Capacitación
              </h3>
              <p className="text-xs text-slate-500 font-semibold">Personal Administrativo CdR</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Nombre del Evento / Taller *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Taller de Verificación de Datos y Fact-Checking"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Tipo de Actividad
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              >
                <option value="Taller">Taller</option>
                <option value="Capacitación">Capacitación</option>
                <option value="Cierre Editorial">Cierre Editorial</option>
                <option value="Reunión General">Reunión General</option>
                <option value="Fecha Límite">Fecha Límite</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Fecha *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Horario
              </label>
              <input
                type="text"
                placeholder="10:00 AM - 12:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Ubicación / Lugar
              </label>
              <input
                type="text"
                placeholder="Oficina CdR / En línea"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Enlace a Google Meet (Opcional)
            </label>
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
              Descripción o Temario Corto
            </label>
            <textarea
              rows={3}
              placeholder="Describa el objetivo de la actividad y requisitos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold rounded-xl flex items-center gap-2 shadow-sm border border-slate-700"
            >
              <Calendar className="w-3.5 h-3.5 text-[#f3a828]" />
              Guardar en Agenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

