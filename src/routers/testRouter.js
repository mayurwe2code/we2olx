import express from "express";
import {
  test_control
} from "../controllers/testController.js";

const test_route = express.Router();
test_route.get("/testRoute", test_control);

export default test_route;
