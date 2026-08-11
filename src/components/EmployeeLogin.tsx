import React, { useState } from 'react';
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export const EmployeeLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (
      !normalizedEmail.endsWith(
        '@consejoderedaccion.org'
      ) &&
      !normalizedEmail.endsWith(
        '@colombiacheck.org'
      )
    ) {
      setMessage(
        'Debes usar un correo institucional de Consejo de Redacción o ColombiaCheck.'
      );
      return;
    }

    if (!password.trim()) {
      setMessage(
        'Ingresa tu contraseña.'
      );
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } =
      await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

    if (error) {
      setMessage(
        'Correo o contraseña incorrectos.'
      );
      setLoading(false);
      return;
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
            Ingresa con tu correo institucional y contraseña.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-[#234156] uppercase mb-1">
              Correo institucional
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="nombre@consejoderedaccion.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#234156] uppercase mb-1">
              Contraseña
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Ingresa tu contraseña"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                title={
                  showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#234156] hover:bg-[#1a3142] disabled:opacity-60 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-[#f3a828]" />

            {loading
              ? 'Ingresando...'
              : 'Ingresar a la Intranet'}
          </button>

          {message && (
            <p className="text-xs text-center text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {message}
            </p>
          )}
        </form>

        <p className="text-[11px] text-center text-slate-400 mt-5">
          Acceso exclusivo para personal autorizado de Consejo de Redacción y ColombiaCheck.
        </p>
      </div>
    </div>
  );
};