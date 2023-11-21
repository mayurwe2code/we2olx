import connection from "./Db.js";
import express from "express";
import "dotenv/config";
import cors from "cors";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import test_route from "./src/routers/testRouter.js";
import adminRoutes from "./src/routers/adminRoutes.js";
import userRouter from "./src/routers/userRouter.js";
import porductRouter from "./src/routers/porductRouter.js";
// import userRoutes from "./src/routers/userRoutes.js";
import orderRoute from "./src/routers/ordersRouter.js"
import messagesRouter from "./src/routers/messagesRoute.js";
import categoryRoute from "./src/routers/categoryRoutes.js";
import locationRoute from "./src/routers/locationRoute.js";
import mongoose from "mongoose";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 70000,
  })
);

app.use(express.static("public"));

connection
// const server = http.createServer(app);
// const io = new Server(server);
// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('message', (data) => {
//     // Save the message to the database and emit it to all connected clients
//     const { message, user } = data;
//     const sql = 'INSERT INTO messages (user, message) VALUES (?, ?)';
//     connection.query(sql, [user, message], (err, result) => {
//       if (err) throw err;
//       io.sockets.emit('message', data);
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

app.use(
  test_route,adminRoutes,userRouter,porductRouter,messagesRouter,orderRoute,categoryRoute,locationRoute
);

app.get("/version", (req, res) => {
  let dat = new Date();
  res.send({
    latest_update: dat,
    latest_commit: "check port- 9999  -  we2olx server-good 30/10/2023",
  });
});
//mongoose connection
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://mayurwe2code:kN58MwBDS3wxQ06H@cluster0.p5jwu9n.mongodb.net/chat_app?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
        console.log("DB Connection Successful!")
    }).catch((err) => console.log(err));

const server = app.listen(7777, () => {
    console.log(`server is running at ${7777}`);
  });

  const io = new Server(server,{
    cors: {
        origin: "https://chat-app-server-ri8t.onrender.com",
        credentials: true,
    },
});
//store all online users inside this map
global.onlineUsers =  new Map();
 
io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieved",data.message);
        }
    });
});
