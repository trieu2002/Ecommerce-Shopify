const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const dbConnect = require("./config/db_connect");
const initRoutes = require("./router/index");
const PORT = process.env.PORT || 9000;
/**
 * Giúp đọc kiêu dữ liệu json khi làm việc
 */
app.use(express.json());
/**
 * Giúp khi người dùng làm việc với các url đặc biệt nó sẽ giúp convert sang object để đọc được
 */
app.use(express.urlencoded({ extended: true }));
/**
 * sử dụng cookie
 */
app.use(cookieParser());
/**
 * Kết nối với Mongoose
 */
app.use(cors({
    methods: ['PUT', 'GET', 'POST', 'DELETE'],
    origin: process.env.CLIENT_URL
}))
dbConnect();
initRoutes(app);
console.log('<<<<<<< PORT >>>>>>>', PORT);
app.use("/", (req, res) => {
    res.send("SERVER ON");
});
app.listen(PORT, () => {
    console.log('<<<<<<< Server is running >>>>>>>');
})