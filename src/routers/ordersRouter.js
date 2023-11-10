import express from "express";
import { addOrder,getOrders,orderStatusChange,orderDelete } from "../controllers/ordersController.js";
    const orderRoute =  express.Router()
    
    orderRoute.post("/addOrder",addOrder);
    orderRoute.post("/getOrders",getOrders);
    orderRoute.put("/orderStatusChange",orderStatusChange);
    orderRoute.patch("/",orderDelete);
 export default orderRoute;