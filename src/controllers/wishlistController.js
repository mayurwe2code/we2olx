import { queryListen } from "../common/querylistener";


export async function wishlistAddRemove(req,res) {
    let {product_id}=req.body;
  let result = queryListen("SELECT * FROM wishlist WHERE product_id="+product_id+" AND user_id="+req.user_id+"");
  if(result.length){
    let deletetResult = queryListen(`DELETE FROM wishlist WHERE product_id = ${result[0]["id"]} AND user_id = ${req.user_id}`);
    console.log(deletetResult)
    res.status(200).json({"statusCode": 200, "status": true, "statusText": "successfully deleted" });  
  }else{
    let insertResult = queryListen(`INSERT INTO wishlist (product_id, user_id) VALUES (${product_id},${user_id})`);
    res.status(200).json({"statusCode": 200, "status": true, "statusText": "ok",wishlist:insertResult.insertId });  
  } 
}