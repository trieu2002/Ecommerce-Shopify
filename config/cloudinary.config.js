const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
/**
 * Link tham khảo https://viblo.asia/p/tich-hop-cloud-services-cho-image-upload-trong-nodejs-va-react-web-app-yMnKM01a57P
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],


    params: {
        forder: "cuahangdientu"
    }

});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
