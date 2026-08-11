import React, { useState } from 'react';
import { Mail, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const EmployeeLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (
      !normalizedEmail.endsWith('@consejoderedaccion.org') &&
      !normalizedEmail.endsWith('@colombiacheck.org')
    ) {
      setMessage(
        'Debes usar un correo institucional de Consejo de Redacción o ColombiaCheck.'
      );
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage('No fue posible enviar el acceso. Intenta nuevamente.');
    } else {
      setMessage(
        'Revisa tu correo institucional. Te enviamos un enlace de acceso.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl border border-slate-300 shadow-xl p-7">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#234156] text-[#f3a828] flex items-center justify-center font-black text-xl mb-3">
            CdR
          </div>

          <h1 className="text-xl font-extrabold text-[#234156]">
            Acceso a la Intranet
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Ingresa con tu correo institucional.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#234156] uppercase mb-1">
              Correo institucional
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@consejoderedaccion.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-[#f3a828]" />

            {loading
              ? 'Enviando...'
              : 'Enviar enlace de acceso'}
          </button>

          {message && (
            <p className="text-xs text-center text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};