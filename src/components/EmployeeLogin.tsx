import React, { useState } from 'react';
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';

import { supabase } from '../lib/supabase';

export const EmployeeLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [messageType, setMessageType] =
    useState<'error' | 'success'>(
      'error'
    );

  const [loading, setLoading] =
    useState(false);

  const [
    recoveryMode,
    setRecoveryMode,
  ] = useState(false);

  // =========================================================
  // VALIDAR CORREO INSTITUCIONAL
  // =========================================================

  const isValidInstitutionalEmail = (
    value: string
  ) => {
    const normalizedEmail =
      value.trim().toLowerCase();

    return (
      normalizedEmail.endsWith(
        '@consejoderedaccion.org'
      ) ||
      normalizedEmail.endsWith(
        '@colombiacheck.org'
      )
    );
  };

  // =========================================================
  // INICIAR SESIÓN
  // =========================================================

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      !isValidInstitutionalEmail(
        normalizedEmail
      )
    ) {
      setMessageType('error');

      setMessage(
        'Debes usar un correo institucional de Consejo de Redacción o ColombiaCheck.'
      );

      return;
    }

    if (!password.trim()) {
      setMessageType('error');

      setMessage(
        'Ingresa tu contraseña.'
      );

      return;
    }

    setLoading(true);
    setMessage('');

    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email:
            normalizedEmail,
          password,
        }
      );

    if (error) {
      setMessageType('error');

      setMessage(
        'Correo o contraseña incorrectos.'
      );

      setLoading(false);

      return;
    }

    setLoading(false);
  };

  // =========================================================
  // SOLICITAR RESTABLECIMIENTO
  // =========================================================

  const handlePasswordRecovery =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      const normalizedEmail =
        email.trim().toLowerCase();

      if (!normalizedEmail) {
        setMessageType('error');

        setMessage(
          'Ingresa tu correo institucional.'
        );

        return;
      }

      if (
        !isValidInstitutionalEmail(
          normalizedEmail
        )
      ) {
        setMessageType('error');

        setMessage(
          'Debes usar un correo institucional de Consejo de Redacción o ColombiaCheck.'
        );

        return;
      }

      setLoading(true);
      setMessage('');

      const redirectUrl =
        `${window.location.origin}/`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo:
              redirectUrl,
          }
        );

      if (error) {
        console.error(
          'Error enviando recuperación:',
          error
        );

        setMessageType('error');

        setMessage(
          `No fue posible enviar el correo de recuperación: ${error.message}`
        );

        setLoading(false);

        return;
      }

      setMessageType('success');

      setMessage(
        `Enviamos un enlace de recuperación a ${normalizedEmail}. Revisa también la carpeta de spam.`
      );

      setLoading(false);
    };

  // =========================================================
  // VOLVER AL LOGIN
  // =========================================================

  const handleBackToLogin = () => {
    setRecoveryMode(false);
    setMessage('');
    setMessageType('error');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-300 shadow-xl p-7">

        {/* LOGO Y ENCABEZADO */}

        <div className="text-center mb-7">

          <div className="w-14 h-14 mx-auto bg-[#234156] text-[#f3a828] rounded-2xl flex items-center justify-center font-black text-xl shadow-sm">
            CdR
          </div>

          {recoveryMode ? (
            <>
              <h1 className="text-xl font-extrabold text-[#234156] mt-4">
                Restablecer contraseña
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Ingresa tu correo institucional y te enviaremos un enlace para crear una nueva contraseña.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-extrabold text-[#234156] mt-4">
                Acceso a la Intranet
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Ingresa con tu correo institucional y contraseña.
              </p>
            </>
          )}

        </div>

        {/* ===================================================
            RECUPERAR CONTRASEÑA
        =================================================== */}

        {recoveryMode ? (
          <form
            onSubmit={
              handlePasswordRecovery
            }
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
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="nombre@consejoderedaccion.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#234156] hover:bg-[#1a3142] disabled:opacity-60 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2"
            >

              <KeyRound className="w-4 h-4 text-[#f3a828]" />

              {loading
                ? 'Enviando...'
                : 'Enviar enlace de recuperación'}

            </button>

            <button
              type="button"
              onClick={
                handleBackToLogin
              }
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#234156] hover:bg-slate-100 py-2.5 rounded-xl transition-colors"
            >

              <ArrowLeft className="w-4 h-4" />

              Volver al inicio de sesión

            </button>

            {message && (
              <p
                className={`text-xs text-center rounded-lg p-3 border ${
                  messageType ===
                  'success'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-red-700 bg-red-50 border-red-200'
                }`}
              >
                {message}
              </p>
            )}

          </form>
        ) : (

          /* =================================================
             LOGIN NORMAL
          ================================================= */

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
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="nombre@consejoderedaccion.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none"
                />

              </div>

            </div>

            <div>

              <div className="flex items-center justify-between gap-3 mb-1">

                <label className="block text-xs font-bold text-[#234156] uppercase">
                  Contraseña
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setRecoveryMode(
                      true
                    );

                    setMessage('');
                  }}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>

              </div>

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
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) =>
                        !prev
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
              <p
                className={`text-xs text-center rounded-lg p-3 border ${
                  messageType ===
                  'success'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-red-700 bg-red-50 border-red-200'
                }`}
              >
                {message}
              </p>
            )}

          </form>
        )}

        <p className="text-[11px] text-center text-slate-400 mt-5">
          Acceso exclusivo para personal autorizado de Consejo de Redacción y ColombiaCheck.
        </p>

      </div>

    </div>
  );
};