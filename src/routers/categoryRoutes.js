import express from "express";
// import { auth_user } from '../../middleware/auth.js'
import {addCategory} from "../controllers/categoryController.js";
const categoryRoute =  express.Router()
    
    categoryRoute.post("/addCategory",addCategory);
    
 export default categoryRoute;