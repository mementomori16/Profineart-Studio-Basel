// Frontend/src/utils/ImagePreloader/media.ts
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const optimizeImg = (url: string) => {
  if (!url) return "";
  
  // 1. If it's already a Cloudinary link, don't add the prefix again
  if (url.includes("cloudinary.com")) return url;
  
  // 2. If it's a YouTube link (for your 280mb video), don't touch it
  if (url.includes("youtube.com") || url.includes("youtu.be")) return url;

  // 3. Otherwise, wrap the ImgBB link with the Cloudinary Fetch prefix
  const prefix = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto/`;
  return `${prefix}${url}`;
};