import jwt from 'jsonwebtoken';
// import { search_product } from "../src/controllers/productController.js"
// import connection from "../Db.js";
// import { StatusCodes } from "http-status-codes";

function adminTokenVerification(req, res, next) {
  console.log("chek______________________________________________middleware___" + req.headers.admin_token)
  if (req.headers.admin_token) {
    try {
      let token = jwt.verify(req.headers.admin_token, process.env.ADMIN_JWT_SECRET_KEY);
      req.tokenData.token
      req.admin_id = token.id;
      req.admin_type = token.admin_type
      next()
    } catch (err) {
    }
  } 

}

function auth_user(req, res, next) {
  try {
    console.log("chek______________________________________________middleware___" + req.headers.user_token)
    let token = jwt.verify(req.headers.user_token, process.env.USER_JWT_SECRET_KEY);
    console.log(token)
    console.log(token.id)
    if (req.headers.user_token != "" && req.headers.user_token != undefined) {
      req.user_id = token.id
      next()
    } else {
      res.send({ "error": "token error" })
    }
  } catch (err) {
    res.status(401).send(err)
  }
}

export { adminTokenVerification,auth_user}
