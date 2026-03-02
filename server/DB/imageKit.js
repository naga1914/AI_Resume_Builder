import ImageKit from "@imagekit/nodejs";

let imageKit;

try {
  if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    console.warn("ImageKit credentials missing. Some features will not work.");
    imageKit = null;
  } else {
    imageKit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
} catch (error) {
  console.error("Failed to initialize ImageKit:", error.message);
  imageKit = null;
}

export default imageKit;