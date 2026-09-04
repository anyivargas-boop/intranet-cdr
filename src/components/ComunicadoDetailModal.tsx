import React, {
  useEffect,
} from 'react';

import {
  Comunicado,
  ComunicadoMedia,
} from '../types';

import {
  Calendar,
  User,
  FileText,
  ExternalLink,
  X,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Paperclip,
  Bell,
} from 'lucide-react';


interface ComunicadoDetailModalProps {
  comunicado:
    | Comunicado
    | null;

  onClose: () => void;
}


// =========================================================
// GOOGLE DRIVE
// =========================================================

const getGoogleDriveFileId = (
  url: string
): string | null => {

  if (!url) {
    return null;
  }

  const patterns = [
    /\/file\/d\/([^/]+)/,
    /[?&]id=([^&]+)/,
    /\/d\/([^/]+)/,
  ];

  for (
    const pattern
    of patterns
  ) {
    const match =
      url.match(
        pattern
      );

    if (
      match &&
      match[1]
    ) {
      return match[1];
    }
  }

  return null;
};


const getDriveImageUrl = (
  url: string
) => {

  const fileId =
    getGoogleDriveFileId(
      url
    );

  if (!fileId) {
    return url;
  }

  /*
   * IMPORTANTE:
   * Aquí antes tenías una cadena Markdown:
   *
   * [https://drive...](https://drive...)
   *
   * Eso NO sirve dentro de src="".
   * Debe devolverse únicamente la URL real.
   */

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
};


const getDrivePreviewUrl = (
  url: string
) => {

  const fileId =
    getGoogleDriveFileId(
      url
    );

  if (!fileId) {
    return null;
  }

  return `https://drive.google.com/file/d/${fileId}/preview`;
};


// =========================================================
// YOUTUBE
// =========================================================

const getYouTubeVideoId = (
  url: string
): string | null => {

  if (!url) {
    return null;
  }

  try {

    const parsed =
      new URL(
        url
      );


    if (
      parsed.hostname.includes(
        'youtu.be'
      )
    ) {
      return (
        parsed.pathname
          .replace(
            '/',
            ''
          )
          .split(
            '?'
          )[0] ||
        null
      );
    }


    if (
      parsed.hostname.includes(
        'youtube.com'
      )
    ) {

      if (
        parsed.pathname.startsWith(
          '/embed/'
        )
      ) {
        return (
          parsed.pathname
            .split(
              '/embed/'
            )[1]
            ?.split(
              '/'
            )[0] ||
          null
        );
      }


      if (
        parsed.pathname.startsWith(
          '/shorts/'
        )
      ) {
        return (
          parsed.pathname
            .split(
              '/shorts/'
            )[1]
            ?.split(
              '/'
            )[0] ||
          null
        );
      }


      return (
        parsed.searchParams.get(
          'v'
        )
      );
    }


    return null;

  } catch {

    return null;
  }
};


// =========================================================
// TEXTO ANTIGUO
// =========================================================

const escapeHtml = (
  text: string
) => {

  return text
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );
};


const legacyTextToHtml = (
  text: string
) => {

  const escaped =
    escapeHtml(
      text
    );


  const withBold =
    escaped.replace(
      /\*\*(.*?)\*\*/g,
      '<strong>$1</strong>'
    );


  const lines =
    withBold.split(
      '\n'
    );


  let html =
    '';

  let inUnorderedList =
    false;

  let inOrderedList =
    false;


  const closeLists =
    () => {

      if (
        inUnorderedList
      ) {
        html +=
          '</ul>';

        inUnorderedList =
          false;
      }


      if (
        inOrderedList
      ) {
        html +=
          '</ol>';

        inOrderedList =
          false;
      }
    };


  lines.forEach(
    (
      line
    ) => {

      const trimmed =
        line.trim();


      if (
        !trimmed
      ) {
        closeLists();

        return;
      }


      const bulletMatch =
        trimmed.match(
          /^[-*]\s+(.+)$/
        );


      if (
        bulletMatch
      ) {

        if (
          inOrderedList
        ) {
          html +=
            '</ol>';

          inOrderedList =
            false;
        }


        if (
          !inUnorderedList
        ) {
          html +=
            '<ul>';

          inUnorderedList =
            true;
        }


        html +=
          `<li>${bulletMatch[1]}</li>`;

        return;
      }


      const numberedMatch =
        trimmed.match(
          /^\d+\.\s+(.+)$/
        );


      if (
        numberedMatch
      ) {

        if (
          inUnorderedList
        ) {
          html +=
            '</ul>';

          inUnorderedList =
            false;
        }


        if (
          !inOrderedList
        ) {
          html +=
            '<ol>';

          inOrderedList =
            true;
        }


        html +=
          `<li>${numberedMatch[1]}</li>`;

        return;
      }


      closeLists();


      html +=
        `<p>${trimmed}</p>`;
    }
  );


  closeLists();


  return html;
};


// =========================================================
// SANITIZAR HTML
// =========================================================

const sanitizeHtml = (
  html: string
) => {

  if (
    typeof window ===
    'undefined'
  ) {
    return html;
  }


  const parser =
    new DOMParser();


  const doc =
    parser.parseFromString(
      html,
      'text/html'
    );


  doc.querySelectorAll(
    'script, style, iframe, object, embed, form, input, button'
  ).forEach(
    (
      element
    ) =>
      element.remove()
  );


  doc.body
    .querySelectorAll(
      '*'
    )
    .forEach(
      (
        element
      ) => {

        Array.from(
          element.attributes
        ).forEach(
          (
            attribute
          ) => {

            const name =
              attribute.name
                .toLowerCase();

            const value =
              attribute.value
                .trim()
                .toLowerCase();


            if (
              name.startsWith(
                'on'
              )
            ) {
              element.removeAttribute(
                attribute.name
              );

              return;
            }


            if (
              name ===
              'style'
            ) {
              element.removeAttribute(
                attribute.name
              );

              return;
            }


            if (
              (
                name ===
                  'href' ||
                name ===
                  'src'
              ) &&
              value.startsWith(
                'javascript:'
              )
            ) {
              element.removeAttribute(
                attribute.name
              );
            }
          }
        );


        if (
          element.tagName
            .toLowerCase() ===
          'a'
        ) {
          element.setAttribute(
            'target',
            '_blank'
          );

          element.setAttribute(
            'rel',
            'noopener noreferrer'
          );
        }
      }
    );


  return (
    doc.body.innerHTML
  );
};


// =========================================================
// PREPARAR CONTENIDO
// =========================================================

const prepareContent = (
  content: string
) => {

  if (
    !content
  ) {
    return '';
  }


  /*
   * Detectamos contenido HTML guardado desde el editor.
   * Si ya viene con <p>, <strong>, <ul>, etc.,
   * NO lo escapamos.
   */

  const looksLikeHtml =
    /<\/?[a-z][\s\S]*?>/i.test(
      content
    );


  const html =
    looksLikeHtml
      ? content
      : legacyTextToHtml(
          content
        );


  return sanitizeHtml(
    html
  );
};


// =========================================================
// IMAGEN
// =========================================================

const ImageMedia = ({
  item,
}: {
  item:
    ComunicadoMedia;
}) => {

  const imageUrl =
    getDriveImageUrl(
      item.url
    );


  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">

      {/* =================================================== */}
      {/* IMAGEN COMPLETA */}
      {/* =================================================== */}

      <div className="w-full bg-slate-50 p-2 sm:p-3">

        <img
          src={
            imageUrl
          }
          alt={
            item.name ||
            'Imagen del comunicado'
          }
          loading="lazy"
          className="
            block
            w-full
            h-auto
            max-w-full
            object-contain
            rounded-xl
            bg-slate-50
          "
        />

      </div>


      {/* =================================================== */}
      {/* INFORMACIÓN DE LA IMAGEN */}
      {/* =================================================== */}

      <div className="px-3 sm:px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">

        <div className="flex items-start sm:items-center gap-2 min-w-0">

          <ImageIcon className="w-4 h-4 text-[#234156] shrink-0 mt-0.5 sm:mt-0" />

          <span className="text-xs font-bold text-slate-700 break-words [overflow-wrap:anywhere] min-w-0">
            {
              item.name
            }
          </span>

        </div>


        <a
          href={
            item.url
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-extrabold text-[#234156] hover:underline shrink-0"
        >
          Abrir original
        </a>

      </div>

    </div>
  );
};


// =========================================================
// VIDEO
// =========================================================

const VideoMedia = ({
  item,
}: {
  item:
    ComunicadoMedia;
}) => {

  const youtubeId =
    getYouTubeVideoId(
      item.url
    );


  const drivePreview =
    getDrivePreviewUrl(
      item.url
    );


  // =======================================================
  // YOUTUBE
  // =======================================================

  if (
    youtubeId
  ) {
    return (
      <div className="w-full min-w-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">

        <div className="aspect-video w-full">

          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={
              item.name
            }
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

        </div>


        <div className="bg-white px-3 sm:px-4 py-3">

          <div className="flex items-start gap-2">

            <Video className="w-4 h-4 text-[#234156] shrink-0 mt-0.5" />

            <span className="text-xs font-bold text-slate-700 break-words [overflow-wrap:anywhere]">
              {
                item.name
              }
            </span>

          </div>

        </div>

      </div>
    );
  }


  // =======================================================
  // GOOGLE DRIVE
  // =======================================================

  if (
    drivePreview
  ) {
    return (
      <div className="w-full min-w-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">

        <div className="aspect-video w-full">

          <iframe
            src={
              drivePreview
            }
            title={
              item.name
            }
            className="w-full h-full"
            allow="autoplay"
            allowFullScreen
          />

        </div>


        <div className="bg-white px-3 sm:px-4 py-3">

          <div className="flex items-start gap-2">

            <Video className="w-4 h-4 text-[#234156] shrink-0 mt-0.5" />

            <span className="text-xs font-bold text-slate-700 break-words [overflow-wrap:anywhere]">
              {
                item.name
              }
            </span>

          </div>

        </div>

      </div>
    );
  }


  return (
    <MediaLinkCard
      item={
        item
      }
    />
  );
};


// =========================================================
// DOCUMENTO / ENLACE
// =========================================================

const MediaLinkCard = ({
  item,
}: {
  item:
    ComunicadoMedia;
}) => {

  const isDocument =
    item.mediaType ===
    'document';


  return (
    <a
      href={
        item.url
      }
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-full
        min-w-0
        flex
        items-center
        justify-between
        gap-3
        p-3
        sm:p-4
        rounded-xl
        border
        border-slate-200
        bg-slate-50
        hover:bg-slate-100
        transition-colors
        overflow-hidden
      "
    >

      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">

        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#234156] flex items-center justify-center shrink-0">

          {isDocument ? (
            <FileText className="w-5 h-5" />
          ) : (
            <LinkIcon className="w-5 h-5" />
          )}

        </div>


        <div className="min-w-0 flex-1">

          <p className="text-xs font-extrabold text-[#234156] break-words [overflow-wrap:anywhere]">
            {
              item.name
            }
          </p>

          <p className="text-[10px] text-slate-400 mt-1 break-all line-clamp-2">
            {
              item.url
            }
          </p>

        </div>

      </div>


      <ExternalLink className="w-4 h-4 text-[#f3a828] shrink-0" />

    </a>
  );
};


// =========================================================
// MODAL
// =========================================================

export const ComunicadoDetailModal:
  React.FC<
    ComunicadoDetailModalProps
  > = ({
    comunicado,
    onClose,
  }) => {

  // =======================================================
  // BLOQUEAR SCROLL DEL FONDO
  // =======================================================

  useEffect(
    () => {

      if (
        !comunicado
      ) {
        return;
      }


      const previousOverflow =
        document.body.style
          .overflow;

      const previousPosition =
        document.body.style
          .position;

      const previousWidth =
        document.body.style
          .width;


      document.body.style
        .overflow =
        'hidden';

      document.body.style
        .position =
        'relative';

      document.body.style
        .width =
        '100%';


      return () => {

        document.body.style
          .overflow =
          previousOverflow;

        document.body.style
          .position =
          previousPosition;

        document.body.style
          .width =
          previousWidth;
      };

    },
    [
      comunicado,
    ]
  );


  if (
    !comunicado
  ) {
    return null;
  }


  const preparedContent =
    prepareContent(
      comunicado.content
    );


  const images =
    (
      comunicado.media ||
      []
    ).filter(
      (
        item
      ) =>
        item.mediaType ===
        'image'
    );


  const videos =
    (
      comunicado.media ||
      []
    ).filter(
      (
        item
      ) =>
        item.mediaType ===
        'video'
    );


  const documentsAndLinks =
    (
      comunicado.media ||
      []
    ).filter(
      (
        item
      ) =>
        item.mediaType ===
          'document' ||
        item.mediaType ===
          'link'
    );


  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        bg-slate-950/75
        sm:backdrop-blur-sm
        overflow-y-auto
        overflow-x-hidden
        overscroll-contain
        touch-pan-y
        [-webkit-overflow-scrolling:touch]
      "
    >

      {/* ===================================================== */}
      {/* ENVOLTURA GENERAL */}
      {/* ===================================================== */}

      <div
        className="
          w-full
          min-h-full
          flex
          items-start
          justify-center
          p-0
          sm:p-4
          md:p-6
        "
      >

        {/* =================================================== */}
        {/* CONTENEDOR DEL COMUNICADO */}
        {/* =================================================== */}

        <div
          className="
            bg-white
            w-full
            min-h-[100dvh]
            sm:min-h-0
            sm:h-auto
            sm:max-w-5xl
            rounded-none
            sm:rounded-2xl
            border-0
            sm:border
            sm:border-slate-300
            shadow-2xl
            text-slate-900
            min-w-0
            overflow-hidden
            sm:my-3
          "
        >

          {/* ================================================= */}
          {/* CABECERA */}
          {/* ================================================= */}

          <div className="bg-white px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-5 border-b border-slate-100">

            <div className="flex justify-between items-start gap-3">

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2 mb-3">

                  <span className="max-w-full text-[10px] font-extrabold text-slate-900 bg-[#f3a828] px-2.5 py-1 rounded border border-amber-300 uppercase tracking-wider break-words">
                    {
                      comunicado.category
                    }
                  </span>


                  {comunicado.pinned && (
                    <span className="max-w-full text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200 break-words">
                      📌 Comunicado Fijado
                    </span>
                  )}

                </div>


                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#234156] leading-tight break-words [overflow-wrap:anywhere]">
                  {
                    comunicado.title
                  }
                </h2>


                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-5 mt-4 text-xs text-slate-500 font-medium min-w-0">

                  {comunicado.date && (
                    <span className="flex items-center gap-2 font-semibold min-w-0">

                      <Calendar className="w-4 h-4 text-[#234156] shrink-0" />

                      <span className="break-words">
                        {
                          comunicado.date
                        }
                      </span>

                    </span>
                  )}


                  {(comunicado.author ||
                    comunicado.authorRole) && (
                    <span className="flex items-start gap-2 font-semibold min-w-0">

                      <User className="w-4 h-4 text-[#234156] shrink-0 mt-0.5" />

                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">

                        {
                          comunicado.author
                        }

                        {comunicado.authorRole && (
                          <>
                            {' '}
                            (
                            {
                              comunicado.authorRole
                            }
                            )
                          </>
                        )}

                      </span>

                    </span>
                  )}

                </div>

              </div>


              <button
                type="button"
                onClick={
                  onClose
                }
                aria-label="Cerrar comunicado"
                className="
                  w-10
                  h-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  text-slate-400
                  hover:text-slate-700
                  hover:bg-slate-100
                  shrink-0
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>

          </div>


          {/* ================================================= */}
          {/* CONTENIDO DEL COMUNICADO */}
          {/* YA NO TIENE SCROLL INTERNO */}
          {/* ================================================= */}

          <div className="w-full min-w-0 p-4 sm:p-6 md:p-8">


            {/* ================================================= */}
            {/* RESUMEN */}
            {/* ================================================= */}

            {comunicado.summary && (
              <div className="w-full bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 mb-7">

                <div className="flex items-start gap-3">

                  <Bell className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />

                  <div className="min-w-0">

                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700">
                      Resumen
                    </p>

                    <p className="text-sm sm:text-[15px] leading-6 text-slate-700 mt-2 break-words">
                      {
                        comunicado.summary
                      }
                    </p>

                  </div>

                </div>

              </div>
            )}


            {/* ================================================= */}
            {/* CONTENIDO */}
            {/* ================================================= */}

            {preparedContent && (
              <div className="w-full min-w-0">

                <div className="flex items-center gap-2 mb-4">

                  <FileText className="w-5 h-5 text-[#234156] shrink-0" />

                  <h3 className="text-base font-extrabold text-[#234156]">
                    Información
                  </h3>

                </div>


                <div
                  className="
                    comunicado-content
                    w-full
                    min-w-0
                    text-sm
                    sm:text-[15px]
                    text-slate-700
                    leading-7
                    break-words
                    [overflow-wrap:anywhere]

                    [&_p]:mb-4
                    [&_p]:max-w-full
                    [&_p]:break-words

                    [&_strong]:font-extrabold
                    [&_strong]:text-slate-900

                    [&_em]:italic

                    [&_u]:underline

                    [&_br]:block

                    [&_ul]:list-disc
                    [&_ul]:pl-5
                    [&_ul]:sm:pl-6
                    [&_ul]:mb-4
                    [&_ul]:space-y-1
                    [&_ul]:max-w-full

                    [&_ol]:list-decimal
                    [&_ol]:pl-5
                    [&_ol]:sm:pl-6
                    [&_ol]:mb-4
                    [&_ol]:space-y-1
                    [&_ol]:max-w-full

                    [&_li]:pl-1
                    [&_li]:break-words

                    [&_a]:text-blue-700
                    [&_a]:font-bold
                    [&_a]:underline
                    [&_a]:underline-offset-2
                    [&_a]:hover:text-blue-900
                    [&_a]:break-all

                    [&_img]:max-w-full
                    [&_img]:h-auto

                    [&_h1]:text-2xl
                    [&_h1]:font-extrabold
                    [&_h1]:text-[#234156]
                    [&_h1]:mb-4

                    [&_h2]:text-xl
                    [&_h2]:font-extrabold
                    [&_h2]:text-[#234156]
                    [&_h2]:mb-4

                    [&_h3]:text-lg
                    [&_h3]:font-extrabold
                    [&_h3]:text-[#234156]
                    [&_h3]:mb-3
                  "
                  dangerouslySetInnerHTML={{
                    __html:
                      preparedContent,
                  }}
                />

              </div>
            )}


            {/* ================================================= */}
            {/* IMÁGENES */}
            {/* VAN COMPLETAS HACIA ABAJO */}
            {/* ================================================= */}

            {images.length >
              0 && (
              <div className="w-full min-w-0 mt-8 pt-6 border-t border-slate-100">

                <div className="flex items-center gap-2 mb-4">

                  <ImageIcon className="w-5 h-5 text-[#234156] shrink-0" />

                  <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider">
                    Recursos del comunicado
                  </h4>

                </div>


                <div className="w-full min-w-0 space-y-6">

                  {images.map(
                    (
                      item,
                      index
                    ) => (
                      <ImageMedia
                        key={
                          item.id ||
                          `image-${index}`
                        }
                        item={
                          item
                        }
                      />
                    )
                  )}

                </div>

              </div>
            )}


            {/* ================================================= */}
            {/* VIDEOS */}
            {/* ================================================= */}

            {videos.length >
              0 && (
              <div className="w-full min-w-0 mt-8 pt-6 border-t border-slate-100">

                <div className="flex items-center gap-2 mb-4">

                  <Video className="w-4 h-4 text-[#234156] shrink-0" />

                  <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider">
                    Videos
                  </h4>

                </div>


                <div className="space-y-5 w-full min-w-0">

                  {videos.map(
                    (
                      item,
                      index
                    ) => (
                      <VideoMedia
                        key={
                          item.id ||
                          `video-${index}`
                        }
                        item={
                          item
                        }
                      />
                    )
                  )}

                </div>

              </div>
            )}


            {/* ================================================= */}
            {/* DOCUMENTOS Y ENLACES */}
            {/* ================================================= */}

            {documentsAndLinks.length >
              0 && (
              <div className="w-full min-w-0 mt-8 pt-6 border-t border-slate-100">

                <div className="flex items-center gap-2 mb-4">

                  <Paperclip className="w-4 h-4 text-[#234156] shrink-0" />

                  <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider">
                    Recursos y documentos
                  </h4>

                </div>


                <div className="space-y-2 w-full min-w-0">

                  {documentsAndLinks.map(
                    (
                      item,
                      index
                    ) => (
                      <MediaLinkCard
                        key={
                          item.id ||
                          `resource-${index}`
                        }
                        item={
                          item
                        }
                      />
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
                <div className="w-full min-w-0 mt-8 pt-6 border-t border-slate-100">

                  <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider mb-3">
                    Documentos Adjuntos
                  </h4>


                  <div className="space-y-2">

                    {comunicado.attachments.map(
                      (
                        att,
                        idx
                      ) => (
                        <div
                          key={
                            idx
                          }
                          className="w-full min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden"
                        >

                          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">

                            <FileText className="w-5 h-5 text-[#234156] shrink-0 mt-0.5 sm:mt-0" />

                            <span className="text-xs font-bold text-slate-800 break-words [overflow-wrap:anywhere] min-w-0">
                              {
                                att.name
                              }
                            </span>

                          </div>


                          {att.url &&
                            att.url !==
                              '#' && (
                              <a
                                href={
                                  att.url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-xs border border-slate-700 shrink-0"
                              >

                                <span>
                                  Abrir documento
                                </span>

                                <ExternalLink className="w-3.5 h-3.5 text-[#f3a828]" />

                              </a>
                            )}

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}


            {/* ================================================= */}
            {/* BOTÓN CERRAR */}
            {/* ================================================= */}

            <div className="mt-8 pt-5 pb-[max(8px,env(safe-area-inset-bottom))] border-t border-slate-100 flex justify-stretch sm:justify-end">

              <button
                type="button"
                onClick={
                  onClose
                }
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200"
              >
                Cerrar Comunicado
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};