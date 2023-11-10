import express from "express";
import {
    addproducts,getProducts,updateProduct,add_product_images
} from "../controllers/productController.js";
import { auth_user } from "../../middleware/auth.js";
const productsRoute = express.Router();
productsRoute.post("/addproducts",auth_user, addproducts);
productsRoute.post("/getProducts",(req,res,next)=>{if(req.headers.user_token){auth_user(req,res,next)}else{next()}},getProducts);
productsRoute.post("/update_product",auth_user, updateProduct);
productsRoute.post("/add_product_images", add_product_images);

export default productsRoute;
