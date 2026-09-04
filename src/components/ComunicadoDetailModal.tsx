import React from 'react';

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
} from 'lucide-react';


interface ComunicadoDetailModalProps {
  comunicado: Comunicado | null;

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

  for (const pattern of patterns) {
    const match =
      url.match(pattern);

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

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
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
      new URL(url);

    if (
      parsed.hostname.includes(
        'youtu.be'
      )
    ) {
      return parsed.pathname
        .replace('/', '')
        .split('?')[0];
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
        return parsed.pathname
          .split('/embed/')[1]
          ?.split('/')[0] || null;
      }

      if (
        parsed.pathname.startsWith(
          '/shorts/'
        )
      ) {
        return parsed.pathname
          .split('/shorts/')[1]
          ?.split('/')[0] || null;
      }

      return parsed.searchParams.get(
        'v'
      );
    }

    return null;
  } catch {
    return null;
  }
};


// =========================================================
// FORMATO DE CONTENIDO
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


// Convierte los comunicados antiguos que usaban
// texto plano / Markdown básico.

const legacyTextToHtml = (
  text: string
) => {
  const escaped =
    escapeHtml(text);

  const withBold =
    escaped.replace(
      /\*\*(.*?)\*\*/g,
      '<strong>$1</strong>'
    );

  const lines =
    withBold.split('\n');

  let html = '';

  let inUnorderedList =
    false;

  let inOrderedList =
    false;


  const closeLists =
    () => {
      if (
        inUnorderedList
      ) {
        html += '</ul>';

        inUnorderedList =
          false;
      }

      if (
        inOrderedList
      ) {
        html += '</ol>';

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


      if (!trimmed) {
        closeLists();

        return;
      }


      const bulletMatch =
        trimmed.match(
          /^[-*]\s*(.+)$/
        );

      if (
        bulletMatch
      ) {
        if (
          inOrderedList
        ) {
          html += '</ol>';

          inOrderedList =
            false;
        }

        if (
          !inUnorderedList
        ) {
          html += '<ul>';

          inUnorderedList =
            true;
        }

        html +=
          `<li>${bulletMatch[1]}</li>`;

        return;
      }


      const numberedMatch =
        trimmed.match(
          /^\d+\.\s*(.+)$/
        );

      if (
        numberedMatch
      ) {
        if (
          inUnorderedList
        ) {
          html += '</ul>';

          inUnorderedList =
            false;
        }

        if (
          !inOrderedList
        ) {
          html += '<ol>';

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


  // Eliminamos elementos que no queremos permitir.

  doc.querySelectorAll(
    'script, style, iframe, object, embed, form, input, button'
  ).forEach(
    (
      element
    ) =>
      element.remove()
  );


  doc.body
    .querySelectorAll('*')
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
              attribute.name.toLowerCase();

            const value =
              attribute.value
                .trim()
                .toLowerCase();


            // Quitar eventos JS:
            // onclick, onerror, etc.

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


            // Quitar estilos pegados desde otros sitios.

            if (
              name ===
              'style'
            ) {
              element.removeAttribute(
                attribute.name
              );

              return;
            }


            // Evitar javascript:

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
          element.tagName.toLowerCase() ===
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


  return doc.body.innerHTML;
};


// =========================================================
// PREPARAR CONTENIDO
// =========================================================

const prepareContent = (
  content: string
) => {
  if (!content) {
    return '';
  }


  // Si ya contiene etiquetas HTML,
  // viene del nuevo editor.

  const looksLikeHtml =
    /<\/?[a-z][\s\S]*>/i.test(
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
// MEDIA: IMAGEN
// =========================================================

const ImageMedia = ({
  item,
}: {
  item: ComunicadoMedia;
}) => {
  const imageUrl =
    getDriveImageUrl(
      item.url
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

      <a
        href={
          item.url
        }
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={
            imageUrl
          }
          alt={
            item.name
          }
          loading="lazy"
          className="w-full max-h-[520px] object-contain bg-slate-100"
        />
      </a>


      <div className="px-4 py-3 flex items-center justify-between gap-3">

        <div className="flex items-center gap-2 min-w-0">

          <ImageIcon className="w-4 h-4 text-[#234156] shrink-0" />

          <span className="text-xs font-bold text-slate-700 truncate">
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
          className="text-[10px] font-extrabold text-[#234156] hover:underline shrink-0"
        >
          Abrir original
        </a>

      </div>

    </div>
  );
};


// =========================================================
// MEDIA: VIDEO
// =========================================================

const VideoMedia = ({
  item,
}: {
  item: ComunicadoMedia;
}) => {
  const youtubeId =
    getYouTubeVideoId(
      item.url
    );

  const drivePreview =
    getDrivePreviewUrl(
      item.url
    );


  // YouTube

  if (
    youtubeId
  ) {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">

        <div className="aspect-video">

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


        <div className="bg-white px-4 py-3">

          <div className="flex items-center gap-2">

            <Video className="w-4 h-4 text-[#234156]" />

            <span className="text-xs font-bold text-slate-700">
              {
                item.name
              }
            </span>

          </div>

        </div>

      </div>
    );
  }


  // Google Drive

  if (
    drivePreview
  ) {
    return (
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">

        <div className="aspect-video">

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


        <div className="bg-white px-4 py-3">

          <div className="flex items-center gap-2">

            <Video className="w-4 h-4 text-[#234156]" />

            <span className="text-xs font-bold text-slate-700">
              {
                item.name
              }
            </span>

          </div>

        </div>

      </div>
    );
  }


  // Cualquier otro video:
  // dejamos tarjeta para abrir.

  return (
    <MediaLinkCard
      item={
        item
      }
    />
  );
};


// =========================================================
// MEDIA: DOCUMENTO / ENLACE
// =========================================================

const MediaLinkCard = ({
  item,
}: {
  item: ComunicadoMedia;
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
      className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
    >

      <div className="flex items-center gap-3 min-w-0">

        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#234156] flex items-center justify-center shrink-0">

          {isDocument ? (
            <FileText className="w-5 h-5" />
          ) : (
            <LinkIcon className="w-5 h-5" />
          )}

        </div>


        <div className="min-w-0">

          <p className="text-xs font-extrabold text-[#234156]">
            {
              item.name
            }
          </p>

          <p className="text-[10px] text-slate-400 truncate mt-0.5">
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
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">

        <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto text-slate-900">


          {/* =============================================== */}
          {/* ENCABEZADO */}
          {/* =============================================== */}

          <div className="sticky top-0 z-20 bg-white px-6 md:px-8 pt-6 pb-4 border-b border-slate-100">

            <div className="flex justify-between items-start gap-4">

              <div className="min-w-0">

                <div className="flex items-center gap-2 flex-wrap mb-2">

                  <span className="text-[10px] font-extrabold text-slate-900 bg-[#f3a828] px-2.5 py-1 rounded border border-amber-300 uppercase tracking-wider">
                    {
                      comunicado.category
                    }
                  </span>


                  {comunicado.pinned && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200">
                      📌 Comunicado Fijado
                    </span>
                  )}

                </div>


                <h2 className="text-xl md:text-2xl font-extrabold text-[#234156] leading-snug">
                  {
                    comunicado.title
                  }
                </h2>


                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-3 font-medium">

                  <span className="flex items-center gap-1 font-semibold">

                    <Calendar className="w-3.5 h-3.5 text-[#234156]" />

                    {
                      comunicado.date
                    }

                  </span>


                  <span className="flex items-center gap-1 font-semibold">

                    <User className="w-3.5 h-3.5 text-[#234156]" />

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

                </div>

              </div>


              <button
                type="button"
                onClick={
                  onClose
                }
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 font-bold shrink-0"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

          </div>


          <div className="p-6 md:p-8">


            {/* =============================================== */}
            {/* IMÁGENES */}
            {/* =============================================== */}

            {images.length >
              0 && (
              <div className="space-y-4 mb-7">

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
            )}


            {/* =============================================== */}
            {/* CONTENIDO */}
            {/* =============================================== */}

            <div
              className="
                comunicado-content
                text-sm
                text-slate-700
                leading-7

                [&_p]:mb-4

                [&_strong]:font-extrabold
                [&_strong]:text-slate-900

                [&_em]:italic

                [&_u]:underline

                [&_ul]:list-disc
                [&_ul]:pl-6
                [&_ul]:mb-4
                [&_ul]:space-y-1

                [&_ol]:list-decimal
                [&_ol]:pl-6
                [&_ol]:mb-4
                [&_ol]:space-y-1

                [&_li]:pl-1

                [&_a]:text-blue-700
                [&_a]:font-bold
                [&_a]:underline
                [&_a]:underline-offset-2
                [&_a]:hover:text-blue-900
              "
              dangerouslySetInnerHTML={{
                __html:
                  preparedContent,
              }}
            />


            {/* =============================================== */}
            {/* VIDEOS */}
            {/* =============================================== */}

            {videos.length >
              0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">

                <div className="flex items-center gap-2 mb-4">

                  <Video className="w-4 h-4 text-[#234156]" />

                  <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider">
                    Videos
                  </h4>

                </div>


                <div className="space-y-5">

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


            {/* =============================================== */}
            {/* DOCUMENTOS Y ENLACES NUEVOS */}
            {/* =============================================== */}

            {documentsAndLinks.length >
              0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">

                <div className="flex items-center gap-2 mb-4">

                  <Paperclip className="w-4 h-4 text-[#234156]" />

                  <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider">
                    Recursos y documentos
                  </h4>

                </div>


                <div className="space-y-2">

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


            {/* =============================================== */}
            {/* ADJUNTOS ANTIGUOS */}
            {/* =============================================== */}

            {comunicado.attachments &&
              comunicado.attachments.length >
                0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">

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
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <FileText className="w-5 h-5 text-[#234156] shrink-0" />

                            <span className="text-xs font-bold text-slate-800 truncate">
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
                                className="bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 shadow-xs border border-slate-700 shrink-0"
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


            {/* =============================================== */}
            {/* CERRAR */}
            {/* =============================================== */}

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">

              <button
                type="button"
                onClick={
                  onClose
                }
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200"
              >
                Cerrar Comunicado
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  };