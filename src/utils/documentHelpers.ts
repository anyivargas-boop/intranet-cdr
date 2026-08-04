/**
 * Utility to transform Google Drive / Docs / Sheets links into
 * direct download (.xlsx / .docx / .pdf) and Google Drive "Make a Copy" (/copy) links.
 * 
 * Ensures employees download or copy formats to fill them out (diligenciar)
 * without editing or overwriting master templates.
 */

export interface FormatoLinks {
  originalUrl: string;
  downloadUrl: string; // Direct download link (.xlsx, .docx, or direct file)
  copyUrl: string;     // Google Drive "/copy" link for forced copy creation
  isForm: boolean;
}

export function getFormatoLinks(url: string, fileType?: string): FormatoLinks {
  if (!url || url === '#' || url.startsWith('javascript')) {
    return { originalUrl: '#', downloadUrl: '#', copyUrl: '#', isForm: false };
  }

  const cleanUrl = url.trim();

  // 1. Google Sheets
  if (cleanUrl.includes('docs.google.com/spreadsheets/d/')) {
    const match = cleanUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const docId = match[1];
      return {
        originalUrl: cleanUrl,
        downloadUrl: `https://docs.google.com/spreadsheets/d/${docId}/export?format=xlsx`,
        copyUrl: `https://docs.google.com/spreadsheets/d/${docId}/copy`,
        isForm: false,
      };
    }
  }

  // 2. Google Docs
  if (cleanUrl.includes('docs.google.com/document/d/')) {
    const match = cleanUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const docId = match[1];
      const format = fileType === 'pdf' ? 'pdf' : 'docx';
      return {
        originalUrl: cleanUrl,
        downloadUrl: `https://docs.google.com/document/d/${docId}/export?format=${format}`,
        copyUrl: `https://docs.google.com/document/d/${docId}/copy`,
        isForm: false,
      };
    }
  }

  // 3. Google Drive File
  if (cleanUrl.includes('drive.google.com/file/d/')) {
    const match = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        originalUrl: cleanUrl,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
        copyUrl: `https://drive.google.com/file/d/${fileId}/copy`,
        isForm: false,
      };
    }
  }

  // 4. Google Forms
  if (cleanUrl.includes('docs.google.com/forms/')) {
    return {
      originalUrl: cleanUrl,
      downloadUrl: cleanUrl,
      copyUrl: cleanUrl,
      isForm: true,
    };
  }

  // Generic fallback
  return {
    originalUrl: cleanUrl,
    downloadUrl: cleanUrl,
    copyUrl: cleanUrl,
    isForm: false,
  };
}
