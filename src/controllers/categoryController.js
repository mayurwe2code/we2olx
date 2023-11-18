import { queryListen } from "../common/querylistener.js";

export async function addCategory(req,res) {
    let {category_name, parent_category_id, level}=req.body;
    let all_parent;
    let chk_parent_flag=true;
    if(level == 0){
        parent_category_id='NULL';
    }else{
       let parent_cat_row = await queryListen("SELECT * FROM category WHERE id = '"+parent_category_id+"'")
       console.log(parent_cat_row)
       if(!parent_cat_row.length){
        chk_parent_flag=false;
        res.status(200).json({ "statusCode": 200, "status": false, "statusText": "parent category not found..!" });
       }else{
        all_parent = `${parent_cat_row[0]["all_parents"]},${parent_cat_row[0]["id"]}`
       }
    }
    level = parseInt(level)+1
  if(chk_parent_flag){
let result = await queryListen("INSERT INTO  `category` (`category_name`, `parent_category_id`, `level`, `all_parents`) VALUES ('"+category_name+"',"+parent_category_id+",'"+level+"','"+all_parent+"')")
  
  console.log(result)
  if (result.insertId) {
    res.status(200).json({"statusCode": 200, "status": true, "statusText": "new category add successfully","category_id":result.insertId });
  }else{
    res.status(200).json({"statusCode": 200, "status": false, "statusText": "failed.. find some error" });
  }
}
}

export async function getCategory(req,res) {
    console.log("getCategory-----------");
    let parent_cat_id = req.query.parent_category
    let optr = " = ";
    console.log(req.query);
    if(parent_cat_id==0){
         optr = " IS  NULL";
    }else{
        optr=" = "+parent_cat_id;
    }
    try {
        let result = await queryListen("SELECT * FROM category WHERE parent_category_id "+optr+"");
        res.status(200).json({"statusCode": 200, "status": true, "statusText": "ok","response":result });   
    } catch (error) {
        res.status(200).json({"statusCode": 200, "status": true, "statusText": "ok",error });  
    }
    
}

export async function deleteCategory(req,res){
  let {id,main_category}=req.body;
  if(main_category =='1'){
    query ="DELETE FROM category WHERE id = "+id+" AND 	parent_category_id IS NULL AND level ='1'"
  }else{
    query ="DELETE FROM category WHERE id = "+id+""
  }
  let result = await queryListen(query)
  if(result.affectedRows){
    res.status(200).json({"statusCode": 200, "status": true, "statusText": "delete category successfully" });  
  }else{
    res.status(200).json({"statusCode": 200, "status": true, "statusText": "failed..!" });  
  }
}