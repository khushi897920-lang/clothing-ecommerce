import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder: string = "yugen/products"
): Promise<{ url: string; publicId: string }> {
  if (!isCloudinaryConfigured) {
    // Graceful configuration notice: return local asset reference format when keys aren't provided
    const mockId = `yugen_${Date.now()}`;
    return {
      url: `/assets/yugen-product-${mockId}.png`,
      publicId: mockId,
    };
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    stream.end(fileBuffer);
  });
}

export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured) return true;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    return false;
  }
}
