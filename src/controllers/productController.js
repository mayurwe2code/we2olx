// import products from "razorpay/dist/types/products.js";
import { imageSave } from "../common/fileSaver.js";
import { queryListen, queryListen1 } from "../common/querylistener.js";
import {
  sendNotification,
  setNotification,
} from "../common/push_notification.js";

export async function addproducts(req, res) {
  let { user_id, category_id, product_name, tag, detail, description, price, latitude, longitude, pickup_location, drop_off_location, price_per_hour, price_per_day, necessary_documents_for_booking, currently_avalilabel, when_available, Fee_after_expiry_of_time_period, conditions_and_rules, available_on_rent, extra_charges_for_wear_and_tear} = req.body;
  let tags = Object.values(detail).join(',')
  tags += "," + tag
  console.log(tags)
  let detailStr = JSON.stringify(detail)
  let query = `INSERT INTO \`ad_product\`(\`user_id\`, \`category_id\`, \`product_name\`, \`tag\`, \`detail\`, \`description\`, \`price\`, \`latitude\`, \`longitude\`,\`pickup_location\`, \`drop_off_location\`, \`price_per_hour\`, \`price_per_day\`, \`necessary_documents_for_booking\`, \`currently_avalilabel\`, \`when_available\`, \`Fee_after_expiry_of_time_period\`, \`conditions_and_rules\`, \`available_on_rent\`, \`extra_charges_for_wear_and_tear\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
  let values = [req.user_id, category_id, product_name, tags, detailStr, description, price, latitude, longitude,pickup_location, drop_off_location, price_per_hour, price_per_day, necessary_documents_for_booking, currently_avalilabel, when_available, Fee_after_expiry_of_time_period, conditions_and_rules, available_on_rent, extra_charges_for_wear_and_tear];
  // let query = `INSERT INTO \`ad_product\`(\`user_id\`, \`category_id\`, \`product_name\`, \`tag\`, \`detail\`, \`description\`, \`price\`, \`latitude\`, \`longitude\`) VALUES ("${user_id}","${category_id}","${product_name}","${tag}","${detailStr}","${description}","${price}","${latitude}","${longitude}")`;
  // return false
  try {
    let response = await queryListen1(query, values);
    let insert_id = response["insertId"]
    res.send({ statusCode: 200, status: true, statusText: "product added successfully", product_id: insert_id })
  } catch (error) {
    // Handle errors here
    res.status(500).send({ statusCode: 500, status: false, statusText: "find error", error: "An error occurred" });
  }
}

export async function getProducts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const reqBody = Object.keys(req.body);
  let { price_from, price_to } = req.body
  const offset = (page - 1) * limit;
  let countQuery ="";
  let dataQuery ="";
  if(req.headers.user_token!=""&&req.headers.user_token!=undefined&&req.headers.user_token!=null){
    countQuery = "SELECT COUNT(*) AS total FROM ad_product WHERE is_active = 1 AND is_deleted=0 ";
    dataQuery = "SELECT `id`, `user_id`, `category_id`, `product_name`, `tag`, `detail`, `description`, `price`, `latitude`, `longitude`, `is_active`, `is_deleted`, `created_on`, `updated_on`,`sold_out`, `pickup_location`, `drop_off_location`, `price_per_hour`, `price_per_day`, `necessary_documents_for_booking`, `currently_avalilabel`, `when_available`, `Fee_after_expiry_of_time_period`, `conditions_and_rules`, `available_on_rent`, `extra_charges_for_wear_and_tear`,(SELECT GROUP_CONCAT(image_path) AS product_images FROM `product_image` WHERE product_id=id) AS product_images,(SELECT GROUP_CONCAT(image_path) AS product_images FROM `product_image` WHERE product_id=id AND 	image_position = 'cover') AS cover_image, (SELECT user_id FROM wishlist WHERE user_id = "+req.user_id+" AND product_id = id) AS wishlist FROM ad_product WHERE is_active = 1 AND is_deleted=0 ";
  }else{
    countQuery = 'SELECT COUNT(*) AS total FROM ad_product WHERE is_active = 1 AND is_deleted=0 ';
    dataQuery = "SELECT `id`, `user_id`, `category_id`, `product_name`, `tag`, `detail`, `description`, `price`, `latitude`, `longitude`, `is_active`, `is_deleted`, `created_on`, `updated_on`,`sold_out`, `pickup_location`, `drop_off_location`, `price_per_hour`, `price_per_day`, `necessary_documents_for_booking`, `currently_avalilabel`, `when_available`, `Fee_after_expiry_of_time_period`, `conditions_and_rules`, `available_on_rent`, `extra_charges_for_wear_and_tear`,(SELECT GROUP_CONCAT(image_path) AS product_images FROM `product_image` WHERE product_id=id) AS product_images,(SELECT GROUP_CONCAT(image_path) AS product_images FROM `product_image` WHERE product_id=id AND 	image_position = 'cover') AS cover_image FROM ad_product WHERE is_active = 1 AND is_deleted=0 ";
  }
  // let countQuery = 'SELECT COUNT(*) AS total FROM ad_product WHERE is_active = 1 AND is_deleted=0 ';
  // let dataQuery = `SELECT * FROM ad_product WHERE is_active = 1 AND is_deleted=0 `;

  function queryMaker(reqBody) {
    return new Promise((resolve, reject) => {
      reqBody.forEach((k, index) => {
        let r_b_value = req.body[k];
        if ((!["is_deleted", "is_active", "price_from", "price_to"].includes(k)) && (r_b_value || r_b_value == '0')) {
          if (k == "search") {
            countQuery += ` AND (product_name LIKE '%${r_b_value}%'||tag LIKE '%${r_b_value}%') `
            dataQuery += ` AND (product_name LIKE '%${r_b_value}%'||tag LIKE '%${r_b_value}%') `
          } else {
            if(typeof r_b_value == 'string'){
              countQuery += ` AND ${k} = ${r_b_value} `
              dataQuery += ` AND ${k} = ${r_b_value} `
            }else{
              r_b_value.forEach((item,index)=>{
if(index==0){
  countQuery += ` AND ( `
dataQuery +=` AND ( `
}  
                if(index == r_b_value.length-1){
                  countQuery += ` ${k} LIKE '%${item}%') `
                  dataQuery += `  ${k} LIKE '%${item}%') `
                }else{
                  countQuery += ` ${k} LIKE '%${item}%' || `
                  dataQuery += `  ${k} LIKE '%${item}%' || `
                }
              })
      
              // countQuery += ` AND ${k} IN (${"'"+r_b_value.join("','")+"'"}) `
              // dataQuery +=  `AND ${k} IN (${"'"+r_b_value.join("','")+"'"}) `
            }
            
          }
        }
        if (index == reqBody.length - 1){
          if (price_from && price_to) {
            countQuery += `AND (price >= ${price_from} AND price <= ${price_to}) `
            dataQuery += `AND (price >= ${price_from} AND price <= ${price_to}) `
          } else if (price_from) {
            countQuery += `AND (price >= ${price_from}) `
            dataQuery += `AND (price >= ${price_from}) `
          } else if (price_to) {
            countQuery += `AND (price <= ${price_to}) `
            dataQuery += `AND (price <= ${price_to}) `
          } else {

          }
          resolve([`${dataQuery} LIMIT ${limit} OFFSET ${offset} `, `${countQuery} LIMIT ${limit} OFFSET ${offset} `]);
        };
      });
    });
  };
  try {
    dataQuery = await queryMaker(reqBody)
    let countResults = await queryListen(dataQuery[1]);
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / limit);
    let dataResults = await queryListen(dataQuery[0]);

    const responseData = {
      statusText: "ok",
      statusCode: 200,
      status: true,
      totalRecords,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      currentPage: page,
      data: dataResults,
    };
    res.status(200).json(responseData);
  } catch (err) {
    console.log(err)
    const responseData = {
      statusCode: 500,
      statusText: "Failed to count data",
      status: false,
      totalRecords: 0,
      totalPages: 0,
      nextPage: null,
      prevPage: null,
      currentPage: null,
      data: [],
    }
    res.status(500).json(responseData);
  }
}

export async function updateProduct(req, res) {
  let req_key = Object.keys(req.body);
  let detail = JSON.stringify(req.body.detail)
  let query = "";
  if (!req.body.id) {
    res.send({ statusCode: 200, status: false, statusText: "please provide id" })
    return false
  }
  function queryMaker(req_body) {
    return new Promise((resolve, reject) => {
      req_key.forEach((key, index) => {
        if (index === 0) {
          query += "UPDATE `ad_product` SET "
        }
        let keys_value = req_body[key];
        if (!["is_delete", "detail", "user_id", "category_id"].includes(key)) {
          query += `${key}='${keys_value}' ,`;
        }
        if (index === req_key.length - 1) {
          query += `detail ='${detail}' ,`
          query = query.slice(0, -1);
          query = `${query} WHERE id = '${req.body.id} AND user_id = ${req.user_id}'`
          resolve(query)
        }
      })
    })
  }
  query = await queryMaker(req.body)
  let response = await queryListen(query);
  if (response.changedRows) {
    res.send({ statusCode: 200, status: true, statusText: "product updated successfully", updateProduct: response.changedRows })
  } else {
    res.send({ statusCode: 200, status: false, statusText: "find some error" })
  }
}

export async function add_product_images(req,res) {
  let query = ""

  let { product_id, image_position, image_name, image_description, imgBase64 }
    = req.body;

    if (imgBase64 != "") {
      try {
        let saveImgData = await imageSave("product_images", image_name, imgBase64);
        let image_path_  = `${req.protocol}://${req.headers.host}${saveImgData["image_path"]}`
        console.log('saveImgData:-', JSON.stringify(saveImgData));
          query = "INSERT INTO `product_image`(`product_id`, `user_id`, `image_position`, `image_name`, `image_description`, `image_path`, `status`, `is_deleted`) VALUES ('" + product_id + "','" + 1 + "','" + image_position + "','" + saveImgData["image_name"] + "','" + image_description + "','" +image_path_+ "','" + 1 + "','" + 1 + "')"
          try {
            let response = await queryListen(query)
            let insert_id = response["insertId"]
            res.send({ statusCode: 200, status: true, statusText: "product added successfully", image_id: insert_id }) 
          } catch (error) {
            res.send({ statusCode: 200, status: false, statusText: "find error",error }) 
          }
      } catch (error) {
        res.status(200).send({ status: false, statusCode: 200, statusText: "image not save find error",error:error["message"] }) 
      }
    } else {
      res.status(200).send({ status: false, statusCode: 200, statusText: "bad request - base64 url blank"})
    }

}

export async function update_product_images(req, res) {

  console.log(update_product_images);
  let query = ""
  console.log("add_product_images");
  let { product_id, product_image_id, image_position, image_name, image_description, imgBase64 }
    = req.body;
    
  if (imgBase64 != "") {
    try {
      let saveImgData = await imageSave("product_images", image_name, imgBase64);
      query = "UPDATE `product_image` SET `image_position`='" + image_position + "',`image_name`='" + saveImgData["image_name"] + "',`image_description`='" + image_description + "',`image_path`='" + saveImgData["image_path"] + "' WHERE user_id = " + req.user_id + " AND product_image_id =" + product_image_id + ""
    } catch (error) {
      res.status(200).send({ status: false, statusCode: 200, message: "image not save find error",error }) 
    }
  } else {
    query = "UPDATE `product_image` SET `image_position`='" + image_position + "',`image_name`='" + saveImgData["image_name"] + "',`image_description`='" + image_description + "' WHERE user_id = " + req.user_id + " AND product_image_id =" + product_image_id + ""
  }

  let response = await queryListen(query)
  res.send({ statusCode: 200, status: true, statusText: "image updated successfully", image_id: response })
}

export async function delete_image_images(req, res) {
  let query = "DELETE FROM `product_image` WHERE id = " + req.body.id + "";
  let response = await queryListen(query);
  if (response.affectedRows) {
    res.send({ statusCode: 200, status: true, statusText: "delete successfull", })
  } else {
    res.send({ statusCode: 200, status: false, statusText: "delete failed", })
  }
};
