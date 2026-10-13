export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const formatResumeUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }
  if (url.startsWith('http')) {
    // If it's a legacy Cloudinary image upload PDF, Cloudinary returns 401 Unauthorized for raw .pdf under /image/upload/.
    // Converting .pdf to .jpg lets Cloudinary render the document page as a high-res image cleanly without 401 error.
    if (url.includes('/image/upload/')) {
      let cleaned = url.replace('/fl_attachment/', '/');
      if (cleaned.toLowerCase().endsWith('.pdf')) {
        return cleaned.replace(/\.pdf$/i, '.jpg');
      }
      return cleaned;
    }
    return url;
  }
  return url;
};

