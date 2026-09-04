import React, {
  useEffect,
  useState,
} from 'react';

import {
  FormatoDocumento,
} from '../types';

import {
  Building2,
  Search,
  Plus,
  Grid,
  List,
  Trash2,
  Pencil,
  Eye,
  Download,
  X,
  FileText,
  ExternalLink,
} from 'lucide-react';


interface DocumentacionInstitucionalViewProps {
  formatos:
    FormatoDocumento[];

  isAdmin:
    boolean;

  onOpenAddModal:
    () => void;

  onDeleteFormato?:
    (
      id:
        number |
        string
    ) => void;

  onEditFormato?:
    (
      formato:
        FormatoDocumento
    ) => void;
}


// =========================================================
// GOOGLE DRIVE - OBTENER ID
// =========================================================

const getGoogleDriveFileId = (
  url: string
): string | null => {

  if (
    !url
  ) {
    return null;
  }


  const patterns = [
    /\/file\/d\/([^/]+)/,
    /\/document\/d\/([^/]+)/,
    /\/spreadsheets\/d\/([^/]+)/,
    /\/presentation\/d\/([^/]+)/,
    /[?&]id=([^&]+)/,
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


// =========================================================
// TIPO DE ENLACE GOOGLE
// =========================================================

const getGoogleDriveType = (
  url: string
):
  | 'file'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | null => {

  if (
    url.includes(
      'docs.google.com/document'
    )
  ) {
    return 'document';
  }


  if (
    url.includes(
      'docs.google.com/spreadsheets'
    )
  ) {
    return 'spreadsheet';
  }


  if (
    url.includes(
      'docs.google.com/presentation'
    )
  ) {
    return 'presentation';
  }


  if (
    url.includes(
      'drive.google.com'
    )
  ) {
    return 'file';
  }


  return null;
};


// =========================================================
// URL DE PREVISUALIZACIÓN
// =========================================================

const getPreviewUrl = (
  documento:
    FormatoDocumento
) => {

  const url =
    documento.driveUrl ||
    documento.downloadUrl ||
    '';


  if (
    !url
  ) {
    return '';
  }


  const fileId =
    getGoogleDriveFileId(
      url
    );


  const googleType =
    getGoogleDriveType(
      url
    );


  // ---------------------------------------------------------
  // GOOGLE DOCS
  // ---------------------------------------------------------

  if (
    fileId &&
    googleType ===
      'document'
  ) {
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }


  // ---------------------------------------------------------
  // GOOGLE SHEETS
  // ---------------------------------------------------------

  if (
    fileId &&
    googleType ===
      'spreadsheet'
  ) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  }


  // ---------------------------------------------------------
  // GOOGLE SLIDES
  // ---------------------------------------------------------

  if (
    fileId &&
    googleType ===
      'presentation'
  ) {
    return `https://docs.google.com/presentation/d/${fileId}/preview`;
  }


  // ---------------------------------------------------------
  // ARCHIVOS EN GOOGLE DRIVE
  // PDF, WORD, EXCEL, ETC.
  // ---------------------------------------------------------

  if (
    fileId
  ) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }


  // ---------------------------------------------------------
  // PDF DIRECTO
  // ---------------------------------------------------------

  if (
    documento.fileType ===
      'pdf' ||
    url
      .toLowerCase()
      .includes(
        '.pdf'
      )
  ) {
    return url;
  }


  // ---------------------------------------------------------
  // OTROS ARCHIVOS PÚBLICOS
  // GOOGLE VIEWER
  // ---------------------------------------------------------

  return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    url
  )}`;
};


// =========================================================
// URL DE DESCARGA
// =========================================================

const getDownloadUrl = (
  documento:
    FormatoDocumento
) => {

  /*
   * Si ya guardaste un downloadUrl específico,
   * siempre tendrá prioridad.
   */

  if (
    documento.downloadUrl &&
    documento.downloadUrl
      .trim()
  ) {
    return documento
      .downloadUrl
      .trim();
  }


  const url =
    documento.driveUrl ||
    '';


  if (
    !url
  ) {
    return '';
  }


  const fileId =
    getGoogleDriveFileId(
      url
    );


  const googleType =
    getGoogleDriveType(
      url
    );


  // ---------------------------------------------------------
  // GOOGLE DOCS -> PDF
  // ---------------------------------------------------------

  if (
    fileId &&
    googleType ===
      'document'
  ) {
    return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  }


  // ---------------------------------------------------------
  // GOOGLE SHEETS -> XLSX
  // ---------------------------------------------------------

  if (
    fileId &&
    googleType ===
      'spreadsheet'
  ) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
  }


  // ---------------------------------------------------------
  // GOOGLE SLIDES -> PDF
  // ---------------------------------------------------------

  if (
    fileId &&
    googleType ===
      'presentation'
  ) {
    return `https://docs.google.com/presentation/d/${fileId}/export/pdf`;
  }


  // ---------------------------------------------------------
  // ARCHIVO NORMAL DE DRIVE
  // ---------------------------------------------------------

  if (
    fileId
  ) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }


  return url;
};


// =========================================================
// COMPONENTE
// =========================================================

export const DocumentacionInstitucionalView:
  React.FC<
    DocumentacionInstitucionalViewProps
  > = ({
    formatos,
    isAdmin,
    onOpenAddModal,
    onDeleteFormato,
    onEditFormato,
  }) => {

  // =======================================================
  // BÚSQUEDA
  // =======================================================

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState(
      ''
    );


  // =======================================================
  // TIPO DE VISTA
  // =======================================================

  const [
    viewMode,
    setViewMode,
  ] =
    useState<
      'grid' |
      'table'
    >(
      'grid'
    );


  // =======================================================
  // DOCUMENTO EN PREVISUALIZACIÓN
  // =======================================================

  const [
    previewDocument,
    setPreviewDocument,
  ] =
    useState<
      FormatoDocumento |
      null
    >(
      null
    );


  // =======================================================
  // BLOQUEAR SCROLL DEL FONDO CON MODAL ABIERTO
  // =======================================================

  useEffect(
    () => {

      if (
        !previewDocument
      ) {
        return;
      }


      const previousOverflow =
        document
          .body
          .style
          .overflow;


      document
        .body
        .style
        .overflow =
        'hidden';


      return () => {

        document
          .body
          .style
          .overflow =
          previousOverflow;
      };

    },
    [
      previewDocument,
    ]
  );


  // =======================================================
  // FILTRAR DOCUMENTACIÓN INSTITUCIONAL
  // =======================================================

  const institutionalDocuments =
    formatos.filter(
      (
        fmt
      ) => {

        const matchesCategory =
          fmt.category ===
          'Documentación Institucional';


        const normalizedSearch =
          searchTerm
            .trim()
            .toLowerCase();


        const matchesSearch =
          !normalizedSearch ||
          fmt.title
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          fmt.description
            .toLowerCase()
            .includes(
              normalizedSearch
            );


        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );


  // =======================================================
  // ABRIR PREVISUALIZACIÓN
  // =======================================================

  const handlePreview = (
    documento:
      FormatoDocumento
  ) => {

    setPreviewDocument(
      documento
    );
  };


  // =======================================================
  // DESCARGAR
  // =======================================================

  const handleDownload = (
    documento:
      FormatoDocumento
  ) => {

    const url =
      getDownloadUrl(
        documento
      );


    if (
      !url
    ) {
      alert(
        'Este documento no tiene un enlace de descarga configurado.'
      );

      return;
    }


    const anchor =
      document.createElement(
        'a'
      );


    anchor.href =
      url;

    anchor.target =
      '_blank';

    anchor.rel =
      'noopener noreferrer';


    document.body
      .appendChild(
        anchor
      );


    anchor.click();


    document.body
      .removeChild(
        anchor
      );
  };


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>

      <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto pb-10">


        {/* ================================================= */}
        {/* ENCABEZADO */}
        {/* ================================================= */}

        <div className="bg-[#234156] text-white rounded-2xl p-6 border-b-4 border-[#f3a828] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>

            <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">

              <Building2 className="w-6 h-6 text-[#f3a828]" />

              Documentación Institucional

            </h1>


            <p className="text-xs text-slate-200 mt-1">
              Consulta de documentos legales, administrativos y
              corporativos de Consejo de Redacción.
            </p>

          </div>


          {isAdmin && (
            <button
              type="button"
              onClick={
                onOpenAddModal
              }
              className="bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all shrink-0 border border-amber-300"
            >
              <Plus className="w-4 h-4" />

              <span>
                Agregar Documento
              </span>

            </button>
          )}

        </div>


        {/* ================================================= */}
        {/* BUSCADOR Y CAMBIO DE VISTA */}
        {/* ================================================= */}

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">

          <div className="relative w-full sm:max-w-md">

            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />


            <input
              type="text"
              placeholder="Buscar documento institucional..."
              value={
                searchTerm
              }
              onChange={(
                e
              ) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#234156] bg-slate-50 font-medium"
            />

          </div>


          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">

            <button
              type="button"
              onClick={() =>
                setViewMode(
                  'grid'
                )
              }
              className={`p-1.5 rounded-lg ${
                viewMode ===
                'grid'
                  ? 'bg-[#234156] shadow-xs text-[#f3a828]'
                  : 'text-slate-500'
              }`}
              title="Vista en tarjetas"
            >
              <Grid className="w-4 h-4" />
            </button>


            <button
              type="button"
              onClick={() =>
                setViewMode(
                  'table'
                )
              }
              className={`p-1.5 rounded-lg ${
                viewMode ===
                'table'
                  ? 'bg-[#234156] shadow-xs text-[#f3a828]'
                  : 'text-slate-500'
              }`}
              title="Vista en tabla"
            >
              <List className="w-4 h-4" />
            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* SIN DOCUMENTOS */}
        {/* ================================================= */}

        {institutionalDocuments.length ===
        0 ? (

          <div className="bg-white rounded-2xl p-12 text-center border border-slate-300">

            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />


            <h3 className="text-base font-bold text-slate-700">
              No se encontraron documentos institucionales
            </h3>


            <p className="text-xs text-slate-400 mt-1">
              Los documentos aparecerán aquí cuando tengan
              seleccionada la categoría{' '}

              <strong>
                Documentación Institucional
              </strong>
              .
            </p>

          </div>

        ) : viewMode ===
          'grid' ? (


          /* ================================================= */
          /* VISTA EN TARJETAS */
          /* ================================================= */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {institutionalDocuments.map(
              (
                fmt
              ) => (

                <div
                  key={
                    fmt.id
                  }
                  className="bg-white rounded-2xl border-t-4 border-t-[#234156] border-x border-b border-slate-200 p-6 shadow-xs hover:border-t-[#f3a828] hover:shadow-md transition-all flex flex-col justify-between"
                >

                  <div>

                    <div className="flex items-center justify-between mb-4">

                      <div
                        className={`w-12 h-12 ${
                          fmt.iconBgColor ||
                          'bg-sky-50'
                        } ${
                          fmt.iconTextColor ||
                          'text-[#234156]'
                        } rounded-xl flex items-center justify-center text-xl font-bold border border-slate-200`}
                      >

                        {fmt.fileType ===
                          'pdf' &&
                          '📄'}

                        {fmt.fileType ===
                          'word' &&
                          '📑'}

                        {fmt.fileType ===
                          'excel' &&
                          '📊'}

                        {fmt.fileType ===
                          'drive' &&
                          '📂'}

                        {fmt.fileType ===
                          'form' &&
                          '📝'}

                      </div>


                      <span className="text-[11px] font-extrabold text-slate-900 bg-[#f3a828] px-2.5 py-1 rounded-md border border-amber-300">
                        {
                          fmt.version
                        }
                      </span>

                    </div>


                    <span className="text-[10px] font-extrabold uppercase text-[#234156] tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      Documentación Institucional
                    </span>


                    <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                      {
                        fmt.title
                      }
                    </h3>


                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {
                        fmt.description
                      }
                    </p>

                  </div>


                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">

                      <span>
                        Rev:{' '}
                        {
                          fmt.lastUpdated
                        }
                      </span>


                      {isAdmin && (
                        <div className="flex items-center gap-2">

                          {onEditFormato && (
                            <button
                              type="button"
                              onClick={() =>
                                onEditFormato(
                                  fmt
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 flex items-center gap-1 text-[10px]"
                              title="Editar documento"
                            >
                              <Pencil className="w-3.5 h-3.5" />

                              <span>
                                Editar
                              </span>
                            </button>
                          )}


                          {onDeleteFormato && (
                            <button
                              type="button"
                              onClick={() =>
                                onDeleteFormato(
                                  fmt.id
                                )
                              }
                              className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 flex items-center gap-1 text-[10px]"
                              title="Eliminar documento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />

                              <span>
                                Eliminar
                              </span>
                            </button>
                          )}

                        </div>
                      )}

                    </div>


                    {/* ======================================= */}
                    {/* PREVISUALIZAR */}
                    {/* ======================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        handlePreview(
                          fmt
                        )
                      }
                      className="w-full bg-[#234156] hover:bg-[#1a3142] text-white font-extrabold px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors border border-slate-700 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-[#f3a828]" />

                      <span>
                        Previsualizar
                      </span>
                    </button>


                    {/* ======================================= */}
                    {/* DESCARGAR */}
                    {/* ======================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          fmt
                        )
                      }
                      className="w-full bg-white hover:bg-amber-50 text-[#234156] font-extrabold px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors border border-[#234156]/20"
                    >
                      <Download className="w-4 h-4 text-[#f3a828]" />

                      <span>
                        Descargar
                      </span>
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (


          /* ================================================= */
          /* VISTA EN TABLA */
          /* ================================================= */

          <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-xs">

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead className="bg-[#234156] text-white uppercase tracking-wider font-extrabold">

                  <tr>

                    <th className="px-6 py-4">
                      Documento
                    </th>

                    <th className="px-6 py-4">
                      Versión
                    </th>

                    <th className="px-6 py-4">
                      Última revisión
                    </th>

                    <th className="px-6 py-4 text-right">
                      Acciones
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {institutionalDocuments.map(
                    (
                      fmt
                    ) => (

                      <tr
                        key={
                          fmt.id
                        }
                        className="hover:bg-amber-50/30 transition-colors"
                      >

                        <td className="px-6 py-4">

                          <p className="font-bold text-slate-900">
                            {
                              fmt.title
                            }
                          </p>

                          <p className="text-[11px] text-slate-500 mt-1">
                            {
                              fmt.description
                            }
                          </p>

                        </td>


                        <td className="px-6 py-4 font-bold text-slate-800">
                          {
                            fmt.version
                          }
                        </td>


                        <td className="px-6 py-4 text-slate-500">
                          {
                            fmt.lastUpdated
                          }
                        </td>


                        <td className="px-6 py-4">

                          <div className="flex justify-end items-center gap-2 flex-wrap">


                            {/* PREVISUALIZAR */}

                            <button
                              type="button"
                              onClick={() =>
                                handlePreview(
                                  fmt
                                )
                              }
                              className="bg-[#234156] hover:bg-[#1a3142] text-white font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#f3a828]" />

                              Previsualizar
                            </button>


                            {/* DESCARGAR */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDownload(
                                  fmt
                                )
                              }
                              className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 border border-amber-200"
                            >
                              <Download className="w-3.5 h-3.5" />

                              Descargar
                            </button>


                            {isAdmin &&
                              onEditFormato && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onEditFormato(
                                      fmt
                                    )
                                  }
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 border border-blue-200"
                                >
                                  <Pencil className="w-3.5 h-3.5" />

                                  Editar
                                </button>
                              )}


                            {isAdmin &&
                              onDeleteFormato && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onDeleteFormato(
                                      fmt.id
                                    )
                                  }
                                  className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 border border-red-200"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />

                                  Eliminar
                                </button>
                              )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>


      {/* ===================================================== */}
      {/* MODAL PREVISUALIZACIÓN */}
      {/* ===================================================== */}

      {previewDocument && (
        <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">

          <div className="w-full h-[100dvh] sm:h-[94dvh] sm:max-w-6xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">


            {/* ================================================= */}
            {/* CABECERA MODAL */}
            {/* ================================================= */}

            <div className="shrink-0 bg-[#234156] text-white px-4 sm:px-6 py-4 border-b-4 border-[#f3a828]">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-10 h-10 rounded-xl bg-[#f3a828] text-slate-950 flex items-center justify-center shrink-0">

                    <FileText className="w-5 h-5" />

                  </div>


                  <div className="min-w-0">

                    <p className="text-[9px] uppercase tracking-wider font-extrabold text-[#f3a828]">
                      Previsualización
                    </p>


                    <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                      {
                        previewDocument.title
                      }
                    </h2>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setPreviewDocument(
                      null
                    )
                  }
                  className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center shrink-0"
                  aria-label="Cerrar previsualización"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

            </div>


            {/* ================================================= */}
            {/* VISOR */}
            {/* ================================================= */}

            <div className="flex-1 min-h-0 bg-slate-200 relative">

              {getPreviewUrl(
                previewDocument
              ) ? (

                <iframe
                  src={
                    getPreviewUrl(
                      previewDocument
                    )
                  }
                  title={
                    previewDocument.title
                  }
                  className="absolute inset-0 w-full h-full border-0 bg-white"
                  allow="autoplay"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center p-8">

                  <div className="text-center max-w-md">

                    <FileText className="w-14 h-14 text-slate-400 mx-auto mb-4" />


                    <h3 className="text-base font-extrabold text-[#234156]">
                      No hay vista previa disponible
                    </h3>


                    <p className="text-xs text-slate-500 mt-2">
                      Este documento no tiene un enlace configurado para previsualización.
                    </p>

                  </div>

                </div>
              )}

            </div>


            {/* ================================================= */}
            {/* PIE DEL MODAL */}
            {/* ================================================= */}

            <div className="shrink-0 bg-white border-t border-slate-200 px-4 sm:px-6 py-3">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <div className="min-w-0">

                  <p className="text-xs font-extrabold text-[#234156] truncate">
                    {
                      previewDocument.title
                    }
                  </p>


                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Versión{' '}
                    {
                      previewDocument.version
                    }

                    {previewDocument.lastUpdated && (
                      <>
                        {' '}
                        • Revisión{' '}
                        {
                          previewDocument.lastUpdated
                        }
                      </>
                    )}
                  </p>

                </div>


                <div className="flex items-center gap-2 shrink-0">


                  {/* DESCARGAR */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        previewDocument
                      )
                    }
                    className="flex-1 sm:flex-none bg-[#f3a828] hover:bg-[#e0951a] text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 border border-amber-300"
                  >
                    <Download className="w-4 h-4" />

                    Descargar
                  </button>


                  {/* ABRIR ORIGINAL - OPCIONAL */}

                  {previewDocument.driveUrl && (
                    <a
                      href={
                        previewDocument.driveUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:flex bg-slate-100 hover:bg-slate-200 text-[#234156] font-bold text-xs px-4 py-2.5 rounded-xl items-center justify-center gap-2 border border-slate-200"
                    >
                      <ExternalLink className="w-4 h-4" />

                      Abrir original
                    </a>
                  )}


                  {/* CERRAR */}

                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDocument(
                        null
                      )
                    }
                    className="flex-1 sm:flex-none bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200"
                  >
                    Cerrar
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </>
  );
};