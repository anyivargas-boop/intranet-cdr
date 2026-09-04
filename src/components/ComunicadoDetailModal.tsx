import React from 'react';

import {
  Bell,
  Calendar,
  User,
  FileText,
  Download,
  ExternalLink,
  X,
  ShieldCheck,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
} from 'lucide-react';

import {
  Comunicado,
  ComunicadoMedia,
} from '../types';


interface ComunicadoDetailModalProps {
  comunicado: Comunicado | null;
  onClose: () => void;
}


export const ComunicadoDetailModal: React.FC<
  ComunicadoDetailModalProps
> = ({
  comunicado,
  onClose,
}) => {
  if (!comunicado) {
    return null;
  }


  const renderMediaItem = (
    item: ComunicadoMedia,
    index: number
  ) => {
    const mediaType =
      item.mediaType ||
      'link';

    const mediaName =
      item.name ||
      `Recurso ${index + 1}`;


    if (
      mediaType ===
      'image'
    ) {
      return (
        <div
          key={
            item.id ||
            `${item.url}-${index}`
          }
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
        >

          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">

            <ImageIcon className="w-4 h-4 text-[#234156]" />

            <span className="text-xs font-extrabold text-[#234156]">
              {mediaName}
            </span>

          </div>


          <div className="p-3 md:p-5 bg-slate-50">

            <img
              src={
                item.url
              }
              alt={
                mediaName
              }
              className="w-full h-auto object-contain rounded-xl"
              loading="lazy"
            />

          </div>

        </div>
      );
    }


    if (
      mediaType ===
      'video'
    ) {
      return (
        <div
          key={
            item.id ||
            `${item.url}-${index}`
          }
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
        >

          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">

            <Video className="w-4 h-4 text-[#234156]" />

            <span className="text-xs font-extrabold text-[#234156]">
              {mediaName}
            </span>

          </div>


          <div className="p-4">

            <a
              href={
                item.url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 transition-colors"
            >

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-extrabold text-[#234156] truncate">
                    {mediaName}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Abrir recurso de video
                  </p>

                </div>

              </div>

              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />

            </a>

          </div>

        </div>
      );
    }


    return (
      <div
        key={
          item.id ||
          `${item.url}-${index}`
        }
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
      >

        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">

          <LinkIcon className="w-4 h-4 text-[#234156]" />

          <span className="text-xs font-extrabold text-[#234156]">
            {mediaName}
          </span>

        </div>


        <div className="p-4">

          <a
            href={
              item.url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 transition-colors"
          >

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-extrabold text-[#234156] truncate">
                  {mediaName}
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5 break-all">
                  {item.url}
                </p>

              </div>

            </div>

            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />

          </a>

        </div>

      </div>
    );
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">

      <div className="min-h-full w-full flex items-start justify-center p-3 sm:p-4 md:p-8">

        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-300 shadow-2xl w-full max-w-5xl text-slate-900 my-3 md:my-6 overflow-hidden">


          {/* ================================================= */}
          {/* CABECERA */}
          {/* ================================================= */}

          <div className="p-5 md:p-8 border-b border-slate-200">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2 mb-4">

                  <span className="inline-flex items-center rounded-md bg-[#f3a828] text-slate-950 border border-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                    {
                      comunicado.category
                    }
                  </span>


                  {comunicado.pinned && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 text-red-600 border border-red-200 px-3 py-1 text-[10px] font-extrabold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Comunicado Fijado
                    </span>
                  )}

                </div>


                <h2 className="text-2xl md:text-4xl font-black text-[#234156] leading-tight break-words">
                  {
                    comunicado.title
                  }
                </h2>


                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 text-xs text-slate-500">

                  {comunicado.date && (
                    <div className="flex items-center gap-2">

                      <Calendar className="w-4 h-4 text-[#234156]" />

                      <span className="font-semibold">
                        {
                          comunicado.date
                        }
                      </span>

                    </div>
                  )}


                  {comunicado.author && (
                    <div className="flex items-center gap-2">

                      <User className="w-4 h-4 text-[#234156]" />

                      <span className="font-semibold">
                        {
                          comunicado.author
                        }

                        {comunicado.authorRole && (
                          <>
                            {' '}
                            ({comunicado.authorRole})
                          </>
                        )}
                      </span>

                    </div>
                  )}

                </div>

              </div>


              <button
                type="button"
                onClick={
                  onClose
                }
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Cerrar comunicado"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

          </div>


          {/* ================================================= */}
          {/* CONTENIDO */}
          {/* ================================================= */}

          <div className="p-5 md:p-8 space-y-6">


            {/* RESUMEN */}

            {comunicado.summary && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">

                <div className="flex items-start gap-3">

                  <Bell className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                      Resumen
                    </p>

                    <p className="text-sm text-slate-700 leading-relaxed mt-1">
                      {
                        comunicado.summary
                      }
                    </p>

                  </div>

                </div>

              </div>
            )}


            {/* CONTENIDO PRINCIPAL */}

            {comunicado.content && (
              <div className="bg-white">

                <div className="flex items-center gap-2 mb-3">

                  <FileText className="w-5 h-5 text-[#234156]" />

                  <h3 className="text-sm font-extrabold text-[#234156]">
                    Información
                  </h3>

                </div>

                <div className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line break-words">
                  {
                    comunicado.content
                  }
                </div>

              </div>
            )}


            {/* ================================================= */}
            {/* MULTIMEDIA */}
            {/* ================================================= */}

            {comunicado.media &&
              comunicado.media.length >
                0 && (

                <div className="space-y-4">

                  <div className="flex items-center gap-2">

                    <PaperclipIcon />

                    <h3 className="text-sm font-extrabold text-[#234156]">
                      Recursos del comunicado
                    </h3>

                  </div>


                  <div className="space-y-5">

                    {comunicado.media.map(
                      (
                        item,
                        index
                      ) =>
                        renderMediaItem(
                          item,
                          index
                        )
                    )}

                  </div>

                </div>
              )}


            {/* ================================================= */}
            {/* ADJUNTOS ANTIGUOS */}
            {/* ================================================= */}

            {comunicado.attachments &&
              comunicado.attachments.length >
                0 && (

                <div className="space-y-3">

                  <div className="flex items-center gap-2">

                    <FileText className="w-5 h-5 text-[#234156]" />

                    <h3 className="text-sm font-extrabold text-[#234156]">
                      Documentos adjuntos
                    </h3>

                  </div>


                  <div className="space-y-3">

                    {comunicado.attachments.map(
                      (
                        attachment,
                        index
                      ) => (

                        <a
                          key={
                            `${attachment.url}-${index}`
                          }
                          href={
                            attachment.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-4 transition-colors"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>

                            <div className="min-w-0">

                              <p className="text-sm font-extrabold text-[#234156] break-words">
                                {
                                  attachment.name ||
                                  'Documento adjunto'
                                }
                              </p>

                              <p className="text-[10px] text-slate-400 mt-1">
                                Abrir documento
                              </p>

                            </div>

                          </div>


                          <div className="flex items-center gap-2 shrink-0">

                            <span className="flex items-center gap-1.5 text-xs font-extrabold text-blue-700">
                              <ExternalLink className="w-4 h-4" />
                              Abrir
                            </span>

                            <Download className="w-4 h-4 text-slate-400" />

                          </div>

                        </a>

                      )
                    )}

                  </div>

                </div>
              )}


            {/* ================================================= */}
            {/* BOTÓN CERRAR INFERIOR */}
            {/* ================================================= */}

            <div className="pt-4 border-t border-slate-100 flex justify-end">

              <button
                type="button"
                onClick={
                  onClose
                }
                className="bg-[#234156] hover:bg-[#1a3142] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-colors"
              >
                Cerrar
              </button>

            </div>


          </div>

        </div>

      </div>

    </div>
  );
};


// =========================================================
// ICONO AUXILIAR
// =========================================================

const PaperclipIcon = () => {
  return (
    <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#234156] flex items-center justify-center">
      <FileText className="w-4 h-4" />
    </div>
  );
};