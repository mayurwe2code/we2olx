import express from "express";
import { auth_user } from '../../middleware/auth.js'
import { addOrder,getOrders,orderStatusChange,orderDelete } from "../controllers/ordersController.js";
    const orderRoute =  express.Router()
    
    orderRoute.post("/addOrder",auth_user,addOrder);
    orderRoute.post("/getOrders",auth_user,getOrders);
    orderRoute.put("/orderStatusChange",orderStatusChange);
    orderRoute.patch("/",orderDelete);
 export default orderRoute;