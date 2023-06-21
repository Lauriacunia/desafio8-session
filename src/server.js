import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import homeFsRoutes from "./routes/fs/homeFsRoutes.js";
import productFsRoutes from "./routes/fs/productFsRoutes.js";
import cartFsRoutes from "./routes/fs/cartFsRoutes.js";
import homeRoutes from "./routes/mongo/homeRoutes.js";
import productRoutes from "./routes/mongo/productRoutes.js";
import cartRoutes from "./routes/mongo/cartRoutes.js";
import chatRoutes from "./routes/mongo/chatRoutes.js";
import websockets from "./websockets/websockets.js";
import exphbs from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { connectMongoDB } from "./config/configMongoDB.js";
import cookieParser from "cookie-parser";
import session from "express-session";

/** ★━━━━━━━━━━━★ variables ★━━━━━━━━━━━★ */

const app = express();
const PORT = 8080 || process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
/** ★━━━━━━━━━━━★ server httt & websocket ★━━━━━━━━━━━★ */

/** Tenemos dos servidores:  httpServer (http) y io (websocket)*/
const httpServer = http.createServer(app);

/** Crear nuevo servidor websocket */
const io = new SocketServer(httpServer);

websockets(io);

/** ★━━━━━━━━━━━★ middlewares ★━━━━━━━━━━━★*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/** para gestionar cookies dentro de cada endpoint
 * lo que está entre parentesis es la clave secreta
 */
app.use(cookieParser("mySecret"));
/** session */
app.use(
  session({ secret: "un-re-secreto", resave: true, saveUninitialized: true })
);

/** ★━━━━━━━━━━━★ frontend ★━━━━━━━━━━━★*/
// Configuración de Express Handlebars
const handlebars = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.engine("handlebars", handlebars.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

/** ★━━━━━━━━━━━★ routes ★━━━━━━━━━━━★ */
// con FileSystem
app.use("/fs/home", homeFsRoutes);
app.use("/fs/products", productFsRoutes);
app.use("/fs/carts", cartFsRoutes);
// con MongoDB
app.use("/home", homeRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/chat", chatRoutes);

// redirect to /home
app.get("/", (req, res) => {
  res.redirect("/home");
});
//not found
app.use("*", (req, res, next) => {
  res.status(404).json({ error: "not found" });
});

/** ★━━━━━━━━━━━★ connection mongoDB ★━━━━━━━━━━━★ */
connectMongoDB();

const server = httpServer.listen(PORT, () =>
  console.log(
    `🚀 Server started on port ${PORT}. 
      at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));
