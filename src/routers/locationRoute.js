import express from "express";
// import { auth_user } from '../../middleware/auth.js'
import {getLocations} from "../controllers/locationController.js";
const locationRoute =  express.Router()
    
    locationRoute.get("/getLocations",getLocations);
    // locationRoute.get("/getCategory",getCategory);
    // locationRoute.put("/deleteCategory",deleteCategory);
    
 export default locationRoute;