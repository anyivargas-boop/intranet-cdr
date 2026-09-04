import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Bell,
  Save,
  X,
  Plus,
  Trash2,
  Image,
  Video,
  FileText,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  RotateCcw,
} from 'lucide-react';

import {
  Comunicado,
  ComunicadoCategory,
  ComunicadoMedia,
  ComunicadoMediaType,
} from '../types';


interface EditComunicadoModalProps {
  isOpen: boolean;

  comunicado: Comunicado | null;

  onClose: () => void;

  onSave: (
    comunicado: Comunicado
  ) => void | Promise<void>;
}


// =========================================================
// OPCIONES MULTIMEDIA
// =========================================================

const mediaTypeOptions: {
  value: ComunicadoMediaType;
  label: string;
}[] = [
  {
    value: 'image',
    label: 'Imagen',
  },
  {
    value: 'video',
    label: 'Video',
  },
  {
    value: 'document',
    label: 'Documento',
  },
  {
    value: 'link',
    label: 'Enlace',
  },
];


// =========================================================
// QUITAR HTML PARA VALIDACIONES
// =========================================================

const getPlainText = (
  html: string
) => {
  const div =
    document.createElement(
      'div'
    );

  div.innerHTML =
    html;

  return (
    div.textContent ||
    div.innerText ||
    ''
  ).trim();
};


// =========================================================
// CONVERTIR CONTENIDO ANTIGUO A HTML
// =========================================================

const legacyContentToHtml = (
  content: string
) => {
  if (!content) {
    return '';
  }

  const alreadyHtml =
    /<\/?[a-z][\s\S]*>/i.test(
      content
    );

  if (alreadyHtml) {
    return content;
  }

  return content
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong>$1</strong>'
    )
    .split('\n')
    .map(
      (
        line
      ) => {
        const trimmed =
          line.trim();

        if (!trimmed) {
          return '<br>';
        }

        if (
          trimmed.startsWith(
            '- '
          )
        ) {
          return `<div>• ${trimmed.substring(
            2
          )}</div>`;
        }

        if (
          trimmed.startsWith(
            '* '
          )
        ) {
          return `<div>• ${trimmed.substring(
            2
          )}</div>`;
        }

        return `<div>${trimmed}</div>`;
      }
    )
    .join('');
};


// =========================================================
// COMPONENTE
// =========================================================

export const EditComunicadoModal:
  React.FC<
    EditComunicadoModalProps
  > = ({
    isOpen,
    comunicado,
    onClose,
    onSave,
  }) => {

    // =====================================================
    // DATOS
    // =====================================================

    const [
      title,
      setTitle,
    ] = useState('');

    const [
      category,
      setCategory,
    ] =
      useState<ComunicadoCategory>(
        'Institucional'
      );

    const [
      summary,
      setSummary,
    ] = useState('');

    const [
      content,
      setContent,
    ] = useState('');

    const [
      author,
      setAuthor,
    ] = useState('');

    const [
      authorRole,
      setAuthorRole,
    ] = useState('');

    const [
      pinned,
      setPinned,
    ] = useState(false);

    const [
      saving,
      setSaving,
    ] = useState(false);


    // =====================================================
    // EDITOR
    // =====================================================

    const editorRef =
      useRef<HTMLDivElement | null>(
        null
      );


    // =====================================================
    // MULTIMEDIA
    // =====================================================

    const [
      mediaType,
      setMediaType,
    ] =
      useState<ComunicadoMediaType>(
        'image'
      );

    const [
      mediaName,
      setMediaName,
    ] = useState('');

    const [
      mediaUrl,
      setMediaUrl,
    ] = useState('');

    const [
      media,
      setMedia,
    ] =
      useState<ComunicadoMedia[]>(
        []
      );


    // =====================================================
    // CARGAR COMUNICADO
    // =====================================================

    useEffect(() => {
      if (
        !isOpen ||
        !comunicado
      ) {
        return;
      }

      setTitle(
        comunicado.title || ''
      );

      setCategory(
        comunicado.category ||
          'Institucional'
      );

      setSummary(
        comunicado.summary || ''
      );

      const htmlContent =
        legacyContentToHtml(
          comunicado.content || ''
        );

      setContent(
        htmlContent
      );

      setAuthor(
        comunicado.author || ''
      );

      setAuthorRole(
        comunicado.authorRole ||
          ''
      );

      setPinned(
        Boolean(
          comunicado.pinned
        )
      );


      // Multimedia nueva
      const currentMedia:
        ComunicadoMedia[] = [
          ...(
            comunicado.media ||
            []
          ),
        ];


      // Convertimos adjuntos antiguos en recursos editables
      // solamente si no están ya incluidos.
      (
        comunicado.attachments ||
        []
      ).forEach(
        (
          attachment
        ) => {
          if (
            !attachment.url ||
            attachment.url ===
              '#'
          ) {
            return;
          }

          const alreadyExists =
            currentMedia.some(
              (
                item
              ) =>
                item.url ===
                attachment.url
            );

          if (
            !alreadyExists
          ) {
            currentMedia.push({
              mediaType:
                'document',

              name:
                attachment.name ||
                'Documento adjunto',

              url:
                attachment.url,

              sortOrder:
                currentMedia.length,
            });
          }
        }
      );


      setMedia(
        currentMedia.map(
          (
            item,
            index
          ) => ({
            ...item,

            sortOrder:
              index,
          })
        )
      );

      setMediaType(
        'image'
      );

      setMediaName('');

      setMediaUrl('');


      window.setTimeout(
        () => {
          if (
            editorRef.current
          ) {
            editorRef.current.innerHTML =
              htmlContent;
          }
        },
        0
      );

    }, [
      isOpen,
      comunicado,
    ]);


    // =====================================================
    // CERRAR
    // =====================================================

    const handleClose =
      () => {
        if (saving) {
          return;
        }

        onClose();
      };


    // =====================================================
    // FORMATO
    // =====================================================

    const applyFormat = (
      command: string,
      value?: string
    ) => {
      editorRef.current?.focus();

      document.execCommand(
        command,
        false,
        value
      );

      if (
        editorRef.current
      ) {
        setContent(
          editorRef.current
            .innerHTML
        );
      }
    };


    const handleInsertLink =
      () => {
        const url =
          window.prompt(
            'Pega el enlace que deseas agregar:'
          );

        if (!url) {
          return;
        }

        applyFormat(
          'createLink',
          url
        );
      };


    const handleClearFormatting =
      () => {
        applyFormat(
          'removeFormat'
        );
      };


    // =====================================================
    // AGREGAR RECURSO
    // =====================================================

    const handleAddMedia =
      () => {
        const cleanName =
          mediaName.trim();

        const cleanUrl =
          mediaUrl.trim();

        if (
          !cleanName
        ) {
          alert(
            'Escribe un nombre para el recurso.'
          );

          return;
        }

        if (
          !cleanUrl
        ) {
          alert(
            'Pega el enlace del recurso.'
          );

          return;
        }

        try {
          new URL(
            cleanUrl
          );
        } catch {
          alert(
            'El enlace no parece ser una URL válida.'
          );

          return;
        }


        setMedia(
          (
            previous
          ) => [
            ...previous,

            {
              mediaType,

              name:
                cleanName,

              url:
                cleanUrl,

              sortOrder:
                previous.length,
            },
          ]
        );


        setMediaName('');

        setMediaUrl('');
      };


    // =====================================================
    // ELIMINAR RECURSO
    // =====================================================

    const handleRemoveMedia =
      (
        index:
          number
      ) => {
        setMedia(
          (
            previous
          ) =>
            previous
              .filter(
                (
                  _,
                  mediaIndex
                ) =>
                  mediaIndex !==
                  index
              )
              .map(
                (
                  item,
                  mediaIndex
                ) => ({
                  ...item,

                  sortOrder:
                    mediaIndex,
                })
              )
        );
      };


    // =====================================================
    // ICONOS
    // =====================================================

    const getMediaIcon =
      (
        type:
          ComunicadoMediaType
      ) => {
        switch (type) {
          case 'image':
            return (
              <Image className="w-4 h-4" />
            );

          case 'video':
            return (
              <Video className="w-4 h-4" />
            );

          case 'document':
            return (
              <FileText className="w-4 h-4" />
            );

          default:
            return (
              <LinkIcon className="w-4 h-4" />
            );
        }
      };


    // =====================================================
    // GUARDAR
    // =====================================================

    const handleSubmit =
      async (
        e:
          React.FormEvent
      ) => {
        e.preventDefault();

        if (!comunicado) {
          return;
        }


        const cleanTitle =
          title.trim();

        const cleanSummary =
          summary.trim();

        const cleanContent =
          getPlainText(
            content
          );


        if (
          !cleanTitle ||
          !cleanSummary ||
          !cleanContent
        ) {
          alert(
            'Completa el título, el resumen y el contenido del comunicado.'
          );

          return;
        }


        // ===================================================
        // INCLUIR RECURSO PENDIENTE AUTOMÁTICAMENTE
        // ===================================================

        let mediaFinal:
          ComunicadoMedia[] = [
            ...media,
          ];


        const pendingName =
          mediaName.trim();

        const pendingUrl =
          mediaUrl.trim();


        if (
          pendingName ||
          pendingUrl
        ) {
          if (
            !pendingName ||
            !pendingUrl
          ) {
            alert(
              'Completa el nombre y el enlace del recurso multimedia.'
            );

            return;
          }


          try {
            new URL(
              pendingUrl
            );
          } catch {
            alert(
              'El enlace del recurso multimedia no es válido.'
            );

            return;
          }


          mediaFinal = [
            ...mediaFinal,

            {
              mediaType,

              name:
                pendingName,

              url:
                pendingUrl,

              sortOrder:
                mediaFinal.length,
            },
          ];
        }


        const updatedComunicado:
          Comunicado = {
            ...comunicado,

            title:
              cleanTitle,

            category,

            summary:
              cleanSummary,

            content,

            author:
              author.trim(),

            authorRole:
              authorRole.trim(),

            pinned,

            media:
              mediaFinal,

            // A partir de ahora los recursos
            // quedan gestionados en comunicado_media.
            attachments:
              undefined,
          };


        setSaving(
          true
        );


        try {
          await onSave(
            updatedComunicado
          );

          onClose();

        } catch (
          error
        ) {
          console.error(
            'Error actualizando comunicado:',
            error
          );

          alert(
            'No fue posible actualizar el comunicado.'
          );

        } finally {
          setSaving(
            false
          );
        }
      };


    if (
      !isOpen ||
      !comunicado
    ) {
      return null;
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-[90] p-4">

        <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto text-slate-900">


          {/* =============================================== */}
          {/* ENCABEZADO */}
          {/* =============================================== */}

          <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-6 pb-4 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#234156] text-[#f3a828] flex items-center justify-center border border-slate-700">

                <Bell className="w-5 h-5" />

              </div>


              <div>

                <h3 className="text-base font-extrabold text-[#234156]">
                  Editar Comunicado Oficial
                </h3>

                <p className="text-xs text-slate-500 font-semibold">
                  Actualiza contenido y recursos multimedia
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                saving
              }
              className="text-slate-400 hover:text-slate-600 font-bold disabled:opacity-40"
            >

              <X className="w-5 h-5" />

            </button>

          </div>


          {/* =============================================== */}
          {/* FORMULARIO */}
          {/* =============================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="p-6 space-y-5 text-xs"
          >


            {/* TÍTULO */}

            <div>

              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Título del Comunicado *
              </label>

              <input
                type="text"
                required
                value={
                  title
                }
                onChange={(
                  e
                ) =>
                  setTitle(
                    e.target.value
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
              />

            </div>


            {/* CATEGORÍA + REMITENTE */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                  Categoría
                </label>

                <select
                  value={
                    category
                  }
                  onChange={(
                    e
                  ) =>
                    setCategory(
                      e.target
                        .value as ComunicadoCategory
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
                >

                  <option value="Institucional">
                    Institucional
                  </option>

                  <option value="Bienestar">
                    Bienestar
                  </option>

                  <option value="Importante">
                    Importante
                  </option>

                  <option value="Formación">
                    Formación
                  </option>

                </select>

              </div>


              <div>

                <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                  Remitente / Área Emisora
                </label>

                <input
                  type="text"
                  value={
                    author
                  }
                  onChange={(
                    e
                  ) =>
                    setAuthor(
                      e.target.value
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
                />

              </div>

            </div>


            {/* CARGO */}

            <div>

              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Cargo / Área del Remitente
              </label>

              <input
                type="text"
                value={
                  authorRole
                }
                onChange={(
                  e
                ) =>
                  setAuthorRole(
                    e.target.value
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
              />

            </div>


            {/* RESUMEN */}

            <div>

              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Resumen Ejecutivo *
              </label>

              <textarea
                rows={
                  3
                }
                required
                value={
                  summary
                }
                onChange={(
                  e
                ) =>
                  setSummary(
                    e.target.value
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium resize-y"
              />

            </div>


            {/* =============================================== */}
            {/* EDITOR */}
            {/* =============================================== */}

            <div>

              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-2">
                Contenido Completo del Comunicado *
              </label>


              <div className="rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#234156]">


                <div className="flex items-center flex-wrap gap-1 bg-slate-50 border-b border-slate-200 p-2">

                  <button
                    type="button"
                    onMouseDown={(
                      e
                    ) =>
                      e.preventDefault()
                    }
                    onClick={() =>
                      applyFormat(
                        'bold'
                      )
                    }
                    title="Negrilla"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#234156] hover:bg-slate-200"
                  >
                    <Bold className="w-4 h-4" />
                  </button>


                  <button
                    type="button"
                    onMouseDown={(
                      e
                    ) =>
                      e.preventDefault()
                    }
                    onClick={() =>
                      applyFormat(
                        'italic'
                      )
                    }
                    title="Cursiva"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#234156] hover:bg-slate-200"
                  >
                    <Italic className="w-4 h-4" />
                  </button>


                  <button
                    type="button"
                    onMouseDown={(
                      e
                    ) =>
                      e.preventDefault()
                    }
                    onClick={() =>
                      applyFormat(
                        'underline'
                      )
                    }
                    title="Subrayado"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#234156] hover:bg-slate-200"
                  >
                    <Underline className="w-4 h-4" />
                  </button>


                  <div className="w-px h-6 bg-slate-300 mx-1" />


                  <button
                    type="button"
                    onMouseDown={(
                      e
                    ) =>
                      e.preventDefault()
                    }
                    onClick={() =>
                      applyFormat(
                        'insertUnorderedList'
                      )
                    }
                    title="Lista con viñetas"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#234156] hover:bg-slate-200"
                  >
                    <List className="w-4 h-4" />
                  </button>


                  <button
                    type="button"
                    onMouseDown={(
                      e
                    ) =>
                      e.preventDefault()
                    }
                    onClick={() =>
                      applyFormat(
                        'insertOrderedList'
                      )
                    }
                    title="Lista numerada"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#234156] hover:bg-slate-200"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>


                  <button
                    type="button"
                    onMouseDown={(
                      e
                    ) =>
                      e.preventDefault()
                    }
                    onClick={
                      handleInsertLink
                    }
                    title="Agregar enlace"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#234156] hover:bg-slate-200"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>


                  <div className="w-px h-6 bg-slate-300 mx-1" />


                  <button
                    type="button"
                    onMouseDown={(
                      e
                    ) =>
                      e.preventDefault()
                    }
                    onClick={
                      handleClearFormatting
                    }
                    title="Quitar formato"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                </div>


                <div
                  ref={
                    editorRef
                  }
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(
                    e
                  ) =>
                    setContent(
                      e.currentTarget
                        .innerHTML
                    )
                  }
                  className="min-h-[180px] px-4 py-3 text-sm font-medium leading-relaxed focus:outline-none bg-white"
                />

              </div>

            </div>


            {/* =============================================== */}
            {/* MULTIMEDIA */}
            {/* =============================================== */}

            <div className="border border-slate-200 rounded-2xl overflow-hidden">

              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">

                <div className="flex items-center gap-2">

                  <Image className="w-4 h-4 text-[#234156]" />

                  <h4 className="text-xs font-extrabold text-[#234156] uppercase tracking-wider">
                    Recursos Multimedia
                  </h4>

                </div>

                <p className="text-[10px] text-slate-500 mt-1">
                  Agrega, reemplaza o elimina imágenes, videos, documentos y enlaces asociados al comunicado.
                </p>

              </div>


              <div className="p-4 space-y-4">


                {/* EXISTENTES */}

                {media.length >
                  0 && (
                  <div className="space-y-2">

                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                      Recursos actuales
                    </p>


                    {media.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            item.id ||
                            `${item.mediaType}-${index}`
                          }
                          className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-[#234156] flex items-center justify-center shrink-0">

                              {getMediaIcon(
                                item.mediaType
                              )}

                            </div>


                            <div className="min-w-0">

                              <p className="text-xs font-extrabold text-[#234156] truncate">
                                {
                                  item.name
                                }
                              </p>

                              <p className="text-[10px] text-slate-400 truncate max-w-[450px]">
                                {
                                  item.url
                                }
                              </p>

                            </div>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMedia(
                                index
                              )
                            }
                            title="Eliminar recurso"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 shrink-0"
                          >

                            <Trash2 className="w-4 h-4" />

                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}


                {media.length >
                  0 && (
                  <div className="border-t border-slate-100" />
                )}


                {/* NUEVO RECURSO */}

                <div>

                  <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                    Tipo de recurso
                  </label>

                  <select
                    value={
                      mediaType
                    }
                    onChange={(
                      e
                    ) =>
                      setMediaType(
                        e.target
                          .value as ComunicadoMediaType
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
                  >

                    {mediaTypeOptions.map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>


                <div>

                  <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                    Nombre / Descripción
                  </label>

                  <input
                    type="text"
                    value={
                      mediaName
                    }
                    onChange={(
                      e
                    ) =>
                      setMediaName(
                        e.target.value
                      )
                    }
                    placeholder="Ej: Infografía Capítulo I"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
                  />

                </div>


                <div>

                  <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                    Enlace del recurso
                  </label>

                  <input
                    type="url"
                    value={
                      mediaUrl
                    }
                    onChange={(
                      e
                    ) =>
                      setMediaUrl(
                        e.target.value
                      )
                    }
                    placeholder="https://drive.google.com/... o https://youtube.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
                  />

                </div>


                <button
                  type="button"
                  onClick={
                    handleAddMedia
                  }
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#234156] border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-extrabold"
                >

                  <Plus className="w-4 h-4" />

                  Agregar recurso

                </button>

              </div>

            </div>


            {/* DESTACADO */}

            <div className="flex items-center gap-2 pt-2">

              <input
                type="checkbox"
                id="edit-comunicado-pinned"
                checked={
                  pinned
                }
                onChange={(
                  e
                ) =>
                  setPinned(
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-[#234156] rounded focus:ring-[#234156]"
              />

              <label
                htmlFor="edit-comunicado-pinned"
                className="font-extrabold text-[#234156] cursor-pointer"
              >
                Fijar este comunicado en la parte superior del Inicio
              </label>

            </div>


            {/* =============================================== */}
            {/* ACCIONES */}
            {/* =============================================== */}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">

              <button
                type="button"
                onClick={
                  handleClose
                }
                disabled={
                  saving
                }
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50"
              >
                Cancelar
              </button>


              <button
                type="submit"
                disabled={
                  saving
                }
                className="px-5 py-2.5 bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold rounded-xl flex items-center gap-2 shadow-sm border border-slate-700 disabled:opacity-50"
              >

                <Save className="w-3.5 h-3.5 text-[#f3a828]" />

                {saving
                  ? 'Guardando...'
                  : 'Guardar Cambios'}

              </button>

            </div>

          </form>

        </div>

      </div>
    );
  };