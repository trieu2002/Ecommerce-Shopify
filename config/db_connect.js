const { default: mongoose } = require("mongoose");
const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGOOSE_URL, {
            serverSelectionTimeoutMS: 3000
        });
        if (conn) {
            console.log('<<<<<<< Connect Success >>>>>>>');
        }
    } catch (error) {
        console.log('<<<<<<< Connect Fail >>>>>>>');
        throw new Error(error);
    }
};
module.exports = dbConnect;