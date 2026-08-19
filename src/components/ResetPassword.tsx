import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  UserCheck,
} from 'lucide-react';

import { supabase } from '../lib/supabase';

interface ResetPasswordProps {
  onSuccess: () => void;
  mode?: 'recovery' | 'invite';
}

export const ResetPassword: React.FC<
  ResetPasswordProps
> = ({
  onSuccess,
  mode = 'recovery',
}) => {
  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [success, setSuccess] =
    useState(false);

  const isInvite =
    mode === 'invite';

  // =========================================================
  // GUARDAR CONTRASEÑA
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage('');

    if (password.length < 8) {
      setMessage(
        'La contraseña debe tener mínimo 8 caracteres.'
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        'Las contraseñas no coinciden.'
      );

      return;
    }

    setLoading(true);

    const {
      error,
    } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      console.error(
        'Error actualizando contraseña:',
        error
      );

      setMessage(
        isInvite
          ? 'No fue posible configurar la contraseña. Solicita una nueva invitación.'
          : 'No fue posible actualizar la contraseña. Solicita un nuevo enlace de recuperación.'
      );

      setLoading(false);

      return;
    }

    setSuccess(true);

    setLoading(false);
  };

  // =========================================================
  // TERMINAR PROCESO
  // =========================================================

  const handleContinue =
    async () => {
      /*
        Cerramos la sesión temporal creada
        por Supabase al abrir el enlace.

        De esta forma el usuario deberá
        ingresar normalmente con su nueva
        contraseña.
      */

      await supabase.auth.signOut();

      onSuccess();
    };

  // =========================================================
  // PANTALLA
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">

        {/* ENCABEZADO */}

        <div className="text-center mb-7">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#234156] text-[#f3a828] flex items-center justify-center font-black text-xl mb-4">
            CdR
          </div>

          <h1 className="text-xl font-extrabold text-[#234156]">

            {isInvite
              ? 'Configurar contraseña de acceso'
              : 'Crear nueva contraseña'}

          </h1>

          <p className="text-sm text-slate-500 mt-2">

            {isInvite
              ? 'Antes de ingresar por primera vez a la Intranet, crea tu contraseña personal.'
              : 'Define una nueva contraseña para acceder a la Intranet.'}

          </p>

        </div>


        {/* ===================================================
            PROCESO COMPLETADO
        =================================================== */}

        {success ? (

          <div className="text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-4">

              {isInvite ? (
                <UserCheck className="w-6 h-6" />
              ) : (
                <KeyRound className="w-6 h-6" />
              )}

            </div>

            <h2 className="font-extrabold text-[#234156]">

              {isInvite
                ? 'Acceso configurado'
                : 'Contraseña actualizada'}

            </h2>

            <p className="text-sm text-slate-500 mt-2 mb-6">

              {isInvite
                ? 'Tu contraseña fue creada correctamente. Ya puedes ingresar a la Intranet.'
                : 'Tu nueva contraseña fue guardada correctamente.'}

            </p>

            <button
              type="button"
              onClick={
                handleContinue
              }
              className="w-full bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold py-3 rounded-xl"
            >
              Ir al inicio de sesión
            </button>

          </div>

        ) : (

          /* =================================================
             FORMULARIO
          ================================================= */

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >

            {/* NUEVA CONTRASEÑA */}

            <div>

              <label className="block text-xs font-bold text-[#234156] uppercase mb-1">
                Nueva contraseña
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
                  autoComplete="new-password"
                  value={
                    password
                  }
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Mínimo 8 caracteres"
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


            {/* CONFIRMAR CONTRASEÑA */}

            <div>

              <label className="block text-xs font-bold text-[#234156] uppercase mb-1">
                Confirmar nueva contraseña
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  autoComplete="new-password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Repite la contraseña"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#234156] outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) =>
                        !prev
                    )
                  }
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                  title={
                    showConfirmPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >

                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}

                </button>

              </div>

            </div>


            {/* AVISO */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">

              <p className="text-[11px] text-slate-600 leading-relaxed">

                La contraseña debe tener mínimo
                <strong className="text-[#234156]">
                  {' '}8 caracteres
                </strong>
                . No compartas tu contraseña con otras personas.

              </p>

            </div>


            {/* ERROR */}

            {message && (

              <p className="text-xs text-center text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {message}
              </p>

            )}


            {/* GUARDAR */}

            <button
              type="submit"
              disabled={
                loading
              }
              className="w-full bg-[#234156] hover:bg-[#1a3142] disabled:opacity-60 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2"
            >

              {isInvite ? (
                <UserCheck className="w-4 h-4 text-[#f3a828]" />
              ) : (
                <KeyRound className="w-4 h-4 text-[#f3a828]" />
              )}

              {loading
                ? 'Guardando...'
                : isInvite
                ? 'Configurar contraseña'
                : 'Guardar nueva contraseña'}

            </button>

          </form>

        )}

      </div>

    </div>
  );
};