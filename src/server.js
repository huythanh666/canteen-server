import dotenv from "dotenv";
import express from "express";
import http from "http";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import cors from "cors"
import { generateAccessToken } from "./utils/jwt.util.js";
import corsOptions from "./configs/cors.config.js";
import helmetConfig from "./configs/helmet.config.js";
import uploadCloud from "./configs/cloudinary.config.js";
import canteenRoutes from "./modules/canteen/canteen.route.js";
import campusRoute from "./modules/campus/campus.route.js";
import rootRoute from "./rootRoute.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(helmet(helmetConfig));
app.use(cors(corsOptions));
app.use('/api/v1', rootRoute);
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});