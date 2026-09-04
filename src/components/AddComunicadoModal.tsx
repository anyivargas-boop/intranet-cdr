import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Bell,
  Send,
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


interface AddComunicadoModalProps {
  isOpen: boolean;

  onClose: () => void;

  onAdd: (
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
// COMPONENTE
// =========================================================

export const AddComunicadoModal:
  React.FC<
    AddComunicadoModalProps
  > = ({
    isOpen,
    onClose,
    onAdd,
  }) => {

    // =====================================================
    // DATOS DEL COMUNICADO
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
    ] = useState(
      'Dirección Administrativa CdR'
    );

    const [
      authorRole,
      setAuthorRole,
    ] = useState(
      'Gestión Institucional'
    );

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
    // NUEVO RECURSO MULTIMEDIA
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
    // RESTABLECER FORMULARIO
    // =====================================================

    const resetForm = () => {
      setTitle('');

      setCategory(
        'Institucional'
      );

      setSummary('');

      setContent('');

      setAuthor(
        'Dirección Administrativa CdR'
      );

      setAuthorRole(
        'Gestión Institucional'
      );

      setPinned(false);

      setMediaType(
        'image'
      );

      setMediaName('');

      setMediaUrl('');

      setMedia([]);

      if (
        editorRef.current
      ) {
        editorRef.current.innerHTML =
          '';
      }
    };


    // =====================================================
    // SINCRONIZAR EDITOR
    // =====================================================

    useEffect(() => {
      if (
        isOpen &&
        editorRef.current
      ) {
        editorRef.current.innerHTML =
          content;
      }
    }, [isOpen]);


    // =====================================================
    // CERRAR
    // =====================================================

    const handleClose =
      () => {
        if (saving) {
          return;
        }

        resetForm();

        onClose();
      };


    // =====================================================
    // FORMATO DEL TEXTO
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
    // AGREGAR MULTIMEDIA
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

        const newMedia:
          ComunicadoMedia = {
            mediaType,

            name:
              cleanName,

            url:
              cleanUrl,

            sortOrder:
              media.length,
          };

        setMedia(
          (
            previous
          ) => [
            ...previous,
            newMedia,
          ]
        );

        setMediaName('');

        setMediaUrl('');
      };


    // =====================================================
    // ELIMINAR MULTIMEDIA
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
    // ICONO MULTIMEDIA
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
    // PUBLICAR
    // =====================================================

    const handleSubmit =
      async (
        e:
          React.FormEvent
      ) => {
        e.preventDefault();

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
        // RECURSOS MULTIMEDIA FINALES
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


        const newComunicado:
          Comunicado = {
            id:
              `com-${Date.now()}`,

            title:
              cleanTitle,

            category,

            summary:
              cleanSummary,

            content,

            date:
              new Date()
                .toISOString()
                .split('T')[0],

            author:
              author.trim(),

            authorRole:
              authorRole.trim(),

            pinned,

            media:
              mediaFinal,
          };


        setSaving(
          true
        );

        try {
          await onAdd(
            newComunicado
          );

          resetForm();

          onClose();
        } catch (
          error
        ) {
          console.error(
            'Error publicando comunicado:',
            error
          );

          alert(
            'No fue posible publicar el comunicado.'
          );
        } finally {
          setSaving(
            false
          );
        }
      };


    if (!isOpen) {
      return null;
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">

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
                  Publicar Comunicado Oficial
                </h3>

                <p className="text-xs text-slate-500 font-semibold">
                  Personal Administrativo CdR
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
                placeholder="Ej: Actualización de Horarios y Políticas de Teletrabajo"
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


            {/* CATEGORÍA Y REMITENTE */}

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


            {/* CARGO / ÁREA */}

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
                placeholder="Ej: Gestión Institucional"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
              />

            </div>


            {/* RESUMEN */}

            <div>

              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-1">
                Resumen Ejecutivo *
              </label>

              <p className="text-[10px] text-slate-400 mb-2">
                Este texto aparecerá en la vista preliminar del comunicado.
              </p>

              <textarea
                rows={
                  3
                }
                required
                placeholder="Síntesis de 1 o 2 oraciones para la lista..."
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
            {/* EDITOR DE CONTENIDO */}
            {/* =============================================== */}

            <div>

              <label className="block font-bold text-[#234156] uppercase tracking-wider mb-2">
                Contenido Completo del Comunicado *
              </label>


              <div className="rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#234156]">


                {/* BARRA DE FORMATO */}

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


                {/* ÁREA EDITABLE */}

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
                  data-placeholder="Escriba el cuerpo completo del mensaje..."
                  className="min-h-[180px] px-4 py-3 text-sm font-medium leading-relaxed focus:outline-none bg-white"
                />

              </div>


              <p className="text-[10px] text-slate-400 mt-1.5">
                Puedes seleccionar texto y aplicar negrilla, cursiva, subrayado, listas o enlaces.
              </p>

            </div>


            {/* =============================================== */}
            {/* RECURSOS MULTIMEDIA */}
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
                  Puedes añadir imágenes, videos, documentos o enlaces mediante URL. Los archivos permanecen en Google Drive, YouTube u otra plataforma; la intranet solo guarda el enlace.
                </p>

              </div>


              <div className="p-4 space-y-4">


                {/* TIPO */}

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


                {/* NOMBRE */}

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
                    placeholder={
                      mediaType ===
                      'image'
                        ? 'Ej: Foto del taller de seguridad digital'
                        : mediaType ===
                          'video'
                        ? 'Ej: Video explicativo'
                        : mediaType ===
                          'document'
                        ? 'Ej: Reglamento Interno de Trabajo 2026'
                        : 'Ej: Formulario de inscripción'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#234156] font-medium"
                  />

                </div>


                {/* URL */}

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


                {/* RECURSOS AGREGADOS */}

                {media.length >
                  0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100">

                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                      Recursos agregados
                    </p>


                    {media.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={`${item.mediaType}-${index}`}
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

              </div>

            </div>


            {/* DESTACADO */}

            <div className="flex items-center gap-2 pt-2">

              <input
                type="checkbox"
                id="pinned"
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
                htmlFor="pinned"
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
                <Send className="w-3.5 h-3.5 text-[#f3a828]" />

                {saving
                  ? 'Publicando...'
                  : 'Publicar Comunicado'}
              </button>

            </div>

          </form>

        </div>

      </div>
    );
  };