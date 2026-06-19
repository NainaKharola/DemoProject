const { v2: cloudinary } = require('cloudinary');

const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials are missing. Image upload APIs will be unavailable until configured.');
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  console.log('Cloudinary configured successfully');
  return true;
};

module.exports = configureCloudinary;
module.exports.cloudinary = cloudinary;
