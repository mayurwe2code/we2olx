import express from "express";
import {
    wishlistAddRemove
} from "../controllers/wishlistController.js";
import { auth_user } from "../../middleware/auth.js";

const wishlistRoute = express.Router();
      wishlistRoute.post("/wishlistAddRemove",auth_user, wishlistAddRemove);


export default wishlistRoute;
