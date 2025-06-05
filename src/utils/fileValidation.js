// File validation constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/msword'];

export const validateFile = (file) => {
  const errors = [];
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  
  // Check file type
  const allowedTypes = [
    ...ALLOWED_IMAGE_TYPES,
    ...ALLOWED_VIDEO_TYPES,
    ...ALLOWED_DOCUMENT_TYPES
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported');
  }
    return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : null,
    errors
  };
};

export const getFileType = (mimeType) => {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image';
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video';
  if (ALLOWED_DOCUMENT_TYPES.includes(mimeType)) return 'document';
  return 'unknown';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
