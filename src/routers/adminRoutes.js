import express from "express";
import {
    admin_login,allEmployeeDetail,allEmployeeSkill,allEmployeeCareer,allEmployeeEducation
} from "../controllers/adminController.js";

const adminRoutes = express.Router();
adminRoutes.post("/admin_login", admin_login);
adminRoutes.get("/getEmployeeDetail", allEmployeeDetail);
adminRoutes.get("/getEmployeeSkill", allEmployeeSkill);
adminRoutes.get("/getEmployeeCareer", allEmployeeCareer);
adminRoutes.get("/getEmployeeEducation", allEmployeeEducation);

export default adminRoutes;
