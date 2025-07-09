import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Image: string): Promise<string> {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: 'portfolio',
    resource_type: 'auto',
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' },
      { quality: 'auto:best' },
      { fetch_format: 'auto' }
    ],
  });
  return result.secure_url;
}