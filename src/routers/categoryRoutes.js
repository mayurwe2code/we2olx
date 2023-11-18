import express from "express";
// import { auth_user } from '../../middleware/auth.js'
import {addCategory,getCategory,deleteCategory} from "../controllers/categoryController.js";
const categoryRoute =  express.Router()
    
    categoryRoute.post("/addCategory",addCategory);
    categoryRoute.get("/getCategory",getCategory);
    categoryRoute.put("/deleteCategory",deleteCategory);
    
 export default categoryRoute;