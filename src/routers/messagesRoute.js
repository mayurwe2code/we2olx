import express from "express";
import { addMessage, getAllMessage } from "../controllers/messagesController.js";

// const router = require("express").Router();
const messagesRouter = express.Router();
messagesRouter.post("/api/auth/addmsg", addMessage);
messagesRouter.post("/api/message/getmsg", getAllMessage);

export default messagesRouter;
